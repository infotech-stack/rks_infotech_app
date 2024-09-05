export declare class InsertEmployeeDto {
    employee_name: string;
    employee_designation: string;
    employee_cabinno: string;
    employee_dateofjoin: Date;
    employee_address: string;
    employee_contactno: number;
    employee_password: string;
    employee_confirmpassword: string;
    employee_email: string;
    employee_date_of_birth: Date;
    employee_religion: string;
    employee_education: string;
    employee_experience: string;
    employee_role: number[];
    employee_access: number[];
    employee_gender: string;
}
export declare class loginDto {
    employee_name: string;
    employee_password: string;
}
export declare class TaskAssignDto {
    start_date: Date;
    end_date: Date;
    project_status: string;
    is_deleted: number;
    project_name: string;
    assignTo: number[];
}
export declare class GetTaskByRolesDto {
    roles: string[];
}
export declare class TaskReportsDto {
    project_status: string;
}
export declare class InsertMessageDto {
    message_description: string;
    filename: string[];
    is_deleted: number;
    empId: number;
    send_by: number;
}
export declare class ResetPasswordDto {
    employee_name: string;
    employee_password: string;
    employee_confirmpassword: string;
}
export declare class TaskWithMessageDto {
    start_date: Date;
    end_date: Date;
    project_status: string;
    message_description: string;
    project_name: string;
    filename: string[];
    empId: string[];
    send_by: number;
}
export declare class UploadFilesDto {
    projectName: string;
    startDate: string;
    endDate: string;
    projectStatus: string;
    assignTo: string[];
    messageDescription: string;
}
