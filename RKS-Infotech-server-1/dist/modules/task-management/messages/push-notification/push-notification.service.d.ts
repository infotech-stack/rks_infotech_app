export declare class PushNotificationService {
    private readonly vapidKeys;
    private subscriptionMessages;
    constructor();
    addSubscription(subscription: any, message: any): void;
    private getEmployeeNames;
    private createPayload;
    sendNotification(): Promise<void>;
}
