import { InsertEmployeeInterface, ResetPasswordInterface, TaskAssignInterface, TaskReportsInterface, TaskWithMessageInterface } from 'src/models/interface/register-employee.interface';
import ResponseInterface from 'src/models/interface/response.interface';
export declare class EmployeeRegisterService {
    constructor();
    loginMethod(employee_name: string, employee_password: string): Promise<ResponseInterface>;
    logoutMethod(empId: number): Promise<ResponseInterface>;
    getEmployee(empId: number, roles: string[], page: number, limit: number): Promise<ResponseInterface>;
    getAllEmployee(): Promise<ResponseInterface>;
    getAllEmployeeDashboard(current_page: number, page_size: number): Promise<ResponseInterface>;
    employeeForMessage(userRoles: string[]): Promise<ResponseInterface>;
    registerEmployee(employeeDetails: InsertEmployeeInterface): Promise<ResponseInterface>;
    updateEmployee(empId: number, employeeDetails: InsertEmployeeInterface): Promise<ResponseInterface>;
    removeEmployee(empId: number): Promise<ResponseInterface>;
    getEmployeeAccess(): Promise<ResponseInterface>;
    getEmployeeRole(): Promise<ResponseInterface>;
    employeeAttendance(current_page?: number, page_size?: number, all?: boolean): Promise<ResponseInterface>;
    employeeFilter(empId: number, login_date_from: Date, login_date_to: Date): Promise<ResponseInterface>;
    taskAssignToEmployee(formData: TaskAssignInterface): Promise<ResponseInterface>;
    deleteTask(taskId: number, empId: number, message_id: number): Promise<ResponseInterface>;
    searchEmployeeById(empId: number): Promise<ResponseInterface>;
    taskReports(empId: number, taskId: number, newStatus: TaskReportsInterface): Promise<ResponseInterface>;
    postMessage(message: TaskWithMessageInterface): Promise<ResponseInterface>;
    updateTask(taskId: number, selected_empid: number, message_id: number, formData: TaskWithMessageInterface): Promise<ResponseInterface>;
    getMessage(empId: number): Promise<ResponseInterface>;
    getTasksByRole(empId: number, roles: string[], page: number, limit: number, sortField?: string, sortOrder?: string): Promise<ResponseInterface>;
    resetpassword(empId: number, resetDetails: ResetPasswordInterface): Promise<ResponseInterface>;
    formatDateTime12Hour(dateTime: any): string;
}
