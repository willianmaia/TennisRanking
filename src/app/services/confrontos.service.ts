import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfrontosService {
  private baseUrl = 'https://node-express-server-eta.vercel.app'; // URL base do servidor

  constructor(private http: HttpClient) {}

  recuperarConfrontos(): Observable<any[]> {
    const confrontosUrl = `${this.baseUrl}/confrontos`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(confrontosUrl, { headers });
  }

  salvarConfrontos(confrontos: any[]): Observable<any> {
    const confrontosUrl = `${this.baseUrl}/confrontos/${0}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.put(confrontosUrl, confrontos, { headers });
  }

  sortearConfrontos(jogadores: any[]): any[] {
    const confrontos: any[] = [];

    // Sortear confrontos com base nos jogadores
    while (jogadores.length >= 2) {
      const index1 = Math.floor(Math.random() * jogadores.length);
      const jogador1 = jogadores[index1];
      jogadores.splice(index1, 1); // Remover jogador1 da lista

      const index2 = Math.floor(Math.random() * jogadores.length);
      const jogador2 = jogadores[index2];
      jogadores.splice(index2, 1); // Remover jogador2 da lista

      const confronto = {
        confronto: `${jogador1.nome} ${jogador1.sobrenome} x ${jogador2.nome} ${jogador2.sobrenome}`,
        set1a: '',
        set1b: '',
        set2a: '',
        set2b: '',
        tiebreaka: '',
        tiebreakb: ''
      };

      confrontos.push(confronto);
    }

    // Retornar os confrontos gerados como um array de objetos
    return confrontos;
  }

  salvarResultado(confrontoId: string, resultados: any): Observable<any> {
    const resultado = {
      confrontoId,
      set1a: resultados.set1a,
      set1b: resultados.set1b,
      set2a: resultados.set2a,
      set2b: resultados.set2b,
      tiebreaka: resultados.tiebreaka,
      tiebreakb: resultados.tiebreakb
    };
  
    const resultadosUrl = `${this.baseUrl}/confrontos/${confrontoId}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    console.log('URL da requisição:', resultadosUrl);
    console.log('Dados enviados:', resultado);
  
    return this.http.post(resultadosUrl, resultado, { headers });
  }
}