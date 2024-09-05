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
exports.EmployeeRegisterController = void 0;
const common_1 = require("@nestjs/common");
const register_employee_dto_1 = require("../../../models/dto/register-employee.dto");
const employee_register_service_1 = require("./employee-register.service");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = require("path");
const swagger_1 = require("@nestjs/swagger");
const fs = require("fs");
let EmployeeRegisterController = class EmployeeRegisterController {
    constructor(_employeeRegisterService) {
        this._employeeRegisterService = _employeeRegisterService;
        this.ensureUploadsPathExists();
    }
    async loginMethod(employee_name, employee_password) {
        try {
            return this._employeeRegisterService.loginMethod(employee_name, employee_password);
        }
        catch (error) {
            throw error;
        }
    }
    async logoutMethod(empId) {
        try {
            return this._employeeRegisterService.logoutMethod(empId);
        }
        catch (error) {
            throw error;
        }
    }
    async getAllEmployee() {
        try {
            return await this._employeeRegisterService.getAllEmployee();
        }
        catch (error) {
            throw error;
        }
    }
    async employeeForMessage(roles) {
        try {
            return await this._employeeRegisterService.employeeForMessage(roles);
        }
        catch (error) {
            throw error;
        }
    }
    async getEmployee(empId, current_page, page_size, getEmployeeDto) {
        try {
            const { roles } = getEmployeeDto;
            return this._employeeRegisterService.getEmployee(empId, roles, current_page, page_size);
        }
        catch (error) {
            throw error;
        }
    }
    async registerEmployee(registerDetails) {
        try {
            return this._employeeRegisterService.registerEmployee(registerDetails);
        }
        catch (error) {
            throw error;
        }
    }
    async updateEmployee(empId, registerDetails) {
        try {
            return this._employeeRegisterService.updateEmployee(empId, registerDetails);
        }
        catch (error) {
            throw error;
        }
    }
    async removeEmployee(empid) {
        try {
            return this._employeeRegisterService.removeEmployee(empid);
        }
        catch (error) {
            throw error;
        }
    }
    async getEmployeeRole() {
        try {
            return await this._employeeRegisterService.getEmployeeRole();
        }
        catch (error) {
            throw error;
        }
    }
    async getEmployeeAccess() {
        try {
            return await this._employeeRegisterService.getEmployeeAccess();
        }
        catch (error) {
            throw error;
        }
    }
    async getEmployeeAttendance(current_page, page_size, all) {
        try {
            console.log(current_page, page_size, all, 'att');
            return this._employeeRegisterService.employeeAttendance(current_page, page_size, all);
        }
        catch (error) {
            throw error;
        }
    }
    async getTasksByRole(empId, getTasksByRoleDto, current_page, page_size, sort_field, sort_order) {
        const { roles } = getTasksByRoleDto;
        const currentPage = current_page > 0 ? current_page : 1;
        const pageSize = page_size > 0 ? page_size : 5;
        return this._employeeRegisterService.getTasksByRole(empId, roles, current_page, page_size, sort_field, sort_order);
    }
    async taskAssignToEmployee(formData) {
        try {
            return this._employeeRegisterService.taskAssignToEmployee(formData);
        }
        catch (error) {
            throw error;
        }
    }
    async updateTask(task_id, selected_empid, message_id, registerDetails) {
        try {
            return this._employeeRegisterService.updateTask(task_id, selected_empid, message_id, registerDetails);
        }
        catch (error) {
            throw error;
        }
    }
    async deleteTask(task_id, message_id, empId) {
        try {
            return this._employeeRegisterService.deleteTask(task_id, empId, message_id);
        }
        catch (error) {
            throw error;
        }
    }
    async searchEmployeeById(empId) {
        try {
            return this._employeeRegisterService.searchEmployeeById(empId);
        }
        catch (error) {
            throw error;
        }
    }
    async taskReports(empId, task_id, status) {
        try {
            console.log(status, 'controllr');
            return this._employeeRegisterService.taskReports(empId, task_id, status);
        }
        catch (error) {
            throw error;
        }
    }
    async uploadFiles(files, taskAssignDto) {
        var _a;
        console.log(taskAssignDto);
        const fileNames = ((_a = files.files) === null || _a === void 0 ? void 0 : _a.map(file => file.filename)) || [];
        return {
            message: 'Task assigned successfully',
            data: fileNames
        };
    }
    ensureUploadsPathExists() {
        const uploadPath = path.resolve(__dirname, '..', '..', 'src', 'assets', 'uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
    }
    async getFile(res, fileName) {
        const filePath = path.join(__dirname, '..', '..', 'src', 'assets', 'uploads', fileName);
        try {
            if (fs.existsSync(filePath)) {
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
    async postMessage(message) {
        try {
            return this._employeeRegisterService.postMessage(message);
        }
        catch (error) {
            throw error;
        }
    }
    async getMessage(empId) {
        try {
            return this._employeeRegisterService.getMessage(empId);
        }
        catch (error) {
            throw error;
        }
    }
    resetPassword(empId, resetDetails) {
        try {
            return this._employeeRegisterService.resetpassword(empId, resetDetails);
        }
        catch (error) {
            throw error;
        }
    }
    async filterEmployee(empId, login_date_from, login_date_to) {
        try {
            return this._employeeRegisterService.employeeFilter(empId, login_date_from, login_date_to);
        }
        catch (error) {
        }
    }
};
__decorate([
    (0, common_1.Get)('login'),
    __param(0, (0, common_1.Query)('employee_name')),
    __param(1, (0, common_1.Query)('employee_password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "loginMethod", null);
__decorate([
    (0, common_1.Put)('logout'),
    __param(0, (0, common_1.Query)('empId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "logoutMethod", null);
__decorate([
    (0, common_1.Get)('get-all-employee'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "getAllEmployee", null);
__decorate([
    (0, common_1.Get)('employee-for-message'),
    __param(0, (0, common_1.Query)('roles')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "employeeForMessage", null);
__decorate([
    (0, common_1.Post)('get-employee'),
    __param(0, (0, common_1.Query)('empId')),
    __param(1, (0, common_1.Query)('current_page')),
    __param(2, (0, common_1.Query)('page_size')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, register_employee_dto_1.GetTaskByRolesDto]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "getEmployee", null);
__decorate([
    (0, common_1.Post)('insert-employee'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_employee_dto_1.InsertEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "registerEmployee", null);
__decorate([
    (0, common_1.Put)('update-employee'),
    __param(0, (0, common_1.Query)('empId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, register_employee_dto_1.InsertEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Delete)('remove-employee'),
    __param(0, (0, common_1.Query)('empId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "removeEmployee", null);
__decorate([
    (0, common_1.Get)('get-employee-role'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "getEmployeeRole", null);
__decorate([
    (0, common_1.Get)('get-employee-access'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "getEmployeeAccess", null);
__decorate([
    (0, common_1.Get)('employee-attendance'),
    __param(0, (0, common_1.Query)('current_page')),
    __param(1, (0, common_1.Query)('page_size')),
    __param(2, (0, common_1.Query)('all')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Boolean]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "getEmployeeAttendance", null);
__decorate([
    (0, common_1.Post)('get-Tasks-ByRole'),
    __param(0, (0, common_1.Query)('empId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('current_page')),
    __param(3, (0, common_1.Query)('page_size')),
    __param(4, (0, common_1.Query)('sort_field')),
    __param(5, (0, common_1.Query)('sort_order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, register_employee_dto_1.GetTaskByRolesDto, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "getTasksByRole", null);
__decorate([
    (0, common_1.Post)('task-assign-to-employee'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_employee_dto_1.TaskAssignDto]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "taskAssignToEmployee", null);
__decorate([
    (0, common_1.Put)('update-task'),
    __param(0, (0, common_1.Query)('task_id')),
    __param(1, (0, common_1.Query)('selected_empid')),
    __param(2, (0, common_1.Query)('message_id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, register_employee_dto_1.TaskWithMessageDto]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "updateTask", null);
__decorate([
    (0, common_1.Put)('delete-task'),
    __param(0, (0, common_1.Query)('task_id')),
    __param(1, (0, common_1.Query)('message_id')),
    __param(2, (0, common_1.Query)('empId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "deleteTask", null);
__decorate([
    (0, common_1.Get)('search-employee-by-id'),
    __param(0, (0, common_1.Query)('empId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "searchEmployeeById", null);
__decorate([
    (0, common_1.Put)('task-reports'),
    __param(0, (0, common_1.Query)('empId')),
    __param(1, (0, common_1.Query)('task_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, register_employee_dto_1.TaskReportsDto]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "taskReports", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'files', maxCount: 10 }
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                cb(null, path.join(__dirname, '..', '..', 'src', 'assets', 'uploads'));
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`);
            }
        })
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, register_employee_dto_1.InsertMessageDto]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "uploadFiles", null);
__decorate([
    (0, common_1.Get)('getFile'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Query)('file')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "getFile", null);
__decorate([
    (0, common_1.Post)('post-message'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_employee_dto_1.TaskWithMessageDto]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "postMessage", null);
__decorate([
    (0, common_1.Get)('get-message'),
    __param(0, (0, common_1.Query)('empId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "getMessage", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Query)('empId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, register_employee_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], EmployeeRegisterController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('employee-filter'),
    __param(0, (0, common_1.Query)('empId')),
    __param(1, (0, common_1.Query)('login_date_from')),
    __param(2, (0, common_1.Query)('login_date_to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Date,
        Date]),
    __metadata("design:returntype", Promise)
], EmployeeRegisterController.prototype, "filterEmployee", null);
EmployeeRegisterController = __decorate([
    (0, common_1.Controller)('employee-register'),
    __metadata("design:paramtypes", [employee_register_service_1.EmployeeRegisterService])
], EmployeeRegisterController);
exports.EmployeeRegisterController = EmployeeRegisterController;
//# sourceMappingURL=employee-register.controller.js.map