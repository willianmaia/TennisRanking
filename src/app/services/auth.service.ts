import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  private baseUrl = 'https://node-express-server-eta.vercel.app';
  private TOKEN_KEY = 'authToken';


  isLoggedIn(): boolean {
    // Verifica se o token de autenticação está presente no armazenamento local
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  login(email: string, password: string) {
    const userData = { email, password };
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    
    return this.http.post<any>(`${this.baseUrl}/login`, userData, { headers });
  }

  logout() {
    // Limpa o token do armazenamento local ao fazer logout
    localStorage.removeItem(this.TOKEN_KEY);
  }

  resetPassword(userId: string, newPassword: string) {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.baseUrl}/updateUserPassword`, { userId, newPassword }, { headers });
  }

  criarUsuario(nome: string, sobrenome: string, email: string, password: string, papel: string, ranking: string): Observable<any> {
    const userData = { nome, sobrenome, email, password, papel, ranking };
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(`${this.baseUrl}/createUser`, userData, { headers });
  }
  
}
