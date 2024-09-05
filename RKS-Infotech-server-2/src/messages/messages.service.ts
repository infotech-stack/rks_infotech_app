import { HttpStatus, Injectable } from '@nestjs/common';
import ResponseInterface from './interface/response.interface';
import { dbConnection } from 'src/app.module';
import { InsertMessageInterface } from './interface/insert-message.interface';
import { ResponseMessageEnum } from './enum/response-message.enum';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createWriteStream, promises as fsPromises } from 'fs';

@Injectable()
export class MessagesService {
  // messages:Message[]=[
  //   {
  //     name:'charles',
  //     text:'welcome to websocket '
  //   }
  // ];
  // clientToUser={};
  // create(createMessageDto: CreateMessageDto,clientId:string) {
  //   const message={
  //     name:this.clientToUser[clientId],
  //     text:createMessageDto.text
  //   };
  //   this.messages.push(message);
  //   return message;
  // }

  // findAll() {
  //   return this.messages;
  // }
  // identify(name:string,clientId:string){
  //   this.clientToUser[clientId]=name;
  //   return Object.values(this.clientToUser);
  // }
  // getClientname(clientId:string){
  //   return this.clientToUser[clientId];
  // }
  // he(){

  // }


  // async saveMessage( message: InsertMessageInterface):Promise<ResponseInterface>
  // {
  //   console.log(message,'service');
    
  //     await dbConnection.query(`
  //       INSERT INTO task_management.employee_messages
  //       (
  //       sender_id,
  //       receiver_id,
  //       message,
  //       filename
  //       )
  //       VALUES(?,?,?,?)
  //       `,[
  //         message.sender_id,
  //         message.receiver_id,
  //         message.message,
  //         message.filename
  //       ]);
  //       return{
  //         statusCode:HttpStatus.CREATED,
  //         message:ResponseMessageEnum.ADD,
  //         data:message
  //       }
  // }

  // async getMessages(senderId: number, receiverId: number):Promise<ResponseInterface>{
  //   const messages = await dbConnection.query(`
  //     SELECT * FROM task_management.employee_messages
  //     WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
  //     ORDER BY timestamp ASC;
  //   `, [senderId, receiverId, receiverId, senderId]);
  //   return{
  //     statusCode:HttpStatus.OK,
  //     message:ResponseMessageEnum.GET,
  //     data:messages
  //   }
  // }
  async saveMessage( message: InsertMessageInterface,value:number):Promise<ResponseInterface>
  {
  if (value==1) {
    console.log(message,'message');
    
    const filename=JSON.stringify(message.filename);
    await dbConnection.query(`
      INSERT INTO task_management.employee_messages
      (
      sender_id,
      receiver_id,
      message,
      filename
      )
      VALUES(?,?,?,?)
      `,[
        message.sender_id,
        message.receiver_id,
        message.message,
        filename
      ]);
      return{
        statusCode:HttpStatus.CREATED,
        message:ResponseMessageEnum.ADD,
        data:message
      }
  }else{
    const filename=JSON.stringify(message.filename);
    // await dbConnection.query(`
    //   INSERT INTO task_management.employee_messages
    //   (
    //   sender_id,
    //   receiver_id,
    //   message,
    //   filename
    //   )
    //   VALUES(?,?,?,?)
    //   `,[
    //     message.sender_id,
    //     message.receiver_id,
    //     message.message,
    //     filename
    //   ]);
      return{
        statusCode:HttpStatus.CREATED,
        message:ResponseMessageEnum.ADD,
        data:message
      }
  }
  }
  async getMessages(senderId: number, receiverId: number):Promise<ResponseInterface>{
    const messages = await dbConnection.query(`
      SELECT * FROM task_management.employee_messages
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) AND is_deleted = 0
      ORDER BY timestamp ASC;
    `, [senderId, receiverId, receiverId, senderId]);
    return{
      statusCode:HttpStatus.OK,
      message:ResponseMessageEnum.GET,
      data:messages
    }
  }
//   async getMessages(senderId: number, receiverId: number, offset: number, limit: number): Promise<ResponseInterface> {
//   const messages = await dbConnection.query(`
//     SELECT * FROM task_management.employee_messages
//     WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND is_deleted = 0
//     ORDER BY timestamp ASC
//     LIMIT ? OFFSET ?;
//   `, [senderId, receiverId, receiverId, senderId, limit, offset]);

//   const totalMessages = await dbConnection.query(`
//     SELECT COUNT(*) as total FROM task_management.employee_messages
//     WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND is_deleted = 0;
//   `, [senderId, receiverId, receiverId, senderId]);

//   return {
//     statusCode: HttpStatus.OK,
//     message: ResponseMessageEnum.GET,
//     data: messages,
//     total: totalMessages[0].total
//   };
// }

  async updateMessage(sender_id: number, receiver_id: number,message_id:number, message: InsertMessageInterface): Promise<ResponseInterface> {
    try {
      await dbConnection.query(`
        UPDATE task_management.employee_messages
        SET
          sender_id = ?,
          receiver_id = ?,
          message = ?,
          filename = ?
        WHERE
          (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) AND id=?
      `, [
        message.sender_id,
        message.receiver_id,
        message.message,
        message.filename,
        sender_id,
        receiver_id,
        receiver_id,
        sender_id,
        message_id
      ]);
      return{
        statusCode:HttpStatus.ACCEPTED,
        message:ResponseMessageEnum.UPDATE,
        data:message
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteMessage(sender_id: number, receiver_id: number,message_id:number): Promise<ResponseInterface> {
    try {
      await dbConnection.query(`
        UPDATE task_management.employee_messages
        SET is_deleted = 1
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) AND id= ?
      `, [
        sender_id,
        receiver_id,
        receiver_id,
        sender_id,
        message_id
      ]);
      return {
        statusCode:HttpStatus.OK,
        message:ResponseMessageEnum.DELETE,
        data:true
       };
    } catch (error) {
      throw error;
    }
  } 
}
