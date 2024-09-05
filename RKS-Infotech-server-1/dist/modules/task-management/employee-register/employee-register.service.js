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
exports.EmployeeRegisterService = void 0;
const common_1 = require("@nestjs/common");
const app_module_1 = require("../../../app.module");
const mysql = require("mysql2");
const response_message_enum_1 = require("../../../models/enum/response-message.enum");
let EmployeeRegisterService = class EmployeeRegisterService {
    constructor() {
    }
    async loginMethod(employee_name, employee_password) {
        try {
            const data = await app_module_1.dbConnection.query(`
            SELECT * FROM task_management.employee_register 
            WHERE employee_name= ?
            AND employee_password=? AND is_deleted = ?
          `, [
                employee_name,
                employee_password,
                0
            ]);
            if (data.length > 0) {
                const empId = data[0].empId;
                const loginDateTime = new Date();
                const formattedLoginDateTime = this.formatDateTime12Hour(loginDateTime);
                console.log(formattedLoginDateTime, 'login');
                await app_module_1.dbConnection.query(`
                    INSERT INTO task_management.login_and_logout (login_date_time, empId)
                    VALUES (${mysql.escape(formattedLoginDateTime)}, ${mysql.escape(empId)})
                `);
                const employee = data[0];
                const status = "Available";
                await app_module_1.dbConnection.query(`
             UPDATE task_management.employee_register SET employee_status='${status}' WHERE empId=${empId};
            `);
                const roleAccessData = await app_module_1.dbConnection.query(`SELECT role_id, access_id FROM task_management.role_and_access WHERE empId = ?`, [employee.empId]);
                const roleIds = roleAccessData.map((row) => row.role_id);
                const accessIds = roleAccessData.map((row) => row.access_id);
                let roles = [];
                if (roleIds.length > 0) {
                    const roleNames = await app_module_1.dbConnection.query(`SELECT role_name FROM task_management.employee_roles WHERE role_id IN (?)`, [roleIds]);
                    roles = roleNames.map((row) => row.role_name);
                }
                let accesses = [];
                if (accessIds.length > 0) {
                    const accessNames = await app_module_1.dbConnection.query(`SELECT access_name FROM task_management.employee_access WHERE access_id IN (?)`, [accessIds]);
                    accesses = accessNames.map((row) => row.access_name);
                }
                const result = {
                    empId: employee.empId,
                    employee_name: employee.employee_name,
                    employee_designation: employee.employee_designation,
                    employee_cabinno: employee.employee_cabinno,
                    employee_dateofjoin: employee.employee_dateofjoin,
                    employee_address: employee.employee_address,
                    employee_contactno: employee.employee_contactno,
                    employee_email: employee.employee_email,
                    employee_date_of_birth: employee.employee_date_of_birth,
                    employee_religion: employee.employee_religion,
                    employee_education: employee.employee_education,
                    employee_experience: employee.employee_experience,
                    is_deleted: employee.is_deleted,
                    employee_role: roles,
                    employee_access: accesses,
                };
                return {
                    statusCode: common_1.HttpStatus.OK,
                    message: response_message_enum_1.ResponseMessageEnum.GET,
                    data: result
                };
            }
            else {
                return {
                    statusCode: common_1.HttpStatus.OK,
                    message: response_message_enum_1.ResponseMessageEnum.NOT_FOUND,
                    data: []
                };
            }
        }
        catch (error) {
            throw error;
        }
    }
    async logoutMethod(empId) {
        try {
            const logoutDateTime = new Date();
            const formattedLoginDateTime = this.formatDateTime12Hour(logoutDateTime);
            console.log(formattedLoginDateTime, 'login');
            await app_module_1.dbConnection.query(`
              UPDATE task_management.login_and_logout
              SET logout_date_time = ${mysql.escape(formattedLoginDateTime)}
              WHERE empId = ${mysql.escape(empId)}
              ORDER BY login_logout_id DESC
              LIMIT 1
          `);
            const status = "Absend";
            await app_module_1.dbConnection.query(`
             UPDATE task_management.employee_register SET employee_status='${status}' WHERE empId=${empId};
            `);
            return {
                statusCode: common_1.HttpStatus.ACCEPTED,
                message: response_message_enum_1.ResponseMessageEnum.UPDATE,
                data: true
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getEmployee(empId, roles, page, limit) {
        try {
            const offset = (page - 1) * limit;
            let query = `
      SELECT 
        e.empId,
        e.employee_name,
        e.employee_designation,
        e.employee_cabinno,
        e.employee_dateofjoin,
        e.employee_address,
        e.employee_contactno,
        e.employee_password,
        e.employee_confirmpassword,
        e.employee_email,
        e.employee_date_of_birth,
        e.employee_religion,
        e.employee_education,
        e.employee_gender,
        e.employee_experience,
        e.employee_status,
        -- Subquery to get roles
        (
          SELECT GROUP_CONCAT(DISTINCT er.role_name SEPARATOR ', ')
          FROM task_management.role_and_access raa
          INNER JOIN task_management.employee_roles er ON raa.role_id = er.role_id
          WHERE raa.empId = e.empId
        ) AS employee_role,
        -- Subquery to get accesses
        (
          SELECT GROUP_CONCAT(DISTINCT ea.access_name SEPARATOR ', ')
          FROM task_management.role_and_access raa
          INNER JOIN task_management.employee_access ea ON raa.access_id = ea.access_id
          WHERE raa.empId = e.empId
        ) AS employee_access
      FROM 
        task_management.employee_register e
      WHERE 
        e.is_deleted = 0
        ${!(roles.includes('Admin') || roles.includes('Team Leader')) ? `AND e.empId = ${empId}` : ''}
      LIMIT ${offset}, ${limit}
    `;
            const employees = await app_module_1.dbConnection.query(query);
            if (employees.length === 0) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: response_message_enum_1.ResponseMessageEnum.NOT_FOUND,
                    data: []
                };
            }
            let countQuery = `
      SELECT COUNT(*) AS total
      FROM task_management.employee_register e
      WHERE 
        e.is_deleted = 0
        ${!(roles.includes('Admin') || roles.includes('Team Leader')) ? `AND e.empId = ${empId}` : ''}
    `;
            const totalResult = await app_module_1.dbConnection.query(countQuery);
            const totalRecords = totalResult[0].total;
            console.log(employees, 'empolo');
            const results = employees.map((employee) => ({
                empId: employee.empId,
                employee_name: employee.employee_name,
                employee_designation: employee.employee_designation,
                employee_cabinno: employee.employee_cabinno,
                employee_dateofjoin: employee.employee_dateofjoin,
                employee_address: employee.employee_address,
                employee_contactno: employee.employee_contactno,
                employee_password: employee.employee_password,
                employee_confirmpassword: employee.employee_confirmpassword,
                employee_email: employee.employee_email,
                employee_date_of_birth: employee.employee_date_of_birth,
                employee_religion: employee.employee_religion,
                employee_education: employee.employee_education,
                employee_experience: employee.employee_experience,
                employee_role: employee.employee_role ? employee.employee_role.split(', ') : [],
                employee_access: employee.employee_access ? employee.employee_access.split(', ') : [],
                employee_gender: employee.employee_gender,
                employee_status: employee.employee_status
            }));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: results,
                total: totalRecords
            };
        }
        catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
    async getAllEmployee() {
        try {
            const query = `
      SELECT 
        e.empId,
        e.employee_name,
        e.employee_gender,
        e.employee_designation,
        e.employee_cabinno,
        e.employee_dateofjoin,
        e.employee_address,
        e.employee_contactno,
        e.employee_password,
        e.employee_confirmpassword,
        e.employee_email,
        e.employee_date_of_birth,
        e.employee_religion,
        e.employee_education,
        e.employee_experience,
        e.employee_status,
        -- Subquery to get roles
        (
          SELECT GROUP_CONCAT(DISTINCT er.role_name SEPARATOR ', ')
          FROM task_management.role_and_access raa
          INNER JOIN task_management.employee_roles er ON raa.role_id = er.role_id
          WHERE raa.empId = e.empId
        ) AS employee_role,
        -- Subquery to get accesses
        (
          SELECT GROUP_CONCAT(DISTINCT ea.access_name SEPARATOR ', ')
          FROM task_management.role_and_access raa
          INNER JOIN task_management.employee_access ea ON raa.access_id = ea.access_id
          WHERE raa.empId = e.empId
        ) AS employee_access
      FROM 
        task_management.employee_register e
      WHERE 
        e.is_deleted = 0
    `;
            const employees = await app_module_1.dbConnection.query(query);
            if (employees.length === 0) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: response_message_enum_1.ResponseMessageEnum.NOT_FOUND,
                    data: []
                };
            }
            const results = employees.map((employee) => ({
                empId: employee.empId,
                employee_name: employee.employee_name,
                employee_gender: employee.employee_gender,
                employee_designation: employee.employee_designation,
                employee_cabinno: employee.employee_cabinno,
                employee_dateofjoin: employee.employee_dateofjoin,
                employee_address: employee.employee_address,
                employee_contactno: employee.employee_contactno,
                employee_password: employee.employee_password,
                employee_confirmpassword: employee.employee_confirmpassword,
                employee_email: employee.employee_email,
                employee_date_of_birth: employee.employee_date_of_birth,
                employee_religion: employee.employee_religion,
                employee_education: employee.employee_education,
                employee_experience: employee.employee_experience,
                employee_role: employee.employee_role ? employee.employee_role.split(', ') : [],
                employee_access: employee.employee_access ? employee.employee_access.split(', ') : [],
                employee_status: employee.employee_status
            }));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: results,
            };
        }
        catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
    async getAllEmployeeDashboard(current_page, page_size) {
        try {
            const query = `
      SELECT 
        e.empId,
        e.employee_name,
        e.employee_gender,
        e.employee_designation,
        e.employee_cabinno,
        e.employee_dateofjoin,
        e.employee_address,
        e.employee_contactno,
        e.employee_password,
        e.employee_confirmpassword,
        e.employee_email,
        e.employee_date_of_birth,
        e.employee_religion,
        e.employee_education,
        e.employee_experience,
        e.employee_status,
        -- Subquery to get roles
        (
          SELECT GROUP_CONCAT(DISTINCT er.role_name SEPARATOR ', ')
          FROM task_management.role_and_access raa
          INNER JOIN task_management.employee_roles er ON raa.role_id = er.role_id
          WHERE raa.empId = e.empId
        ) AS employee_role,
        -- Subquery to get accesses
        (
          SELECT GROUP_CONCAT(DISTINCT ea.access_name SEPARATOR ', ')
          FROM task_management.role_and_access raa
          INNER JOIN task_management.employee_access ea ON raa.access_id = ea.access_id
          WHERE raa.empId = e.empId
        ) AS employee_access
      FROM 
        task_management.employee_register e
      WHERE 
        e.is_deleted = 0
    `;
            const employees = await app_module_1.dbConnection.query(query);
            if (employees.length === 0) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: response_message_enum_1.ResponseMessageEnum.NOT_FOUND,
                    data: []
                };
            }
            const results = employees.map((employee) => ({
                empId: employee.empId,
                employee_name: employee.employee_name,
                employee_gender: employee.employee_gender,
                employee_designation: employee.employee_designation,
                employee_cabinno: employee.employee_cabinno,
                employee_dateofjoin: employee.employee_dateofjoin,
                employee_address: employee.employee_address,
                employee_contactno: employee.employee_contactno,
                employee_password: employee.employee_password,
                employee_confirmpassword: employee.employee_confirmpassword,
                employee_email: employee.employee_email,
                employee_date_of_birth: employee.employee_date_of_birth,
                employee_religion: employee.employee_religion,
                employee_education: employee.employee_education,
                employee_experience: employee.employee_experience,
                employee_role: employee.employee_role ? employee.employee_role.split(', ') : [],
                employee_access: employee.employee_access ? employee.employee_access.split(', ') : [],
                employee_status: employee.employee_status
            }));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: results,
            };
        }
        catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
    async employeeForMessage(userRoles) {
        try {
            const isAdmin = userRoles.includes('Admin');
            let query = `
        SELECT er.*, GROUP_CONCAT(DISTINCT erole.role_name) AS roles, GROUP_CONCAT(DISTINCT eaccess.access_name) AS accesses
        FROM task_management.employee_register er
        LEFT JOIN task_management.role_and_access raa ON er.empId = raa.empId
        LEFT JOIN task_management.employee_roles erole ON raa.role_id = erole.role_id
        LEFT JOIN task_management.employee_access eaccess ON raa.access_id = eaccess.access_id
        WHERE er.is_deleted = 0
      `;
            if (!isAdmin) {
                query += ` AND raa.role_id IN (SELECT role_id FROM task_management.employee_roles WHERE role_name = 'Admin')`;
            }
            query += `
        GROUP BY er.empId
      `;
            const data = await app_module_1.dbConnection.query(query);
            const results = data.map((employee) => ({
                empId: employee.empId,
                employee_name: employee.employee_name,
                employee_gender: employee.employee_gender,
                employee_designation: employee.employee_designation,
                employee_cabinno: employee.employee_cabinno,
                employee_dateofjoin: employee.employee_dateofjoin,
                employee_address: employee.employee_address,
                employee_contactno: employee.employee_contactno,
                employee_password: employee.employee_password,
                employee_confirmpassword: employee.employee_confirmpassword,
                employee_email: employee.employee_email,
                employee_date_of_birth: employee.employee_date_of_birth,
                employee_religion: employee.employee_religion,
                employee_education: employee.employee_education,
                employee_experience: employee.employee_experience,
                employee_role: employee.roles ? employee.roles.split(',') : [],
                employee_access: employee.accesses ? employee.accesses.split(',') : []
            }));
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: results,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async registerEmployee(employeeDetails) {
        try {
            console.log(employeeDetails, 'details');
            const employeeDateOfJoin = new Date(employeeDetails.employee_dateofjoin).toISOString().slice(0, 19).replace('T', ' ');
            const employeeDateOfBirth = employeeDetails.employee_date_of_birth ? new Date(employeeDetails.employee_date_of_birth).toISOString().slice(0, 19).replace('T', ' ') : null;
            const employeeResult = await app_module_1.dbConnection.query(`
          INSERT INTO task_management.employee_register
          (
            employee_name,
            employee_designation,
            employee_cabinno,
            employee_dateofjoin,
            employee_address,
            employee_contactno,
            employee_password,
            employee_confirmpassword,
            employee_email,
            employee_date_of_birth,
            employee_religion,
            employee_education,
            employee_experience,
            is_deleted,
            employee_gender
          ) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
        `, [
                employeeDetails.employee_name,
                employeeDetails.employee_designation,
                employeeDetails.employee_cabinno,
                employeeDateOfJoin,
                employeeDetails.employee_address,
                employeeDetails.employee_contactno,
                employeeDetails.employee_password,
                employeeDetails.employee_confirmpassword,
                employeeDetails.employee_email,
                employeeDateOfBirth,
                employeeDetails.employee_religion,
                employeeDetails.employee_education,
                employeeDetails.employee_experience,
                employeeDetails.employee_gender
            ]);
            const empId = employeeResult.insertId;
            const roleIds = [];
            for (const roleName of employeeDetails.employee_role) {
                const roleResult = await app_module_1.dbConnection.query(`
            SELECT role_id
            FROM task_management.employee_roles
            WHERE role_name = ?
          `, [roleName]);
                if (roleResult && roleResult.length > 0) {
                    roleIds.push(roleResult[0].role_id);
                }
            }
            console.log(roleIds, 'roleid');
            for (const roleId of roleIds) {
                await app_module_1.dbConnection.query(`
            INSERT INTO task_management.role_and_access
            (
              empId,
              role_id
            ) 
            VALUES (?, ?)
          `, [empId, roleId]);
            }
            const accessIds = [];
            for (const accessName of employeeDetails.employee_access) {
                const accessResult = await app_module_1.dbConnection.query(`
            SELECT access_id
            FROM task_management.employee_access
            WHERE access_name = ?
          `, [accessName]);
                if (accessResult && accessResult.length > 0) {
                    accessIds.push(accessResult[0].access_id);
                }
            }
            console.log(accessIds, 'accessid');
            for (const accessId of accessIds) {
                await app_module_1.dbConnection.query(`
            INSERT INTO task_management.role_and_access
            (
              empId,
              access_id
            ) 
            VALUES (?, ?)
          `, [empId, accessId]);
            }
            return {
                statusCode: common_1.HttpStatus.CREATED,
                message: response_message_enum_1.ResponseMessageEnum.ADD,
                data: true
            };
        }
        catch (error) {
            throw error;
        }
    }
    async updateEmployee(empId, employeeDetails) {
        try {
            const employeeDateOfJoin = new Date(employeeDetails.employee_dateofjoin).toISOString().slice(0, 19).replace('T', ' ');
            const employeeDateOfBirth = employeeDetails.employee_date_of_birth ? new Date(employeeDetails.employee_date_of_birth).toISOString().slice(0, 19).replace('T', ' ') : null;
            await app_module_1.dbConnection.query(`
          UPDATE task_management.employee_register
          SET
            employee_name = ?,
            employee_designation = ?,
            employee_cabinno = ?,
            employee_dateofjoin = ?,
            employee_address = ?,
            employee_contactno = ?,
            employee_password = ?,
            employee_confirmpassword = ?,
            employee_email = ?,
            employee_date_of_birth = ?,
            employee_religion = ?,
            employee_education = ?,
            employee_experience = ?,
            employee_gender = ?
            WHERE empId = ?
        `, [
                employeeDetails.employee_name,
                employeeDetails.employee_designation,
                employeeDetails.employee_cabinno,
                employeeDateOfJoin,
                employeeDetails.employee_address,
                employeeDetails.employee_contactno,
                employeeDetails.employee_password,
                employeeDetails.employee_confirmpassword,
                employeeDetails.employee_email,
                employeeDateOfBirth,
                employeeDetails.employee_religion,
                employeeDetails.employee_education,
                employeeDetails.employee_experience,
                employeeDetails.employee_gender,
                empId
            ]);
            await app_module_1.dbConnection.query(`
          DELETE FROM task_management.role_and_access
          WHERE empId = ?
        `, [empId]);
            const roleIds = [];
            for (const roleName of employeeDetails.employee_role) {
                const roleResult = await app_module_1.dbConnection.query(`
      SELECT role_id
      FROM task_management.employee_roles
      WHERE role_name = ?
    `, [roleName]);
                if (roleResult && roleResult.length > 0) {
                    roleIds.push(roleResult[0].role_id);
                }
            }
            console.log(roleIds, 'roleid');
            for (const roleId of roleIds) {
                await app_module_1.dbConnection.query(`
      INSERT INTO task_management.role_and_access
      (
        empId,
        role_id
      ) 
      VALUES (?, ?)
    `, [empId, roleId]);
            }
            const accessIds = [];
            for (const accessName of employeeDetails.employee_access) {
                const accessResult = await app_module_1.dbConnection.query(`
      SELECT access_id
      FROM task_management.employee_access
      WHERE access_name = ?
    `, [accessName]);
                if (accessResult && accessResult.length > 0) {
                    accessIds.push(accessResult[0].access_id);
                }
            }
            console.log(accessIds, 'accessid');
            for (const accessId of accessIds) {
                await app_module_1.dbConnection.query(`
      INSERT INTO task_management.role_and_access
      (
        empId,
        access_id
      ) 
      VALUES (?, ?)
    `, [empId, accessId]);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.UPDATE,
                data: true
            };
        }
        catch (error) {
            throw error;
        }
    }
    async removeEmployee(empId) {
        try {
            await app_module_1.dbConnection.query(`
        UPDATE task_management.employee_register 
        SET is_deleted = 1
        WHERE empId = ?
      `, [empId]);
            return {
                statusCode: common_1.HttpStatus.ACCEPTED,
                message: response_message_enum_1.ResponseMessageEnum.DELETE,
                data: true
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getEmployeeAccess() {
        try {
            const data = await app_module_1.dbConnection.query(`
    SELECT * FROM task_management.employee_access;
        
        `);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: data
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getEmployeeRole() {
        try {
            const data = await app_module_1.dbConnection.query(`
        SELECT * FROM task_management.employee_roles;
        
        `);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: data
            };
        }
        catch (error) {
            throw error;
        }
    }
    async employeeAttendance(current_page, page_size, all) {
        try {
            let data;
            let totalRecords;
            let offset = (current_page - 1) * page_size;
            if (all) {
                data = await app_module_1.dbConnection.query(`
          SELECT 
            er.empId,
            er.employee_name,
            er.employee_designation,
            er.employee_cabinno AS employee_cabinno,
            DATE_FORMAT(ll.login_date_time, '%Y-%m-%d %H:%i:%s') AS login_date_time,
            DATE_FORMAT(ll.logout_date_time, '%Y-%m-%d %H:%i:%s') AS logout_date_time
          FROM 
            task_management.employee_register er
          JOIN 
            task_management.login_and_logout ll ON er.empId = ll.empId
          ORDER BY ll.login_date_time;
        `);
                totalRecords = data.length;
            }
            else {
                const totalRecordsResult = await app_module_1.dbConnection.query(`
          SELECT COUNT(*) as count
          FROM task_management.employee_register er
          JOIN task_management.login_and_logout ll ON er.empId = ll.empId;
        `);
                totalRecords = totalRecordsResult[0].count;
                data = await app_module_1.dbConnection.query(`
          SELECT 
            er.empId,
            er.employee_name,
            er.employee_designation,
            er.employee_cabinno AS employee_cabinno,
            DATE_FORMAT(ll.login_date_time, '%Y-%m-%d %H:%i:%s') AS login_date_time,
            DATE_FORMAT(ll.logout_date_time, '%Y-%m-%d %H:%i:%s') AS logout_date_time
          FROM 
            task_management.employee_register er
          JOIN 
            task_management.login_and_logout ll ON er.empId = ll.empId
          ORDER BY ll.login_date_time
          LIMIT ${page_size} OFFSET ${offset};
        `);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: data,
                total: totalRecords,
            };
        }
        catch (error) {
            throw error;
        }
    }
    async employeeFilter(empId, login_date_from, login_date_to) {
        try {
            const formattedLoginDateFrom = new Date(login_date_from).toISOString().slice(0, 19).replace('T', ' ');
            const formattedLoginDateTo = new Date(login_date_to).toISOString().slice(0, 19).replace('T', ' ');
            const data = await app_module_1.dbConnection.query(`
        SELECT 
          er.*,
          DATE_FORMAT(ll.login_date_time, '%Y-%m-%d %H:%i:%s') AS login_date_time,
          DATE_FORMAT(ll.logout_date_time, '%Y-%m-%d %H:%i:%s') AS logout_date_time
        FROM 
          task_management.employee_register er
        JOIN 
          task_management.login_and_logout ll ON er.empId = ll.empId
        WHERE 
          ll.empId = ? AND ll.login_date_time BETWEEN ? AND ?
      `, [empId, formattedLoginDateFrom, formattedLoginDateTo]);
            const results = [];
            for (const employee of data) {
                const rolesData = await app_module_1.dbConnection.query(`
          SELECT er.role_name
          FROM task_management.employee_roles er
          INNER JOIN task_management.role_and_access raa ON er.role_id = raa.role_id
          WHERE raa.empId = ?
        `, [employee.empId]);
                const accessesData = await app_module_1.dbConnection.query(`
          SELECT ea.access_name
          FROM task_management.employee_access ea
          INNER JOIN task_management.role_and_access raa ON ea.access_id = raa.access_id
          WHERE raa.empId = ?
        `, [employee.empId]);
                results.push({
                    empId: employee.empId,
                    employee_name: employee.employee_name,
                    employee_gender: employee.employee_gender,
                    employee_designation: employee.employee_designation,
                    employee_cabinno: employee.employee_cabinno,
                    employee_dateofjoin: employee.employee_dateofjoin,
                    employee_address: employee.employee_address,
                    employee_contactno: employee.employee_contactno,
                    employee_password: employee.employee_password,
                    employee_confirmpassword: employee.employee_confirmpassword,
                    employee_email: employee.employee_email,
                    employee_date_of_birth: employee.employee_date_of_birth,
                    employee_religion: employee.employee_religion,
                    employee_education: employee.employee_education,
                    employee_experience: employee.employee_experience,
                    login_date_time: employee.login_date_time,
                    logout_date_time: employee.logout_date_time,
                    employee_role: rolesData.map((role) => role.role_name),
                    employee_access: accessesData.map((access) => access.access_name)
                });
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: results
            };
        }
        catch (error) {
            throw error;
        }
    }
    async taskAssignToEmployee(formData) {
        try {
            const start = new Date(formData.start_date).toISOString().slice(0, 19).replace('T', ' ');
            const end = new Date(formData.end_date).toISOString().slice(0, 19).replace('T', ' ');
            const taskResult = await app_module_1.dbConnection.query(`
        INSERT INTO task_management.task_assign_to_employee
        (
          project_name,
          start_date,
          end_date,
          project_status,
          is_deleted
        ) 
        VALUES (?, ?, ?, ?, ?)
        `, [
                formData.project_name,
                start,
                end,
                formData.project_status,
                0
            ]);
            const taskId = taskResult.insertId;
            for (const empId of formData.assignTo) {
                await app_module_1.dbConnection.query(`
          INSERT INTO task_management.task_assignments
          (
            task_id,
            empId,
            project_status
          ) 
          VALUES (?, ?, ?)
          `, [
                    taskId,
                    empId,
                    formData.project_status
                ]);
            }
            return {
                statusCode: common_1.HttpStatus.ACCEPTED,
                message: response_message_enum_1.ResponseMessageEnum.ADD,
                data: true
            };
        }
        catch (error) {
            throw error;
        }
    }
    async deleteTask(taskId, empId, message_id) {
        try {
            await app_module_1.dbConnection.query(`
        UPDATE task_management.task_assign_to_employee
        SET is_deleted = 1
        WHERE task_id = ?
        `, [taskId]);
            await app_module_1.dbConnection.query(`
        DELETE FROM task_management.task_assignments
        WHERE task_id = ? AND empId = ?
        `, [taskId, empId]);
            await app_module_1.dbConnection.query(`
        UPDATE task_management.message
        SET is_deleted = 1
        WHERE task_id = ? AND empId = ? AND message_id =?
        `, [taskId, empId, message_id]);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.DELETE,
                data: true
            };
        }
        catch (error) {
            throw error;
        }
    }
    async searchEmployeeById(empId) {
        try {
            const employeeQuery = `
        SELECT *
        FROM task_management.employee_register
        WHERE empId = ${mysql.escape(empId)} AND is_deleted = 0;
      `;
            const taskQuery = `
        SELECT
          t.task_id,
          DATE_FORMAT(t.start_date, '%Y-%m-%d %H:%i:%s') AS start_date,
          DATE_FORMAT(t.end_date, '%Y-%m-%d %H:%i:%s') AS end_date,
          t.project_status,
          t.is_deleted,
          t.project_name
        FROM
          task_management.task_assign_to_employee t
        JOIN
          task_management.task_assignments a ON t.task_id = a.task_id
        WHERE
          a.empId = ${mysql.escape(empId)} AND t.is_deleted = 0;
      `;
            const [employeeData, taskData] = await Promise.all([
                app_module_1.dbConnection.query(employeeQuery),
                app_module_1.dbConnection.query(taskQuery)
            ]);
            if (employeeData.length === 0) {
                return {
                    statusCode: common_1.HttpStatus.NOT_FOUND,
                    message: response_message_enum_1.ResponseMessageEnum.NOT_FOUND,
                    data: []
                };
            }
            const employee = employeeData[0];
            const roleAccessData = await app_module_1.dbConnection.query(`SELECT role_id, access_id FROM task_management.role_and_access WHERE empId = ${mysql.escape(employee.empId)}`);
            const roleIds = roleAccessData.map((row) => row.role_id);
            const accessIds = roleAccessData.map((row) => row.access_id);
            let roles = [];
            if (roleIds.length > 0) {
                const roleNames = await app_module_1.dbConnection.query(`SELECT role_name FROM task_management.employee_roles WHERE role_id IN (${roleIds.map(id => mysql.escape(id)).join(",")})`);
                roles = roleNames.map((row) => row.role_name);
            }
            let accesses = [];
            if (accessIds.length > 0) {
                const accessNames = await app_module_1.dbConnection.query(`SELECT access_name FROM task_management.employee_access WHERE access_id IN (${accessIds.map(id => mysql.escape(id)).join(",")})`);
                accesses = accessNames.map((row) => row.access_name);
            }
            const taskDetails = taskData.map(task => ({
                task_id: task.task_id,
                start_date: task.start_date,
                end_date: task.end_date,
                project_status: task.project_status,
                is_deleted: task.is_deleted,
                project_name: task.project_name
            }));
            const responseData = [{
                    empId: employee.empId,
                    employee_name: employee.employee_name,
                    employee_gender: employee.employee_gender,
                    employee_designation: employee.employee_designation,
                    employee_cabinno: employee.employee_cabinno,
                    employee_dateofjoin: employee.employee_dateofjoin,
                    employee_address: employee.employee_address,
                    employee_contactno: employee.employee_contactno,
                    employee_password: employee.employee_password,
                    employee_confirmpassword: employee.employee_confirmpassword,
                    employee_email: employee.employee_email,
                    employee_date_of_birth: employee.employee_date_of_birth,
                    employee_religion: employee.employee_religion,
                    employee_education: employee.employee_education,
                    employee_experience: employee.employee_experience,
                    employee_role: roles,
                    employee_access: accesses,
                    taskDetails: taskDetails || []
                }];
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: responseData
            };
        }
        catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }
    async taskReports(empId, taskId, newStatus) {
        try {
            await app_module_1.dbConnection.query(`
        UPDATE task_management.task_assign_to_employee AS tae
        INNER JOIN task_management.task_assignments AS ta
        ON tae.task_id = ta.task_id
        SET ta.project_status = ?
        WHERE ta.task_id = ? AND ta.empId = ?
        `, [newStatus.project_status, taskId, empId]);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.UPDATE,
                data: true
            };
        }
        catch (error) {
            throw error;
        }
    }
    async postMessage(message) {
        try {
            var start = new Date(message.start_date).toISOString().slice(0, 19).replace('T', ' ');
            var end = new Date(message.end_date).toISOString().slice(0, 19).replace('T', ' ');
            var filename = JSON.stringify(message.filename);
            const taskResult = await app_module_1.dbConnection.query(`
        INSERT INTO task_management.task_assign_to_employee
        (
          project_name,
          start_date,
          end_date,
          project_status,
          is_deleted
        ) 
        VALUES (?, ?, ?, ?, ?)
        `, [
                message.project_name,
                start,
                end,
                message.project_status,
                0
            ]);
            const taskId = taskResult.insertId;
            for (const empId of message.empId) {
                await app_module_1.dbConnection.query(`
          INSERT INTO task_management.task_assignments
          (
            task_id,
            empId,
            project_status
          ) 
          VALUES (?, ?, ?)
          `, [
                    taskId,
                    empId,
                    message.project_status
                ]);
            }
            for (const empId of message.empId) {
                await app_module_1.dbConnection.query(`
          INSERT INTO task_management.message
          (
            message_description,
            filename,
            is_deleted,
            empId,
            send_by,
            task_id
          ) 
          VALUES (?, ?, ?,?,?,?)
          `, [
                    message.message_description,
                    filename,
                    0,
                    empId,
                    message.send_by,
                    taskId
                ]);
            }
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.ADD,
                data: true
            };
        }
        catch (error) {
            throw error;
        }
    }
    async updateTask(taskId, selected_empid, message_id, formData) {
        try {
            const start = new Date(formData.start_date).toISOString().slice(0, 19).replace('T', ' ');
            const end = new Date(formData.end_date).toISOString().slice(0, 19).replace('T', ' ');
            var filename = JSON.stringify(formData.filename);
            if (selected_empid) {
                try {
                    let employeeIds = [];
                    for (let index = 0; index < formData.empId.length; index++) {
                        const id = await app_module_1.dbConnection.query(`
            SELECT empId FROM task_management.employee_register 
            WHERE employee_name = ?
          `, [formData.empId[index]]);
                        if (id.length > 0) {
                            employeeIds.push(id[0].empId);
                        }
                    }
                    await app_module_1.dbConnection.query(`
            UPDATE task_management.task_assign_to_employee
            SET
              project_name = ?,
              start_date = ?,
              end_date = ?,
              project_status = ?,
              is_deleted = ?
              WHERE task_id = ?
            `, [
                        formData.project_name,
                        start,
                        end,
                        formData.project_status,
                        0,
                        taskId
                    ]);
                    await app_module_1.dbConnection.query(`
            DELETE FROM task_management.task_assignments
            WHERE task_id = ? AND empId = ?
            `, [taskId, selected_empid]);
                    await app_module_1.dbConnection.query(`
            DELETE FROM task_management.message
            WHERE task_id = ? AND empId = ? AND message_id =?
            `, [taskId, selected_empid, message_id]);
                    for (const newempId of formData.empId) {
                        await app_module_1.dbConnection.query(`
              INSERT INTO task_management.task_assignments
              (
                task_id,
                empId,
                project_status

              ) 
              VALUES (?, ?, ?)
              `, [
                            taskId,
                            newempId,
                            formData.project_status
                        ]);
                    }
                    for (const empId of formData.empId) {
                        await app_module_1.dbConnection.query(`
              INSERT INTO task_management.message
              (
                message_description,
                filename,
                is_deleted,
                empId,
                send_by,
                task_id
              ) 
              VALUES (?, ?, ?,?,?,?)
              `, [
                            formData.message_description,
                            filename,
                            0,
                            empId,
                            formData.send_by,
                            taskId
                        ]);
                    }
                    return {
                        statusCode: common_1.HttpStatus.OK,
                        message: response_message_enum_1.ResponseMessageEnum.UPDATE,
                        data: true
                    };
                }
                catch (error) {
                    throw error;
                }
                finally {
                }
            }
        }
        catch (error) {
            throw error;
        }
    }
    async getMessage(empId) {
        try {
            const data = await app_module_1.dbConnection.query(`
        SELECT 
          e.employee_name AS receiver_name, 
          e.empId AS receiver_empId, 
          s.employee_name AS sender_name,
          m.*
        FROM 
          task_management.employee_register e
        JOIN 
          task_management.message m ON e.empId = m.empId
        JOIN 
          task_management.employee_register s ON m.send_by = s.empId
        WHERE 
          e.empId = ?
        ORDER BY 
          m.message_id DESC
        LIMIT 1;
      `, [empId]);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: data
            };
        }
        catch (error) {
            throw error;
        }
    }
    async getTasksByRole(empId, roles, page, limit, sortField = 'employee_name', sortOrder = 'ASC') {
        try {
            const offset = (page - 1) * limit;
            let baseQuery = `
      SELECT
        e.empId,
        e.employee_name,
        t.task_id,
        DATE_FORMAT(t.start_date, '%Y-%m-%d %H:%i:%s') AS start_date,
        DATE_FORMAT(t.end_date, '%Y-%m-%d %H:%i:%s') AS end_date,
        a.project_status,
        t.is_deleted,
        t.project_name,
        m.send_by,
        m.filename,
        m.is_deleted AS message_is_deleted,
        m.message_id,
        sender.employee_name AS send_by_name,
        receiver.employee_name AS send_to_name,
        m.message_description
      FROM
        task_management.task_assign_to_employee t
      JOIN
        task_management.task_assignments a ON t.task_id = a.task_id
      JOIN
        task_management.employee_register e ON a.empId = e.empId
      LEFT JOIN
        task_management.message m ON t.task_id = m.task_id AND m.is_deleted = 0
      LEFT JOIN
        task_management.employee_register sender ON m.send_by = sender.empId
      LEFT JOIN
        task_management.employee_register receiver ON m.empId = receiver.empId
      WHERE
        t.is_deleted = 0
    `;
            if (!roles.includes('Admin') && !roles.includes('Team Leader')) {
                baseQuery += ` AND e.empId = ?`;
            }
            let filteredQuery = `
      SELECT
        empId,
        employee_name,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'task_id', task_id,
            'start_date', start_date,
            'end_date', end_date,
            'project_status', project_status,
            'is_deleted', is_deleted,
            'project_name', project_name,
            'send_by', send_by,
            'filename', filename,
            'message_is_deleted', message_is_deleted,
            'message_id', message_id,
            'send_by_name', send_by_name,
            'send_to_name', send_to_name,
            'message_description', message_description
          )
        ) AS taskDetails
      FROM
        (${baseQuery}) AS base
      WHERE
        send_to_name = employee_name
      GROUP BY
        empId, employee_name
    `;
            const validSortFields = ['employee_name', 'project_name', 'start_date', 'end_date', 'project_status'];
            if (validSortFields.includes(sortField) && (sortOrder === 'ASC' || sortOrder === 'DESC')) {
                filteredQuery += ` ORDER BY ${sortField} ${sortOrder}`;
            }
            if (limit !== -1) {
                filteredQuery += ` LIMIT ${offset}, ${limit}`;
            }
            let countQuery = `
      SELECT COUNT(DISTINCT e.empId) AS total
      FROM
        task_management.task_assign_to_employee t
      JOIN
        task_management.task_assignments a ON t.task_id = a.task_id
      JOIN
        task_management.employee_register e ON a.empId = e.empId
      LEFT JOIN
        task_management.message m ON t.task_id = m.task_id AND m.is_deleted = 0 AND a.empId = m.empId
      WHERE
        t.is_deleted = 0
    `;
            if (!roles.includes('Admin') && !roles.includes('Team Leader')) {
                countQuery += ` AND e.empId = ?`;
            }
            const totalTasks = roles.includes('Admin') || roles.includes('Team Leader')
                ? await app_module_1.dbConnection.query(countQuery)
                : await app_module_1.dbConnection.query(countQuery, [empId]);
            const tasks = roles.includes('Admin') || roles.includes('Team Leader')
                ? await app_module_1.dbConnection.query(filteredQuery)
                : await app_module_1.dbConnection.query(filteredQuery, [empId]);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: response_message_enum_1.ResponseMessageEnum.GET,
                data: tasks,
                total: totalTasks[0].total,
            };
        }
        catch (error) {
            console.error('Error executing getTasksByRole:', error);
            throw error;
        }
    }
    async resetpassword(empId, resetDetails) {
        try {
            await app_module_1.dbConnection.query(`
      UPDATE task_management.employee_register
      SET employee_name = ?, employee_password = ?, employee_confirmpassword = ?
      WHERE empId = ?
    `, [
                resetDetails.employee_name,
                resetDetails.employee_password,
                resetDetails.employee_confirmpassword,
                empId
            ]);
            return {
                statusCode: common_1.HttpStatus.ACCEPTED,
                message: response_message_enum_1.ResponseMessageEnum.UPDATE,
                data: true
            };
        }
        catch (error) {
            throw error;
        }
    }
    formatDateTime12Hour(dateTime) {
        const date = new Date(dateTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} `;
        return `${year}-${month}-${day} ${formattedTime}`;
    }
};
EmployeeRegisterService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmployeeRegisterService);
exports.EmployeeRegisterService = EmployeeRegisterService;
//# sourceMappingURL=employee-register.service.js.map