import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';
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
      mergeMap(async (jogadores) => {
        const jogadoresArray = Object.values(jogadores);
        const jogadoresRodada = jogadoresArray.filter((jogador) => jogador.dataNascimento);
        
        const confrontos = await this.sortearConfrontos(jogadoresRodada);
        return this.salvarConfrontosRodada(rodada, confrontos).toPromise();
      })
    );
  }
  

  private async sortearConfrontos(jogadores: any[]): Promise<any[]> {
    const confrontos: any[] = [];
    
    while (jogadores.length >= 2) {
      const index1 = Math.floor(Math.random() * jogadores.length);
      const jogador1 = jogadores[index1]; 
      jogadores.splice(index1, 1);
    
      const index2 = Math.floor(Math.random() * jogadores.length);
      const jogador2 = jogadores[index2];
      jogadores.splice(index2, 1);
  
      const confronto1 = `${jogador1.nome} ${jogador1.sobrenome} x ${jogador2.nome} ${jogador2.sobrenome}`;
      const confronto2 = `${jogador2.nome} ${jogador2.sobrenome} x ${jogador1.nome} ${jogador1.sobrenome}`;

      const confrontosExistentes = await this.criarListaConfrontosExistentes().toPromise();
      const confrontosExistentesList: string[] = [];
  
      if (confrontosExistentes) {
        confrontosExistentes.forEach((confrontosPorRodada: any) => {
          confrontosPorRodada.forEach((confronto: any) => {
            if (confronto && confronto.confronto) {
              const confrontoOriginal = confronto.confronto;
              confrontosExistentesList.push(confrontoOriginal);
            }
          });
        });
      }
  
      if (!confrontosExistentesList.includes(confronto1) && !confrontosExistentesList.includes(confronto2)) {
        const confronto = {
          confronto: confronto1,
          set1a: '',
          set1b: '',
          set2a: '',
          set2b: '',
          tiebreaka: '',
          tiebreakb: ''
        };
      
        confrontos.push(confronto);
      }
    }
    if (confrontos.length === 0) {
      alert('Todos os confrontos possíveis já foram sorteados.');
    }
    return confrontos;
  }
  

  salvarConfrontosRodada(rodada: number, confrontos: any[]): Observable<any> {
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
  
    return this.http.get<any[]>(confrontosUrl, { headers }).pipe(
      catchError((error) => {
        return throwError(error);
      }),
      mergeMap((confrontosSalvos: any[]) => {
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

  recuperarConfrontos(): Observable<Confronto[]> {
    const confrontosUrl = `${this.baseUrl}/confrontos`;
    const headers = {
      'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
      'Content-Type': 'application/json'
    };

    return this.http.get<Confronto[]>(confrontosUrl, { headers });
  }

  criarListaConfrontosExistentes(): Observable<Confronto[]> {
  const confrontosUrl = `${this.baseUrl}/confrontos`;
  const headers = new HttpHeaders({
    'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
    'Content-Type': 'application/json'
  });

  return this.http.get<Confronto[]>(confrontosUrl, { headers }).pipe(
    catchError((error) => {
      throw error;
    }),
    map((confrontos: Confronto[] | null) => {
      if (!confrontos) {
        return [];
      }

      return confrontos.filter(confronto => confronto !== null);
    })
  );
}

criarListaConfrontosExistentesConsolidados(): Observable<Confronto[][]> {
  const confrontosUrl = `${this.baseUrl}/confrontos`;
  const headers = new HttpHeaders({
    'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
    'Content-Type': 'application/json'
  });

  return this.http.get<Confronto[]>(confrontosUrl, { headers }).pipe(
    catchError((error) => {
      throw error;
    }),
    map((confrontos: Confronto[] | null) => {
      if (!confrontos) {
        return [[]];
      }
      const confrontosMatriz: Confronto[][] = [[]];
      confrontos.forEach((confronto) => {
        confrontosMatriz[0].push(confronto);
      });
      return confrontosMatriz;
    })
  );
}
}
