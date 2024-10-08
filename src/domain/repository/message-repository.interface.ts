import { Message } from "../entities/message";

export interface MessageRepositoryInteface{
    add(message: Message): Message;
    findById(id: string): Message | undefined;
    update(id: string, updateMessage: Message):Message | undefined;
}