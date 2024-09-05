/// <reference types="multer" />
import { MessagesService } from './messages.service';
import { Response } from 'express';
export declare class MessageController {
    private _messageService;
    constructor(_messageService: MessagesService);
    saveMessage(message: any): Promise<import("../../../models/interface/response.interface").default>;
    getMessages(sender_id: number, receiver_id: number): Promise<import("../../../models/interface/response.interface").default>;
    uploadFiles(files: {
        files?: Express.Multer.File[];
    }, body: {
        projectName: string;
        startDate: any;
        endDate: any;
        projectStatus: any;
        assignTo: string;
        messageDescription: string;
    }): Promise<{
        message: string;
        data: string[];
    }>;
    downloadFile(res: Response, empId: string, filename: string): Promise<void>;
}
