"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManagementModule = void 0;
const common_1 = require("@nestjs/common");
const employee_register_controller_1 = require("./employee-register/employee-register.controller");
const employee_register_service_1 = require("./employee-register/employee-register.service");
const messages_module_1 = require("./messages/messages.module");
let TaskManagementModule = class TaskManagementModule {
};
TaskManagementModule = __decorate([
    (0, common_1.Module)({
        controllers: [employee_register_controller_1.EmployeeRegisterController],
        providers: [employee_register_service_1.EmployeeRegisterService],
        imports: [messages_module_1.MessagesModule],
    })
], TaskManagementModule);
exports.TaskManagementModule = TaskManagementModule;
//# sourceMappingURL=task-management.module.js.map