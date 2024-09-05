import { MessagesService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';
export declare class MessagesGateway {
    private readonly messagesService;
    server: Server;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto, client: Socket): Promise<{
        name: any;
        text: string;
    }>;
    findAll(): Promise<import("./entities/message.entity").Message[]>;
    joinRoom(name: string, client: Socket): Promise<void>;
    typing(isTyping: boolean, client: Socket): Promise<void>;
}
