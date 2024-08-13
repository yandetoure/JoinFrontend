// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Changez l'URL si nécessaire
  private tokenSubject = new BehaviorSubject<string | null>(null);
  public token$ = this.tokenSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  register(firstName: string, lastName: string, pseudo: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { first_name: firstName, last_name: lastName, pseudo, email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password });
  }

  logout(): Observable<void> {
    // Assurez-vous que votre API renvoie un Observable pour la déconnexion
    return this.http.post<void>(`${this.apiUrl}/logout`, {});
  }
  

  setToken(token: string) {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  getUsers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users`, { headers: this.getAuthHeaders() });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  

  // Méthode pour obtenir les informations utilisateur
  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, { headers: this.getAuthHeaders() });
  }

}
