// transcription-service.interface.ts
export default interface TranscriptionServiceInterface {
    transcribe(audioPath: string): Promise<string>;
}
