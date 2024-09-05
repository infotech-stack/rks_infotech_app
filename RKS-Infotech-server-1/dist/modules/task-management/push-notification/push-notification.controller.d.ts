import { PushNotificationService } from './push-notification.service';
export declare class PushNotificationController {
    private readonly pushNotificationService;
    constructor(pushNotificationService: PushNotificationService);
    subscribe(body: any): Promise<{
        success: boolean;
    }>;
    sendNotification(): Promise<{
        success: boolean;
    }>;
}
