import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JogadorService {
  private apiUrl = 'http://localhost:3000/jogadores';

  constructor(private http: HttpClient) { }

  // Método para salvar jogador no JSON Server
  salvarJogador(jogador: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, jogador);
  }

  // Método para obter todos os jogadores do JSON Server
  getJogadores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
