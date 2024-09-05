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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const common_1 = require("@nestjs/common");
const messages_service_1 = require("./messages.service");
const path = require("path");
const platform_express_1 = require("@nestjs/platform-express");
const fs = require("fs");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
let MessageController = class MessageController {
    constructor(_messageService) {
        this._messageService = _messageService;
    }
    saveMessage(message) {
        try {
            return this._messageService.saveMessage(message);
        }
        catch (error) {
            throw error;
        }
    }
    getMessages(sender_id, receiver_id) {
        try {
            return this._messageService.getMessages(sender_id, receiver_id);
        }
        catch (error) {
            throw error;
        }
    }
    async uploadFiles(files, body) {
        var _a;
        const fileNames = ((_a = files.files) === null || _a === void 0 ? void 0 : _a.map(file => file.filename)) || [];
        return {
            message: 'Files uploaded successfully',
            data: fileNames
        };
    }
    async downloadFile(res, empId, filename) {
        const filePath = path.join(__dirname, '..', '..', 'src', 'assets', 'uploads', empId, filename);
        try {
            if (fs.existsSync(filePath)) {
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
                res.sendFile(filePath);
            }
            else {
                res.status(common_1.HttpStatus.NOT_FOUND).send('File not found');
            }
        }
        catch (err) {
            console.error('Error retrieving file:', err);
            res.status(common_1.HttpStatus.INTERNAL_SERVER_ERROR).send('Server Error');
        }
    }
};
__decorate([
    (0, common_1.Post)('post-message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "saveMessage", null);
__decorate([
    (0, common_1.Get)('get-message'),
    __param(0, (0, common_1.Query)('sender_id')),
    __param(1, (0, common_1.Query)('receiver_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], MessageController.prototype, "getMessages", null);
__decorate([
    (0, common_1.Post)('upload-files'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'files', maxCount: 10 }
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const assignTo = req.body.assignTo;
                let empIds = [];
                try {
                    empIds = JSON.parse(assignTo).map((id) => Number(id));
                }
                catch (e) {
                    return cb(new Error('Invalid employee IDs format'), null);
                }
                if (!empIds.length) {
                    return cb(new Error('No employee IDs provided'), null);
                }
                empIds.forEach(empId => {
                    const uploadDir = path.join(__dirname, '..', '..', 'src', 'assets', 'uploads', empId.toString());
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                });
                const primaryEmpId = empIds[0];
                const uploadDir = path.join(__dirname, '..', '..', 'src', 'assets', 'uploads', primaryEmpId.toString());
                cb(null, uploadDir);
            },
            filename: (req, file, cb) => {
                const empId = JSON.parse(req.body.assignTo)[0];
                const filename = `${empId}-${file.originalname}`;
                cb(null, filename);
            }
        })
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Get)('download-files'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('empId')),
    __param(2, (0, common_1.Query)('filename')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], MessageController.prototype, "downloadFile", null);
MessageController = __decorate([
    (0, common_1.Controller)('messages'),
    __metadata("design:paramtypes", [messages_service_1.MessagesService])
], MessageController);
exports.MessageController = MessageController;
//# sourceMappingURL=messages.controller.js.map