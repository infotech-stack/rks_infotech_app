"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileExtender = void 0;
const common_1 = require("@nestjs/common");
let FileExtender = class FileExtender {
    intercept(context, next) {
        const req = context.switchToHttp().getRequest();
        if (!req.files) {
            req.files = [];
        }
        req.body.projectName = req.body.projectName || '';
        req.body.startDate = req.body.startDate || '';
        req.body.endDate = req.body.endDate || '';
        req.body.projectStatus = req.body.projectStatus || '';
        req.body.taskName = req.body.taskName || '';
        req.body.assignTo = req.body.assignTo || '';
        return next.handle();
    }
};
FileExtender = __decorate([
    (0, common_1.Injectable)()
], FileExtender);
exports.FileExtender = FileExtender;
//# sourceMappingURL=fileExtender.interceptor.js.map