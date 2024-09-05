import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class GatewayGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleDisconnect(client: any): void;
    handleConnection(client: any, ...args: any[]): void;
    handleMessage(socket: Socket, message: any): void;
}
