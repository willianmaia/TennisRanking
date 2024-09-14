import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Torneio } from '../models/torneio.model';
import { HttpHeaders } from '@angular/common/http';
import { Jogador } from '../models/jogador.model';
import { map } from 'rxjs/operators';
import { Confronto } from '../models/confronto.model';

@Injectable({
  providedIn: 'root'
})
export class TorneioService {
  private apiUrl = 'https://node-express-server-eta.vercel.app/torneios';

  constructor(private http: HttpClient) { }

  getTorneios(): Observable<Torneio[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<Torneio[]>(this.apiUrl, { headers });
  }

  getTorneioById(id: string): Observable<Torneio> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<Torneio>(url, { headers });
  }

  adicionarJogadorTorneio(torneioId: string, jogador: Jogador): Observable<any> {
    const url = `${this.apiUrl}/${torneioId}/jogadores`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.post(url, jogador, { headers });
  }

  getTorneioPorIndice(indice: number): Observable<Torneio> {
    return this.getTorneios().pipe(
      map(torneios => {
        if (indice >= 0 && indice < torneios.length) {
          return torneios[indice];
        } else {
          throw new Error('Torneio não encontrado para o índice fornecido');
        }
      })
    );
  }

  salvarConfrontoTorneio(confronto: Confronto, torneioId: string): Observable<any> {
    const url = `${this.apiUrl}/${torneioId}/confrontos`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
  
    return this.http.put(url, confronto, { headers });
  }
  

  getConfrontosTorneio(torneioId: string): Observable<Confronto[]> {
    const url = `${this.apiUrl}/${torneioId}/confrontos`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<Confronto[]>(url, { headers });
  }

  getJogadoresTorneio(torneioId: string): Observable<Jogador[]> {
    const url = `${this.apiUrl}/${torneioId}/jogadores`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<Jogador[]>(url, { headers }).pipe(
      map(jogadores => jogadores.filter(jogador => jogador !== null))
    );
  }

  criarTorneio(novoTorneio: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.apiUrl, novoTorneio, { headers });
  }

}
