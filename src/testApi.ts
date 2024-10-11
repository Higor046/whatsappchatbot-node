import axios, { AxiosError } from 'axios';

const TWILIO_ACCOUNT_SID = 'ACf78a06be4431c8ae3d8591a0d9b9da24'; // Seu Account SID
const TWILIO_AUTH_TOKEN = 'ac0556ad39e84d25d7c0e084366b4133'; // Seu Auth Token
const MESSAGE_SID = 'MM1b20d589d6788c3272c3f186b57beb8f'; // SID da mensagem
const MEDIA_SID = 'ME8261cf91006c399cb4884bb5861de8d0'; // SID do mídia

const getMediaFromTwilio = async () => {
    try {
        const response = await axios.get(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages/${MESSAGE_SID}/Media/${MEDIA_SID}`, {
            auth: {
                username: TWILIO_ACCOUNT_SID,
                password: TWILIO_AUTH_TOKEN
            },
            responseType: 'arraybuffer', // Para lidar com a mídia binária
        });
        console.log('Mídia recebida com sucesso:', response.data);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Erro na requisição Axios:', error.response?.status, error.response?.data);
        } else {
            console.error('Erro desconhecido:', error);
        }
    }
};

getMediaFromTwilio();
