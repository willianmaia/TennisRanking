import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, mergeMap, map } from 'rxjs/operators';
import { Confronto } from '../models/confronto.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfrontosService {
  private baseUrl = 'https://node-express-server-eta.vercel.app';
  confrontosExistentesFinal: Confronto[] = [];

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
    return this.excluirConfrontosPorRodada(rodada).pipe(
      catchError((error) => {
        return of(null);
      }),
      mergeMap(() => {
        return this.recuperarJogadores().pipe(
          mergeMap(async (jogadores) => {
            const jogadoresArray = Object.values(jogadores);
            const jogadoresRodada = jogadoresArray.filter((jogador) => jogador.dataNascimento);
            
            const confrontos = await this.sortearConfrontos(jogadoresRodada);
            return this.salvarConfrontosRodada(rodada, confrontos).toPromise();
          })
        );
      })
    );
  }  
  
  private async sortearConfrontos(jogadores: any[]): Promise<any[]> {
    const confrontos: any[] = [];
    const confrontosSorteados: string[] = []

    const jogadoresEmbaralhados = jogadores.sort(() => Math.random() - 0.5);

    let confrontosExistentes: Confronto[][] = [];
    try {
      confrontosExistentes = (await this.criarListaConfrontosExistentesConsolidados().toPromise()) || [];
    } catch (error) {
      console.error('Erro ao recuperar confrontos existentes:', error);
    }

    // Converter a matriz de confrontos existentes em uma lista plana
    const confrontosExistentesFlat = confrontosExistentes.flatMap(array => array || []);

    // Criar lista de confrontos já existentes para evitar repetição
    const confrontosExistentesLista: string[] = [];
    confrontosExistentesFlat.forEach((confrontoArray) => {
      if (Array.isArray(confrontoArray)) {
        confrontoArray.forEach((confronto) => {
          if (confronto && confronto.confronto) {
            confrontosExistentesLista.push(confronto.confronto);
          }
        });
      }
    });

    // Iterar sobre os jogadores para criar confrontos
    for (let i = 0; i < jogadoresEmbaralhados.length - 1; i++) {
      for (let j = i + 1; j < jogadoresEmbaralhados.length; j++) {
        const jogadorA = jogadoresEmbaralhados[i];
        const jogadorB = jogadoresEmbaralhados[j];
        const confrontoAB = `${jogadorA.nome} ${jogadorA.sobrenome} x ${jogadorB.nome} ${jogadorB.sobrenome}`;
        const confrontoBA = `${jogadorB.nome} ${jogadorB.sobrenome} x ${jogadorA.nome} ${jogadorA.sobrenome}`;

        // Verificar se o confronto ou seu contrário já foram sorteados ou existem na lista de confrontos existentes
        if (!confrontosSorteados.includes(confrontoAB) && !confrontosSorteados.includes(confrontoBA)) {
          if (!confrontosExistentesLista.includes(confrontoAB) && !confrontosExistentesLista.includes(confrontoBA)) {
            // Criar confronto
            confrontos.push({
              confronto: confrontoAB,
              set1a: '',
              set1b: '',
              set2a: '',
              set2b: '',
              tiebreaka: '',
              tiebreakb: ''
            });

            confrontosSorteados.push(confrontoAB);
            confrontosSorteados.push(confrontoBA);
          }
        }
        
      }
    }

    if (confrontos.length === 0) {
      alert('Todos os confrontos possíveis já foram sorteados.');
    }

    // Subtrair confrontos existentes dos confrontos a serem sorteados
    const confrontosFiltrados = confrontos.filter(confronto => !confrontosExistentesLista.includes(confronto.confronto));

    return confrontosFiltrados;
}

  salvarConfrontosRodada(rodada: number, confrontos: any[]): Observable<any> {
  const confrontosPorJogador: Map<string, any> = new Map(); 
  const confrontosSelecionados: any[] = [];
  const confrontosSelecionadosSet = new Set<string>();
  
  confrontos.forEach(confronto => {
    const jogadores = confronto.confronto.split(' x ');
    const jogador1 = jogadores[0];
    const jogador2 = jogadores[1];
    const confrontoInverso = `${jogador2} x ${jogador1}`;

    // Verificar se algum dos jogadores já possui confronto selecionado ou seu inverso
    if (!confrontosPorJogador.has(jogador1) && !confrontosPorJogador.has(jogador2) &&
        !confrontosSelecionadosSet.has(confronto.confronto) && !confrontosSelecionadosSet.has(confrontoInverso)) {
      confrontosPorJogador.set(jogador1, confronto);
      confrontosPorJogador.set(jogador2, confronto);
      confrontosSelecionados.push(confronto);
      confrontosSelecionadosSet.add(confronto.confronto);
      confrontosSelecionadosSet.add(confrontoInverso);
    }
  });

  const confrontosUrl = `${this.baseUrl}/confrontos/${rodada}`;
  const headers = new HttpHeaders({
    'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
    'Content-Type': 'application/json'
  });

  return this.http.post(confrontosUrl, confrontosSelecionados, { headers });
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

excluirConfrontosPorRodada(rodada: number): Observable<any> {
  const url = `${this.baseUrl}/confrontos/${rodada}`;
  const headers = new HttpHeaders({
    'Authorization': 'Basic Y2hhdmU6c2VuaGE=',
    'Content-Type': 'application/json'
  });

  return this.http.delete(url, { headers }).pipe(
    catchError((error) => {
      return throwError(error);
    })
  );
}
}
