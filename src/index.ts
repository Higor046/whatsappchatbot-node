import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { sendMessage } from './twilio';
import './commands';
import { getCommand } from './commandManager';
import { AudioService } from './infra/service/audio.service';
import { MessageMemoryRepository } from './infra/memory/message-memory.repository';
import { TranscribeMessageUseCase } from './usecase/transcribe-message/trascribe-message.usecase';
import { SummarizeService } from './infra/service/summarize.service';
import { TranscriptionService } from './infra/service/transcription.service';
import axios from 'axios';

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/whatsapp', async (req: Request, res: Response): Promise<void> => {
    const { SmsMessageSid, MediaContentType0, NumMedia, ProfileName, WaId, Body, To, From, MediaUrl0 } = req.body;

    // Log para acompanhar os dados recebidos
    console.log('Dados recebidos:', req.body);

    // Verifica se há mídia de áudio no formato correto
    if (NumMedia === '1' && MediaContentType0 === 'audio/ogg' && MediaUrl0?.length !== 0) {
        console.log('Recebido áudio válido para transcrição.');
        try {
            const audioService = new AudioService();
            const transcriptionService = new TranscriptionService();
            const summarizeService = new SummarizeService();
            const messageRepository = new MessageMemoryRepository();

            const transcribeMessageUseCase = new TranscribeMessageUseCase(
                transcriptionService,
                audioService,
                summarizeService,
                messageRepository
            );

            const response = await transcribeMessageUseCase.execute({
                smsMessageSid: SmsMessageSid,
                mediaContentType0: MediaContentType0,
                numMedia: NumMedia,
                profileName: ProfileName,
                waId: WaId,
                body: Body,
                to: To,
                from: From,
                mediaUrl0: MediaUrl0
            });

            if (!response) {
                console.warn('Resposta da transcrição vazia.');
                await sendMessage(To, From, 'Não foi possível transcrever a mensagem.');
                res.status(500).send('Erro ao transcrever a mensagem.');
                return;
            }

            console.log('Transcrição realizada com sucesso:', response);
            await sendMessage(To, From, response);
            res.status(200).send('Mensagem transcrita com sucesso.');
        } catch (error) {
            console.error('Erro ao transcrever a mensagem:', error);
            await sendMessage(To, From, 'Ocorreu um erro ao processar o áudio.');
            res.status(500).send('Erro ao processar o áudio.');
        }
        return;
    }

    // Validação de campos obrigatórios
    if (!To || !From || !Body || typeof Body !== 'string' || Body.trim() === '') {
        console.warn('Parâmetros ausentes ou inválidos:', { To, From, Body });
        res.status(400).send('Parâmetros "to", "from" ou "body" estão ausentes ou inválidos.');
        return;
    }

    // Log do comando recebido
    console.log(`Comando recebido: ${Body}`);

    // Processa o comando enviado via mensagem
    const [commandName, ...args] = Body.split(' ');
    const command = getCommand(commandName);

    try {
        if (command) {
            console.log(`Executando comando: ${commandName} com argumentos: ${args}`);
            const response = await command.execute(args); // Garantia que comando seja assíncrono
            await sendMessage(To, From, response);
            console.log('Resposta do comando enviada com sucesso.');
        } else {
            console.log(`Comando não reconhecido: ${commandName}`);
            await sendMessage(To, From, `Olá, envie um áudio para transcrição 
                \n ou envie "help" para uma lista de comandos disponíveis.`);
        }

        res.status(200).send();
    } catch (error) {
        console.error('Erro ao executar comando:', error);
        res.status(500).send('Erro ao processar a solicitação.');
    }
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
