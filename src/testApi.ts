import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = 'ACf78a06be4431c8ae3d8591a0d9b9da24'; // Seu Account SID
const TWILIO_AUTH_TOKEN = 'ac0556ad39e84d25d7c0e084366b4133'; // Seu Auth Token
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
