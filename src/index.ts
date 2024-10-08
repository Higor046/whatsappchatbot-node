import express, {Request, Response} from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { sendMessage } from './twilio';
dotenv.config();

console.log(process.env.TWILIO_ACCOUNT_SID);

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.send ('Hello World!');
} );

app.get('/bots', (req: Request, res: Response) => {
    res.json({
        message: 'Listando todos os bots'
    })
})

app.post('/bots', async (req: Request, res: Response) => {
    const { from, to, body } = req.body;
    
    await sendMessage(from, to, body);
    
    res.send('Mensagem enviada!')
});

app.listen(port, () => console.log(`Servidor rodando em ${port}`));