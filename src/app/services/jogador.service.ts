import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {
  private apiUrl = 'https://node-express-server-eta.vercel.app/jogadores';

  constructor(private http: HttpClient) { }

  salvarJogador(jogador: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.apiUrl, jogador, { headers });
  }

  getJogadores(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  excluirJogador(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>(url, { headers });
  }
}
