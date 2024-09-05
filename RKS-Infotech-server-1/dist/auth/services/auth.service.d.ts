import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateJwt(user: any): Promise<string>;
    hashPassword(password: string): Promise<string>;
    generateSecretKey(): string;
    comparePasswords(password: string, storedPasswordHash: string): Promise<boolean>;
    verifyJwt(jwt: string): Promise<any>;
}
