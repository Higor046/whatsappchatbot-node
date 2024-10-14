import dotenv from 'dotenv';
import twilio from 'twilio';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID; // Seu Account SID do Twilio
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;   // Seu Auth Token do Twilio

// Verifica se as variáveis de ambiente foram carregadas corretamente
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    console.error('Erro: As variáveis TWILIO_ACCOUNT_SID e TWILIO_AUTH_TOKEN não foram encontradas.');
    process.exit(1); // Encerra o processo caso as variáveis não estejam definidas
} else{
    console.log('Sid:',TWILIO_ACCOUNT_SID);
    console.log('Auth:',TWILIO_AUTH_TOKEN);
}

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const sendWhatsAppMessage = async () => {
    try {
        const message = await client.messages.create({
            from: 'whatsapp:+14155238886', // Número do WhatsApp do Twilio
            to: 'whatsapp:+5511947521710', // Seu número de telefone com código de país
            body: 'Hello, this is a test message from Twilio!'
        });
        console.log('Mensagem enviada com sucesso:', message.sid);
    } catch (error) {
        console.error('Erro ao enviar a mensagem:', error);
    }
};

sendWhatsAppMessage();
