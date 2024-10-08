import { MessageRepositoryInteface } from "../../domain/repository/message-repository.interface";
import AudioServiceInterface from "../../domain/service/audio-service.interface";
import TranscriptionServiceInterface from "../../domain/service/transcription-service.interface";
import { MessageDTO } from "./message.dto";  // Your data transfer object

export class TranscribeMassageUseCase {
    constructor(
        private transcriptionService: TranscriptionServiceInterface,
        private audioService: AudioServiceInterface,
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
        
        if(!newMessage.isMediaMessage()){
            console.log('Messagem não tem midia!')
            return undefined;
        }
    
        this.messageRepository.add(newMessage);
        const mp3Path = await this.audioService.download(newMessage.mediaUrl0);
        const transcription = await this.transcriptionService.trascribe(mp3Path);

        newMessage.setTranscriptionText(transcription);
        this.messageRepository.update(newMessage.smsMessageSid, newMessage);

        return transcription;

        
    }
    
}
