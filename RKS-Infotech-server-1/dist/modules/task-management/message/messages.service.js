"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const app_module_1 = require("../../../app.module");
const response_message_enum_1 = require("../../../models/enum/response-message.enum");
let MessagesService = class MessagesService {
    async saveMessage(message) {
        const filename = JSON.stringify(message.filename);
        await app_module_1.dbConnection.query(`
        INSERT INTO task_management.employee_messages
        (
        sender_id,
        receiver_id,
        message,
        filename
        )
        VALUES(?,?,?,?)
        `, [
            message.sender_id,
            message.receiver_id,
            message.message,
            filename
        ]);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: response_message_enum_1.ResponseMessageEnum.ADD,
            data: message
        };
    }
    async getMessages(senderId, receiverId) {
        const messages = await app_module_1.dbConnection.query(`
      SELECT * FROM task_management.employee_messages
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) AND is_deleted = 0
      ORDER BY timestamp ASC;
    `, [senderId, receiverId, receiverId, senderId]);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: response_message_enum_1.ResponseMessageEnum.GET,
            data: messages
        };
    }
};
MessagesService = __decorate([
    (0, common_1.Injectable)()
], MessagesService);
exports.MessagesService = MessagesService;
//# sourceMappingURL=messages.service.js.map