import { Module } from '@nestjs/common';
import { EmployeeRegisterController } from './employee-register/employee-register.controller';
import { EmployeeRegisterService } from './employee-register/employee-register.service';
import { MessagesModule } from './messages/messages.module';




@Module({
  controllers: [EmployeeRegisterController],
  providers: [EmployeeRegisterService],
  imports: [MessagesModule],
  // imports:[MessageModule]
})
export class TaskManagementModule {}
