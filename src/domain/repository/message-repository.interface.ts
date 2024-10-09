import { Message } from "../entities/message";

export interface MessageRepositoryInteface{
    add(message: Message): Promise<void>;
    update(id: string, updateMessage: Message):Promise<void>;
}