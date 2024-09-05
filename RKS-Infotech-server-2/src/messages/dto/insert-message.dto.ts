export class InsertMessageDto{
    sender_id: number;
    receiver_id: number;
    message: string;
    filename:string[];
    is_deleted:number;
    fileUrl?: string;
    // fileName?: string;
}