const baseURL_1 = 'http://localhost:3000/api/';
const baseURL_2 = 'http://localhost:4000/messages/';
export const environment = {
    production: true,
    name:"(DEV)",
    apiBaseUrl:"http://devUrl.com",
    // EMPLOYEE REGISTER 
    getAllEmployee:`${baseURL_1}employee-register/get-all-employee`,
    getEmployee:`${baseURL_1}employee-register/get-employee`,
    insertEmployee:`${baseURL_1}employee-register/insert-employee`,
    updateEmployee:`${baseURL_1}employee-register/update-employee`,
    removeEmployee:`${baseURL_1}employee-register/remove-employee`,
    getEmployeeRole:`${baseURL_1}employee-register/get-employee-role`,
    getEmployeeAccess:`${baseURL_1}employee-register/get-employee-access`,
    employeeForMessage:`${baseURL_1}employee-register/employee-for-message`,
    //LOGIN 
    login:`${baseURL_1}employee-register/login`,
    logout:`${baseURL_1}employee-register/logout`,
    //EMPLOYEE ATTENDANCE
    getEmployeeAttendance:`${baseURL_1}employee-register/employee-attendance`,
    employeeFilter:`${baseURL_1}employee-register/employee-filter`,
    //TASK ASSIGN
    gettaskByRole:`${baseURL_1}employee-register/get-Tasks-ByRole`,
    assignTask:`${baseURL_1}employee-register/task-assign-to-employee`,
    updatetask:`${baseURL_1}employee-register/update-task`,
    deleteTask:`${baseURL_1}employee-register/delete-task`,
    //EMPLOYEE SEARCH
    employeeSearchById:`${baseURL_1}employee-register/search-employee-by-id`,
    //TASK REPORTS
    taskReports:`${baseURL_1}employee-register/task-reports`,
    //MESSAGE
    uploadFile:`${baseURL_1}employee-register/upload`,
    postMessage:`${baseURL_1}employee-register/post-message`,
    getMessage:`${baseURL_1}employee-register/get-message`,
    //WEBSOCKET URL
    wsUrl:`http://localhost:4000/messages`,
    postWebSocketMesage:`${baseURL_2}post-message`,      
    getWebSocketMesage:`${baseURL_2}get-message`,
    updateWebsocketMessage:`${baseURL_2}update-message`,
    deleteWebsocketMessage:`${baseURL_2}delete-message`,
    websocketUploadFile:`${baseURL_2}upload-files`,
    websocketDownloadFile:`${baseURL_2}download-files`,
    //SETTINGS
    resetPassword:`${baseURL_1}employee-register/reset-password`,
};
