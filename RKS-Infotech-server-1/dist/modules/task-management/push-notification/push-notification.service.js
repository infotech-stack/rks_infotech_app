"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushNotificationService = void 0;
const common_1 = require("@nestjs/common");
const webPush = require("web-push");
const app_module_1 = require("../../../app.module");
let PushNotificationService = class PushNotificationService {
    constructor() {
        this.vapidKeys = {
            publicKey: 'BGwdw00ND8PykBD4bvVa5GeNtC3UfHQ9aDINzR92-hRd6XT3xhyvejA6B4K1zma9txXF_HeAuZBepWAfEBpoghI',
            privateKey: 's3lB4aCF_G1wCOK3NpEAhUzh8lW2g39udGQNlHCOdSM',
        };
        this.subscriptionMessages = new Map();
        webPush.setVapidDetails('mailto:example@yourdomain.org', this.vapidKeys.publicKey, this.vapidKeys.privateKey);
    }
    addSubscription(subscription, message) {
        const key = JSON.stringify(subscription);
        this.subscriptionMessages.set(key, message);
    }
    async getEmployeeNames(senderId, receiverId) {
        var _a, _b;
        const sender = await app_module_1.dbConnection.query(`
      SELECT employee_name FROM task_management.employee_register WHERE empId = ${senderId};
    `);
        const receiver = await app_module_1.dbConnection.query(`
      SELECT employee_name FROM task_management.employee_register WHERE empId = ${receiverId};
    `);
        return {
            senderName: ((_a = sender[0]) === null || _a === void 0 ? void 0 : _a.employee_name) || 'Unknown Sender',
            receiverName: ((_b = receiver[0]) === null || _b === void 0 ? void 0 : _b.employee_name) || 'Unknown Receiver',
        };
    }
    createPayload(title, message) {
        return JSON.stringify({
            notification: {
                title: title,
                body: message.message,
                data: { url: "https://www.youtube.com/watch?v=0vSEmEdYKro&list=PL4cSPhAvl8xUHh6ojmhFDGdMQmJWFcxrc&index=4" },
                icon: "https://th.bing.com/th/id/OIP.GRs93gl6W99txaf4ScCoNQAAAA?rs=1&pid=ImgDetMain",
            }
        });
    }
    async sendNotification() {
        for (const [subscriptionKey, message] of this.subscriptionMessages.entries()) {
            const subscription = JSON.parse(subscriptionKey);
            const { senderName, receiverName } = await this.getEmployeeNames(message.sender_id, message.receiver_id);
            const title = `Message from ${senderName} to ${receiverName}`;
            const payload = this.createPayload(title, message);
            try {
                await webPush.sendNotification(subscription, payload);
            }
            catch (error) {
                console.error('Error sending notification:', error);
            }
        }
        this.subscriptionMessages.clear();
    }
};
PushNotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PushNotificationService);
exports.PushNotificationService = PushNotificationService;
//# sourceMappingURL=push-notification.service.js.map