import * as dotenv from 'dotenv';
dotenv.config();
import { Twilio } from 'twilio';

// Load environment variables from .env file


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// Check if account SID and auth token are defined
if (!accountSid || !authToken) {
    throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be defined');
}

// Initialize Twilio client
const client = new Twilio(accountSid, authToken);

// Function to send a message
export const sendMessage = async (from: string, to: string, body: string) => {
    try {
        const message = await client.messages.create({
            from,
            to,
            body,
        });
        console.log('Message sent:', message.sid);
    } catch (error) {
        // Type guard to ensure error is an instance of Error
        if (error instanceof Error) {
            console.error('Error sending message:', error.message);
        } else {
            console.error('Unknown error sending message:', error);
        }
        throw error; // Rethrow the error to handle it in the route
    }
};
