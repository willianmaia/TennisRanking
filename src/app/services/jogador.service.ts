import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {
  private apiUrl = 'http://localhost:3000/jogadores';

  constructor(private http: HttpClient) { }

  salvarJogador(jogador: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, jogador);
  }

  getJogadores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  excluirJogador(id: number): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}
