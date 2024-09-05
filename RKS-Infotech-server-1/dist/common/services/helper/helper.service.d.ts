export declare class HelperService {
    tableExists(dbName: string, tableName: string): Promise<boolean>;
    dbExists(dbName: string): Promise<boolean>;
}
