import { v4 as uuidv4 } from "uuid";
import AudioServiceInterface from "../../domain/service/audio-service.interface";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";
import fs from "fs";
import os from "os";
import axios from "axios";
import { promisify } from "util";
import path from "path";
import Ffmpeg from "fluent-ffmpeg";

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const existsAsync = promisify(fs.exists);

export class AudioService implements AudioServiceInterface {
    private oggFilePath: string;
    private mp3FilePath: string;

    constructor() {
        const name = uuidv4();
        this.oggFilePath = path.join(os.tmpdir(), `${name}.ogg`);
        this.mp3FilePath = path.join(os.tmpdir(), `${name}.mp3`);
    }

    async download(url: string, token?: string): Promise<string> {
        if (!this.isValidUrl(url)) {
            throw new Error('Invalid URL format');
        }

        try {
            console.log(`Baixando áudio de: ${url}`);
            console.log(`Token: ${token ? 'Presente' : 'Não Presente'}`);
            
            const response = await axios.get(url, {
                responseType: 'arraybuffer',
                headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
            });
            const audioBuffer = Buffer.from(response.data);
            console.log(`Áudio baixado com sucesso. Salvando em: ${this.oggFilePath}`);
            await writeFileAsync(this.oggFilePath, audioBuffer);

            return await this.convertToMp3();
        } catch (error) {
            this.handleError('Erro ao baixar o áudio', error);
            throw new Error('Falha ao baixar o áudio');
        }
    }

    private async convertToMp3(): Promise<string> {
        try {
            if (!(await existsAsync(this.oggFilePath))) {
                throw new Error(`Arquivo OGG não encontrado: ${this.oggFilePath}`);
            }

            return await new Promise((resolve, reject) => {
                console.log(`Convertendo OGG para MP3: ${this.oggFilePath}`);
                Ffmpeg(this.oggFilePath)
                    .setFfmpegPath(ffmpegPath.path)
                    .output(this.mp3FilePath)
                    .on('end', async () => {
                        console.log(`Conversão concluída. MP3 salvo em: ${this.mp3FilePath}`);
                        try {
                            await unlinkAsync(this.oggFilePath); // Clean up OGG file
                            resolve(this.mp3FilePath);
                        } catch (cleanupError) {
                            console.error('Erro ao limpar arquivos temporários:', cleanupError);
                            reject(new Error(`Falha ao limpar arquivos temporários: ${String(cleanupError)}`));
                        }
                    })
                    .on('error', (err) => {
                        console.error('Erro durante a conversão:', err);
                        reject(new Error(`Erro de conversão: ${String(err)}`));
                    })
                    .run();
            });
        } catch (error) {
            console.error('Erro na conversão:', error);
            throw new Error(`Falha na conversão: ${String(error)}`);
        }
    }

    private handleError(message: string, error: unknown): void {
        console.error(message, error);
        if (axios.isAxiosError(error)) {
            console.error(`Status: ${error.response?.status}, Data: ${error.response?.data}`);
            throw new Error(`Falha ao baixar áudio: ${error.response?.status} - ${error.message}`);
        } else {
            throw new Error(`Falha ao baixar áudio: ${String(error)}`);
        }
    }

    private isValidUrl(url: string): boolean {
        const urlPattern = new RegExp('^(https?://)[^\\s/$.?#].[^\\s]*$'); // Simple URL validation
        return urlPattern.test(url);
    }
}
