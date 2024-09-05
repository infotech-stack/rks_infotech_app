import { Module } from '@nestjs/common';
import { MessageController } from './message/messages.controller';
import { MessagesGateway } from './message/messages.gateway';
import { MessagesService } from './message/messages.service';
import { PushNotificationController } from './push-notification/push-notification.controller';
import { PushNotificationService } from './push-notification/push-notification.service';

@Module({
    providers: [MessagesGateway, MessagesService,PushNotificationService],
    controllers:[MessageController,PushNotificationController],
})
export class MessagesModule {}
