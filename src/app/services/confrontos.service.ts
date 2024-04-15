import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { Confronto } from '../models/confronto.model';

@Injectable({
  providedIn: 'root'
})
export class ConfrontosService {
  private baseUrl = 'https://node-express-server-eta.vercel.app';

  constructor(private http: HttpClient) {}

  recuperarJogadores(): Observable<any[]> {
    const jogadoresUrl = `${this.baseUrl}/jogadores`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
    return this.http.get<any[]>(jogadoresUrl, { headers });
  }

  sortearConfrontosPorRodada(rodada: number): Observable<any[]> {
    return this.recuperarJogadores().pipe(
      mergeMap((jogadores) => {
        const jogadoresArray = Object.values(jogadores);
        const jogadoresRodada = jogadoresArray.filter((jogador) => jogador.dataNascimento); // Filtro de exemplo, ajuste conforme necessário
        const confrontos = this.sortearConfrontos(jogadoresRodada);
        return this.salvarConfrontosRodada(rodada, confrontos);
      })
    );
  }

  private sortearConfrontos(jogadores: any[]): any[] {
    const confrontos: any[] = [];
    
    while (jogadores.length >= 2) {
      const index1 = Math.floor(Math.random() * jogadores.length);
      const jogador1 = jogadores[index1];
      jogadores.splice(index1, 1);
    
      const index2 = Math.floor(Math.random() * jogadores.length);
      const jogador2 = jogadores[index2];
      jogadores.splice(index2, 1);
    
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
    
    return confrontos;
  }

  private salvarConfrontosRodada(rodada: number, confrontos: any[]): Observable<any> {
    // Filtrar e remover confrontos nulos (null)
    const confrontosValidos = confrontos.filter(confronto => confronto !== null);
  
    const confrontosUrl = `${this.baseUrl}/confrontos/${rodada}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
  
    return this.http.post(confrontosUrl, confrontosValidos, { headers });
  }

  salvarResultado(confrontos: any[], rodada: number): Observable<any> {
    const confrontosUrl = `${this.baseUrl}/confrontos/${rodada}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });
  
    // Realizar requisição GET para recuperar os confrontos salvos para a rodada atual
    return this.http.get<any[]>(confrontosUrl, { headers }).pipe(
      catchError((error) => {
        console.error('Erro ao recuperar confrontos:', error);
        return throwError(error);
      }),
      mergeMap((confrontosSalvos: any[]) => {
        // Atualizar os confrontos existentes com os novos dados
        confrontosSalvos.forEach((confrontoSalvo) => {
          const confrontoAtualizado = confrontos.find((c) => c.confronto === confrontoSalvo.confronto);
  
          if (confrontoAtualizado) {
            confrontoSalvo.set1a = confrontoAtualizado.set1a;
            confrontoSalvo.set1b = confrontoAtualizado.set1b;
            confrontoSalvo.set2a = confrontoAtualizado.set2a;
            confrontoSalvo.set2b = confrontoAtualizado.set2b;
            confrontoSalvo.tiebreaka = confrontoAtualizado.tiebreaka;
            confrontoSalvo.tiebreakb = confrontoAtualizado.tiebreakb;
          }
        });
  
        // Enviar uma requisição PUT para atualizar os confrontos no Firebase
        return this.http.put(confrontosUrl, confrontosSalvos, { headers });
      })
    );
  }

  recuperarConfrontosPorRodada(rodada: number): Observable<any[]> {
    const confrontosUrl = `${this.baseUrl}/confrontos/${rodada}`;
    const headers = new HttpHeaders({
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    });

    return this.http.get<any[]>(confrontosUrl, { headers });
  }

  recuperarConfrontos(): Observable<Confronto[][]> {
    const confrontosUrl = `${this.baseUrl}/confrontos`;
    const headers = {
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    };

    return this.http.get<Confronto[][]>(confrontosUrl, { headers });
  }
}
