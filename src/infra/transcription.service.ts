import TranscriptionServiceInterface from "../domain/service/transcription-service.interface";

export class transcriptionService implements TranscriptionServiceInterface{
    trascribe(audioUrl: string): Promise<string> {
        return Promise.resolve('');
    }
}