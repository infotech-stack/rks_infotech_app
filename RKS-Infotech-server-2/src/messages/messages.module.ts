import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MessageController } from './controller/message.controller';
import { PushNotificationController } from './controller/push-notification.controller';
import { PushNotificationService } from './services/push-notification.service';

@Module({
  providers: [MessagesGateway, MessagesService,PushNotificationService],
  controllers:[MessageController,PushNotificationController],
})
export class MessagesModule {}
