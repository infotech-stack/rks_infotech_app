import { InsertMessagesInterface } from 'src/models/interface/insert-messages.interface';
import ResponseInterface from 'src/models/interface/response.interface';
export declare class MessagesService {
    saveMessage(message: InsertMessagesInterface): Promise<ResponseInterface>;
    getMessages(senderId: number, receiverId: number): Promise<ResponseInterface>;
}
