import AudioServiceInterface from "../domain/service/audio-service.interface";

export class AudioService implements AudioServiceInterface{
    async download(url: string): Promise<string> {
        return '';
    }
}