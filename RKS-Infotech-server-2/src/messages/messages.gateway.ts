import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import{Server,Socket} from 'socket.io'

@WebSocketGateway({
  cors:{
    origin:'*'
  },
})
export class MessagesGateway {
  // @WebSocketServer()
  // server :Server;
  // constructor(private readonly messagesService: MessagesService) {}

  // @SubscribeMessage('createMessage')
  // async create(@MessageBody() createMessageDto: CreateMessageDto,
  // @ConnectedSocket() client:Socket) {
  //   const message=await this.messagesService.create(createMessageDto,client.id);
  //   this.server.emit('message',message);
  //   return message;
  // }

  // @SubscribeMessage('findAllMessages')
  // async findAll() {
  //   return this.messagesService.findAll();
  // }

 
  // @SubscribeMessage('join')
  // async  joinRoom(@MessageBody('name') name:string,@ConnectedSocket() client:Socket) 
  // {
  //   this.messagesService.identify(name,client.id);
  // }
  // @SubscribeMessage('typing')
  // async typing(@MessageBody('isTyping') isTyping:boolean,@ConnectedSocket() client:Socket) {
  // const name=await this.messagesService.getClientname(client.id);
  // client.broadcast.emit('typing',{name,isTyping});
  // }
  @WebSocketServer() server: Server;

  constructor(private readonly messagesService: MessagesService) {}
  afterInit(server: Server) {
    console.log('Init');
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
  @SubscribeMessage('message')
  async handleMessage(@MessageBody() createMessageDto:any): Promise<void> {
    const response = await this.messagesService.saveMessage(createMessageDto,1);
    this.server.emit('message', response.data);
  }

}
