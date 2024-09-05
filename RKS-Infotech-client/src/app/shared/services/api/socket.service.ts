import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {  Observable } from 'rxjs';
import { io, Socket } from "socket.io-client";
import { environment } from "../../../../environments/environment.development";
@Injectable({
    providedIn:'root'
})
export class SocketService{
  private socket: Socket;
  constructor(private http:HttpClient) {
    this.socket = io('http://localhost:4000');
  }
  sendMessage(message: any): Observable<any> {
    this.socket.emit('message', message);
    return this.http.post(`${environment.postWebSocketMesage}`, message);
  }
  getMessages(sender_id: number, receiver_id: number): Observable<any> {
    return this.http.get(`${environment.getWebSocketMesage}?sender_id=${sender_id}&receiver_id=${receiver_id}`);
  }
  getMessagesObservable(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('message', (message: any) => {
        observer.next(message);
      });
      return () => this.socket.disconnect();
    });
  }
  websocketUploadFile(formData:any){
   
    
    return this.http.post<any>(`${environment.websocketUploadFile}`,formData);
  }
  websocketDownloadFile(filename:any){
    console.log(filename,'service');
    
    return this.http.get<any>(`${environment.websocketDownloadFile}?filename=${filename}`,{
      responseType: 'blob' as 'json',
      observe: 'response'
    });
  }
  updateMessage(sender_id:number,receiver_id:number,message_id:number,message:any){
    return this.http.put<any>(`${environment.updateWebsocketMessage}?sender_id=${sender_id}&receiver_id=${receiver_id}&message_id=${message_id}`,message);
  }
  deleteMessage(sender_id:number,receiver_id:number,message_id:number){
   return this.http.delete<any>(`${environment.deleteWebsocketMessage}?sender_id=${sender_id}&receiver_id=${receiver_id}&message_id=${message_id}`);
  }
}