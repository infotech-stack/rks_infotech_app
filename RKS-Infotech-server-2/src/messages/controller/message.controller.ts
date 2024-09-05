import { Controller, Get, Post, Body, Query, Res, HttpStatus, UseInterceptors, UploadedFiles, Put, Delete } from '@nestjs/common';
import { MessagesService } from '../messages.service';
import * as path from "path";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { Response } from 'express';

@Controller('messages')
export class MessageController {

  
  constructor(private _messageService: MessagesService) {
    this.ensureUploadsPathExists();
  }
  @Post('post-message')
  saveMessage(@Body() message: any) {
    try {
      return this._messageService.saveMessage(message,0)
    } catch (error) {
      throw error;
    }
  }
  @Get('get-message')
  getMessages(@Query('sender_id') sender_id: number, @Query('receiver_id') receiver_id: number) {
    try {
      return this._messageService.getMessages(sender_id, receiver_id);
    } catch (error) {
      throw error;
    }
  }
  @Put('update-message')
  updatemessage(
    @Query('sender_id') sender_id: number,
    @Query('receiver_id') receiver_id: number,
    @Query('message_id') message_id: number,
    @Body() message: any
  ) {
    return this._messageService.updateMessage(sender_id, receiver_id, message_id, message);
  }
  @Delete('delete-message')
  deleteMessage(
    @Query('sender_id') sender_id: number,
    @Query('receiver_id') receiver_id: number,
    @Query('message_id') message_id: number
  ) {
    return this._messageService.deleteMessage(sender_id, receiver_id, message_id);
  }
//   @Post('upload-files')
//   @UseInterceptors(FileFieldsInterceptor([
//     { name: 'files', maxCount: 10 }
//   ], {
//     storage: diskStorage({
//       destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '..', '..','messages', 'src', 'assets', 'uploads'));
//       },
//       filename: (req, file, cb) => {
//         const filename = `${Date.now()}-${file.originalname}`;
//         console.log('Generated filename:', filename);
//         cb(null, filename);
//       }
//     })
//   }))
//   async uploadFiles(
//     @UploadedFiles() files: { files?: Express.Multer.File[] },
//     @Body() taskAssignDto: { senderId: string, receiverId: string }
//   ) {
    
//   const fileNames = files.files?.map(file => file.filename) || [];
// console.log(taskAssignDto.senderId,taskAssignDto.receiverId,'id');


//     return {
//       message: 'Files uploaded successfully',
//       data: fileNames
//     };
//   }

  // ensureUploadsPathExists() {
  //   const uploadPath = path.join(__dirname, '..', '..','messages', 'src', 'assets', 'uploads');
  //   if (!fs.existsSync(uploadPath)) {
  //     fs.mkdirSync(uploadPath, { recursive: true });
  //   }
  // }
//   @Get('download-files')
//   async getFile(
//     @Res() res: Response,
//     @Query('senderId') senderId: string,
//     @Query('receiverId') receiverId: string,
//     @Query('filename') filename: string): Promise<void> {
//     const filePath = path.join(__dirname, '..', '..','messages', 'src', 'assets', 'uploads',filename);
//     try {
//       if (fs.existsSync(filePath)) {
//         res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
//         res.sendFile(filePath);
//       } else {
//         res.status(HttpStatus.NOT_FOUND).send('File not found');
//       }
//     } catch (err) {
//       console.error('Error retrieving file:', err);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Server Error');
//     }
//   }
@Post('upload-files')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'files', maxCount: 10 }
], {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join('D://employee-management-project//RKS-Infotech-server-2//src//messages//assets//uploads');
      console.log('Destination path:', uploadPath);

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const filename = `${Date.now()}-${file.originalname}`;
      console.log('Filename:', filename);
      cb(null, filename);
    }
  })
}))
async uploadFiles(
  @UploadedFiles() files: { files?: Express.Multer.File[] },
) {
  const fileNames = files.files?.map(file => file.filename) || [];
  return {
    message: 'Task assigned successfully',
    data: fileNames
  };
}

@Get('download-files')
async getFile(@Res() res, @Query('filename') filename: string): Promise<void> {
  console.log(filename,'down;pa');
  
  const filePath = path.join('D://employee-management-project/RKS-Infotech-server-2/src/messages/assets/uploads',filename);
  console.log('File path:', filePath);

  try {
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  } catch (err) {
    console.error('Error retrieving file:', err);
    res.status(500).send('Server Error');
  }
}
  ensureUploadsPathExists() {
    const uploadPath = path.join('D://employee-management-project//RKS-Infotech-server-2//src//messages//assets//uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
  }
}

