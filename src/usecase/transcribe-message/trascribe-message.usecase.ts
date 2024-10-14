import { MessageRepositoryInteface } from "../../domain/repository/message-repository.interface";
import AudioServiceInterface from "../../domain/service/audio-service.interface";
import TranscriptionServiceInterface from "../../domain/service/transcription-service.interface";
import { MessageDTO } from "./message.dto";  // Your data transfer object
import { Message } from "../../domain/entities/message";  // Import the Message class
import SummarizeServiceInterface from "../../domain/service/summarize-service.interface";

export class TranscribeMessageUseCase {
    constructor(
        private transcriptionService: TranscriptionServiceInterface,
        private audioService: AudioServiceInterface,
        private summarizationService: SummarizeServiceInterface,
        private messageRepository: MessageRepositoryInteface,
    ) {}

    async execute(messageData: MessageDTO): Promise<string | undefined> {
        const newMessage = new Message(
            messageData.smsMessageSid,
            messageData.mediaContentType0,
            messageData.numMedia,
            messageData.profileName,
            messageData.waId,
            messageData.body,
            messageData.to,
            messageData.from,
            messageData.mediaUrl0
        );
        
        if (!newMessage.isMediaMessage()) {
            console.log('Message does not contain media!');
            return undefined;
        }
    
        await this.messageRepository.add(newMessage);  // Ensure async operations
        const mp3Path = await this.audioService.download(newMessage.mediaUrl0);
        const transcription = await this.transcriptionService.transcribe(mp3Path);  // Use 'trascribe' here

        if(transcription.length > 500){
            const summarizedTrancription = await this.summarizationService.summarize(transcription);
            newMessage.setTranscriptionText(summarizedTrancription);
            this.messageRepository.update(newMessage.smsMessageSid,newMessage);
            return summarizedTrancription;
        }

        newMessage.setTranscriptionText(transcription);
        await this.messageRepository.update(newMessage.smsMessageSid, newMessage);

        return transcription;
    }
}
