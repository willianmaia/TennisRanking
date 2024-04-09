import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfrontosService {
  private baseUrl = 'http://localhost:3000'; // URL base do servidor

  constructor(private http: HttpClient) {}

  recuperarConfrontos(): Observable<string[]> {
    const confrontosUrl = `${this.baseUrl}/confrontos`;
    return this.http.get<string[]>(confrontosUrl);
  }

  salvarConfrontos(confrontos: string[]): Observable<any> {
    const confrontosUrl = `${this.baseUrl}/confrontos`;
    return this.http.put(confrontosUrl, confrontos);
  }

  sortearConfrontos(jogadores: any[]): string[] {
    const confrontos: string[] = [];

    // Sortear confrontos com base nos jogadores
    while (jogadores.length >= 2) {
      const index1 = Math.floor(Math.random() * jogadores.length);
      const jogador1 = jogadores[index1];
      jogadores.splice(index1, 1); // Remover jogador1 da lista

      const index2 = Math.floor(Math.random() * jogadores.length);
      const jogador2 = jogadores[index2];
      jogadores.splice(index2, 1); // Remover jogador2 da lista

      const confronto = `${jogador1.nome} ${jogador1.sobrenome} x ${jogador2.nome} ${jogador2.sobrenome}`;
      confrontos.push(confronto);
    }

    // Salvar os confrontos gerados no db.json
    this.salvarConfrontos(confrontos).subscribe(
      () => {
        console.log('Confrontos salvos com sucesso no db.json');
      },
      (error) => {
        console.error('Erro ao salvar confrontos no db.json:', error);
      }
    );

    return confrontos;
  }

  salvarResultado(confronto: string, resultado: string): Observable<any> {
    const resultadosUrl = `${this.baseUrl}/resultados`;
    const body = { confronto, resultado };
    return this.http.post(resultadosUrl, body);
  }
}
