import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { MessagesModule } from './messages/messages.module';
import { DataSource } from 'typeorm';
import dbConfig from './messages/config/db.config';
import { MulterModule } from '@nestjs/platform-express';
import * as path from 'path';


@Module({
  imports: [
    MessagesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
 
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

export const dbConnection = new DataSource(dbConfig());
dbConnection
  .initialize()
  .then(() => {
    console.log(`Data Source has been initialized! `);
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
