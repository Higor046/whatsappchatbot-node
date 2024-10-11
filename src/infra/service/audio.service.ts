import { v4 as uuidv4 } from "uuid";
import AudioServiceInterface from "../../domain/service/audio-service.interface";
import ffmpegPath from "@ffmpeg-installer/ffmpeg"; // Corrected import for ffmpeg path
import fs from "fs";
import os from "os";
import axios from "axios";
import { promisify } from "util";
import path from "path"; // Corrected import
import Ffmpeg from "fluent-ffmpeg";

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

export class AudioService implements AudioServiceInterface {
    private oggFilePath: string;
    private oggFileName: string;
    private mp3FilePath: string;
    private mp3FileName: string;
    private audioLoaded: boolean = false;

    constructor() {
        const name = uuidv4();
        this.oggFileName = `${name}.ogg`;
        this.mp3FileName = `${name}.mp3`;

        this.oggFilePath = path.join(os.tmpdir(), this.oggFileName);
        this.mp3FilePath = path.join(os.tmpdir(), this.mp3FileName);
    }

    async download(url: string): Promise<string> {
        const response = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' }); // Especifica ArrayBuffer como tipo de resposta
        const audioBuffer = Buffer.from(response.data); // Agora response.data é corretamente tipado como ArrayBuffer
        await writeFileAsync(this.oggFilePath, audioBuffer);
        this.audioLoaded = true;

        if (!this.audioLoaded) {
            throw new Error('Audio não carregado');
        }

        return new Promise((resolve, reject) => {
            Ffmpeg(this.oggFilePath)
                .setFfmpegPath(ffmpegPath.path)
                .output(this.mp3FilePath)
                .on('end', () => {
                    resolve(this.mp3FilePath);
                })
                .on('error', (err) => {
                    reject(err);
                })
                .run();
        });
    }
}
