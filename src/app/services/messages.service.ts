// src/app/services/messages.service.ts
import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Changez l'URL si nécessaire

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDiscussions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/discussions`, { headers: this.getAuthHeaders() });
  }

  getMessages(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/messages/${userId}`, { headers: this.getAuthHeaders() });
  }

  sendMessage(receiverId: number, message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, { receiver_id: receiverId, message }, { headers: this.getAuthHeaders() });
  }

  updateMessage(messageId: number, message: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/messages/${messageId}`, { message }, { headers: this.getAuthHeaders() });
  }

  deleteMessage(messageId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/messages/${messageId}`, { headers: this.getAuthHeaders() });
  }

  // src/app/services/messages.service.ts
markMessagesAsRead(userId: number): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/messages/read/${userId}`, {}, { headers: this.getAuthHeaders() });
}

getUsers(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() });
}
}
