export default interface TranscriptionServiceInterface{
    trascribe(audioUrl: string): Promise<string>;
}