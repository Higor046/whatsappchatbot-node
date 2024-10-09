import axios, { Axios, AxiosResponse } from "axios";
import TranscriptionServiceInterface from "../../domain/service/transcription-service.interface";
import FormData from 'form-data';
import fs from 'fs';

export class TranscriptionService implements TranscriptionServiceInterface{
    private model: string;
    private url: string;

    constructor(){
        this.model = 'wisper-1';
        this.url = 'https://api.openai.com/v1/audio/transcriptions';
    }
    
    async trascribe(audioPath: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(audioPath));
        formData.append('model', this.model);

        const response: AxiosResponse = await axios.post(this.url, formData, {
            headers:{
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': `multipart/form-data;`,
            }
        });

        return Promise.resolve(response.data.text);
    }
}