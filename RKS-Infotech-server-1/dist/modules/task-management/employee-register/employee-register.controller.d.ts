/// <reference types="multer" />
import { GetTaskByRolesDto, InsertEmployeeDto, InsertMessageDto, ResetPasswordDto, TaskAssignDto, TaskReportsDto, TaskWithMessageDto } from 'src/models/dto/register-employee.dto';
import { EmployeeRegisterService } from './employee-register.service';
export declare class EmployeeRegisterController {
    private _employeeRegisterService;
    constructor(_employeeRegisterService: EmployeeRegisterService);
    loginMethod(employee_name: string, employee_password: string): Promise<import("../../../models/interface/response.interface").default>;
    logoutMethod(empId: number): Promise<import("../../../models/interface/response.interface").default>;
    getAllEmployee(): Promise<import("../../../models/interface/response.interface").default>;
    employeeForMessage(roles: string[]): Promise<import("../../../models/interface/response.interface").default>;
    getEmployee(empId: number, current_page: number, page_size: number, getEmployeeDto: GetTaskByRolesDto): Promise<import("../../../models/interface/response.interface").default>;
    registerEmployee(registerDetails: InsertEmployeeDto): Promise<import("../../../models/interface/response.interface").default>;
    updateEmployee(empId: number, registerDetails: InsertEmployeeDto): Promise<import("../../../models/interface/response.interface").default>;
    removeEmployee(empid: number): Promise<import("../../../models/interface/response.interface").default>;
    getEmployeeRole(): Promise<import("../../../models/interface/response.interface").default>;
    getEmployeeAccess(): Promise<import("../../../models/interface/response.interface").default>;
    getEmployeeAttendance(current_page?: number, page_size?: number, all?: boolean): Promise<import("../../../models/interface/response.interface").default>;
    getTasksByRole(empId: number, getTasksByRoleDto: GetTaskByRolesDto, current_page: number, page_size: number, sort_field: string, sort_order: string): Promise<import("../../../models/interface/response.interface").default>;
    taskAssignToEmployee(formData: TaskAssignDto): Promise<import("../../../models/interface/response.interface").default>;
    updateTask(task_id: number, selected_empid: number, message_id: number, registerDetails: TaskWithMessageDto): Promise<import("../../../models/interface/response.interface").default>;
    deleteTask(task_id: number, message_id: number, empId: number): Promise<import("../../../models/interface/response.interface").default>;
    searchEmployeeById(empId: number): Promise<import("../../../models/interface/response.interface").default>;
    taskReports(empId: number, task_id: number, status: TaskReportsDto): Promise<import("../../../models/interface/response.interface").default>;
    uploadFiles(files: {
        files?: Express.Multer.File[];
    }, taskAssignDto: InsertMessageDto): Promise<{
        message: string;
        data: string[];
    }>;
    ensureUploadsPathExists(): void;
    getFile(res: any, fileName: string): Promise<void>;
    postMessage(message: TaskWithMessageDto): Promise<import("../../../models/interface/response.interface").default>;
    getMessage(empId: number): Promise<import("../../../models/interface/response.interface").default>;
    resetPassword(empId: number, resetDetails: ResetPasswordDto): Promise<import("../../../models/interface/response.interface").default>;
    filterEmployee(empId: number, login_date_from: Date, login_date_to: Date): Promise<import("../../../models/interface/response.interface").default>;
}
