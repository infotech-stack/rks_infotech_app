"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperService = void 0;
const common_1 = require("@nestjs/common");
const app_module_1 = require("../../../app.module");
let HelperService = class HelperService {
    async tableExists(dbName, tableName) {
        try {
            const tableExists = await app_module_1.dbConnection.query(`
        SELECT * 
          FROM information_schema.tables
          WHERE table_schema = '${dbName}'
              AND table_name = '${tableName}'
          LIMIT 1;
        `);
            if (tableExists.length == 0)
                return true;
            return false;
        }
        catch (error) {
            throw error;
        }
    }
    async dbExists(dbName) {
        try {
            const dbExists = await app_module_1.dbConnection.query(`
        SELECT SCHEMA_NAME
        FROM INFORMATION_SCHEMA.SCHEMATA
        WHERE SCHEMA_NAME = '${dbName}';
        `);
            if (dbExists.length == 0)
                return true;
            return false;
        }
        catch (error) {
            throw error;
        }
    }
};
HelperService = __decorate([
    (0, common_1.Injectable)()
], HelperService);
exports.HelperService = HelperService;
//# sourceMappingURL=helper.service.js.map