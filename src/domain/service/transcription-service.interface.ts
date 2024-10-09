export default interface TranscriptionServiceInterface{
    trascribe(audioPath: string): Promise<string>;
}