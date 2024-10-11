import axios from "axios";
import TranscriptionServiceInterface from "../../domain/service/transcription-service.interface";
import FormData from 'form-data';
import fs from 'fs';

interface TranscriptionResponse {
    text: string;
}

export class TranscriptionService implements TranscriptionServiceInterface {
    private model: string;
    private url: string;

    constructor() {
        this.model = 'whisper-1'; // Corrected model name
        this.url = 'https://api.openai.com/v1/audio/transcriptions';
    }

    async transcribe(audioPath: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(audioPath));
        formData.append('model', this.model);

        const response = await axios.post<TranscriptionResponse>(this.url, formData, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': `multipart/form-data;`,
            }
        });

        return response.data.text;
    }
}
