import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {
  private baseUrl = 'https://node-express-server-eta.vercel.app';

  constructor(private http: HttpClient) { }

  salvarJogador(rankingId: string, jogador: any): Observable<any> {
    const url = `${this.baseUrl}/rankings/${rankingId}/jogadores`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(url, jogador, { headers });
  }

  getJogadores(rankingId: string): Observable<any[]> {
    const url = `${this.baseUrl}/rankings/${rankingId}/jogadores`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(url, { headers }).pipe(
      map(jogadores => jogadores.filter(jogador => jogador !== null)) // Filtra jogadores nulos
    );
  }

  excluirJogador(rankingId: string, id: number): Observable<any> {
    const url = `${this.baseUrl}/rankings/${rankingId}/jogadores/${id}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>(url, { headers });
  }
}
