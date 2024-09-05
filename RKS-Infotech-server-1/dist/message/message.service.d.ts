import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
export declare class MessagesService {
    messages: Message[];
    clientToUser: {};
    create(createMessageDto: CreateMessageDto, clientId: string): {
        name: any;
        text: string;
    };
    findAll(): Message[];
    identify(name: string, clientId: string): unknown[];
    getClientname(clientId: string): any;
    he(): void;
}
