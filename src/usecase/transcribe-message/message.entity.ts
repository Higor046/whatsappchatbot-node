// message.entity.ts

export class MessageEntity {
    constructor(
        public smsMessageSid: string,
        public mediaContentType0: string,
        public numMedia: string,
        public profileName: string,
        public waId: string,
        public body: string,
        public to: string,
        public from: string,
        public mediaUrl0: string
    ) {}
}
