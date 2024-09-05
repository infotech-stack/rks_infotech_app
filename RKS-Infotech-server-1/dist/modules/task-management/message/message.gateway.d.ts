import { Server, Socket } from 'socket.io';
export declare class MessagesGateway {
    private server;
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleMessage(data: any): void;
}
