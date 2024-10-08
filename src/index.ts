import * as dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { sendMessage } from './twilio';
import './commands';
import { getCommand } from './commandManager';

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/whatsapp', async (req: Request, res: Response): Promise<void> => {
    const { To, From, Body } = req.body;

    if (!To || !From || !Body || typeof Body !== 'string' || Body.trim() === '') {
        res.status(400).send('Parâmetros "to", "from" ou "body" estão ausentes ou inválidos.');
        return;
    }

    const [commandName, ...args] = Body.split(' ');

    const command = getCommand(commandName);

    try {
        if (command) {
            const response = command.execute(args);
            await sendMessage(To, From, response);
        } else {
            console.log(`Comando não reconhecido: ${commandName}`);
            await sendMessage(To, From, 'Comando não reconhecido. Envie "help" para lista de comandos disponíveis');
        }

        res.status(200).send();
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).send('Erro ao processar a solicitação.');
    }
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
