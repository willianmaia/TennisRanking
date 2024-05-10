import { Component, OnInit } from '@angular/core';
import { JogadorService } from '../../services/jogador.service';
import { ConfrontosService } from '../../services/confrontos.service';
import { Confronto } from '../../models/confronto.model';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  jogadores: any[] = [];

  constructor(
    private jogadorService: JogadorService,
    private confrontosService: ConfrontosService
  ) {}

  ngOnInit(): void {
    this.carregarJogadores();
  }

  carregarJogadores() {
    this.jogadorService.getJogadores().subscribe(
      (jogadores) => {
        this.jogadores = jogadores;
        this.calcularPontos();
      },
      (error) => {
        console.error('Erro ao carregar jogadores:', error);
      }
    );
  }

  calcularPontos() {
    this.confrontosService.criarListaConfrontosExistentesConsolidados().subscribe(
      (confrontosMatriz: any[][]) => {
        const pontos: any = {};
        confrontosMatriz.forEach((listaConfrontosInteira: any[][], indiceLista: number) => {
          listaConfrontosInteira.slice(1).forEach((listaConfrontos: any[], indiceLista: number) => {
          listaConfrontos.forEach((confronto: any, indiceConfronto: number) => {
  
            if (confronto && confronto.confronto) {
              const nomeConfronto = confronto.confronto;
              const { set1a, set1b, set2a, set2b, tiebreaka, tiebreakb } = confronto;

              if (nomeConfronto.trim() !== '') {
                const [jogador1, jogador2] = nomeConfronto.split(' x ');

                const pontosJogador1 = this.calcularPontosJogador1(jogador1, set1a, set1b, set2a, set2b, tiebreaka, tiebreakb);
                const pontosJogador2 = this.calcularPontosJogador2(jogador1, set1a, set1b, set2a, set2b, tiebreaka, tiebreakb)

                pontos[jogador1] = (pontos[jogador1] || 0) + pontosJogador1;
                pontos[jogador2] = (pontos[jogador2] || 0) + pontosJogador2;

              } else {
                console.warn('Nome de confronto inválido encontrado. Ignorando no cálculo de pontos.');
              }
            } else {
              console.warn(`Confronto inválido encontrado na lista ${indiceLista}, índice ${indiceConfronto}. Ignorando no cálculo de pontos.`);
            }
          });
        });

        const ranking = Object.keys(pontos).map((jogador) => ({ nome: jogador, pontos: pontos[jogador] }));
        ranking.sort((a, b) => b.pontos - a.pontos);
        this.jogadores = ranking;
      }
    
    );
  });      
}

calcularPontosJogador1(
  jogador: string,
  set1A: string,
  set1B: string,
  set2A: string,
  set2B: string,
  tiebreakA: string,
  tiebreakB: string)
  : number {
    
  const VITORIA = 100;
  const DERROTA = 25;
  const PONTOS_SET = 10;
  const PONTOS_TIEBREAK = 10;

  const set1a = set1A !== '' ? parseInt(set1A, 10) : 0;
  const set1b = set1B !== '' ? parseInt(set1B, 10) : 0;
  const set2a = set2A !== '' ? parseInt(set2A, 10) : 0;
  const set2b = set2B !== '' ? parseInt(set2B, 10) : 0;
  const tiebreaka = tiebreakA !== '' ? parseInt(tiebreakA, 10) : 0;
  const tiebreakb = tiebreakB !== '' ? parseInt(tiebreakB, 10) : 0;

  let saldoGames = 0
  let pontos = 0;

  // Calcular pontos dos sets
  pontos += (set1a > set1b ? PONTOS_SET : 0); // 1º set
  pontos += (set2a > set2b ? PONTOS_SET : 0); // 2º set

  // Verificar se o jogador venceu ou perdeu o confronto
  if (set1a > set1b && set2a > set2b) {
    pontos += VITORIA;
    saldoGames = (set1a + set2a) - (set1b + set2b);
    pontos += saldoGames;
  } 
  if (set1a < set1b && set2a > set2b && tiebreaka > tiebreakb) {
    pontos += VITORIA;
    saldoGames = (set1a + set2a) - (set1b + set2b);
    pontos += saldoGames;
    pontos += PONTOS_TIEBREAK;
  } 
  if (set1a > set1b && set2a < set2b && tiebreaka > tiebreakb) {
    pontos += VITORIA;
    saldoGames = (set1a + set2a) - (set1b + set2b);
    pontos += saldoGames;
    pontos += PONTOS_TIEBREAK;
  }
  if (set1a > set1b && set2a < set2b && tiebreaka < tiebreakb) {
    pontos += DERROTA;
    saldoGames = (set1a + set2a) - (set1b + set2b);
    pontos += saldoGames;
  }
  if (set1a < set1b && set2a > set2b && tiebreaka < tiebreakb) {
    pontos += DERROTA;
    saldoGames = (set1a + set2a) - (set1b + set2b);
    pontos += saldoGames;
  }
  if (set1a < set1b && set2a < set2b) {
    pontos += DERROTA;
    saldoGames = (set1a + set2a) - (set1b + set2b);
    pontos += saldoGames;
  } 

  return pontos;
}

calcularPontosJogador2(
  jogador: string,
  set1A: string,
  set1B: string,
  set2A: string,
  set2B: string,
  tiebreakA: string,
  tiebreakB: string)
  : number {
    
  const VITORIA = 100;
  const DERROTA = 25;
  const PONTOS_SET = 10;
  const PONTOS_TIEBREAK = 10;

  // Converter strings para números ou tratar como zero se forem vazias
  const set1a = set1A !== '' ? parseInt(set1A, 10) : 0;
  const set1b = set1B !== '' ? parseInt(set1B, 10) : 0;
  const set2a = set2A !== '' ? parseInt(set2A, 10) : 0;
  const set2b = set2B !== '' ? parseInt(set2B, 10) : 0;
  const tiebreaka = tiebreakA !== '' ? parseInt(tiebreakA, 10) : 0;
  const tiebreakb = tiebreakB !== '' ? parseInt(tiebreakB, 10) : 0;

  let saldoGames = 0
  let pontos = 0;

  // Calcular pontos dos sets
  pontos += (set1a < set1b ? PONTOS_SET : 0); // 1º set
  pontos += (set2a < set2b ? PONTOS_SET : 0); // 2º set

  // Verificar se o jogador venceu ou perdeu o confronto
  if (set1a < set1b && set2a < set2b) {
    pontos += VITORIA;
    saldoGames = (set1b + set2b) - (set1a + set2a);
    pontos += saldoGames;
  } 
  if (set1a > set1b && set2a < set2b && tiebreaka < tiebreakb) {
    pontos += VITORIA;
    saldoGames = (set1b + set2b) - (set1a + set2a);
    pontos += saldoGames;
    pontos += PONTOS_TIEBREAK;
  } 
  if (set1a < set1b && set2a > set2b && tiebreaka < tiebreakb) {
    pontos += VITORIA;
    saldoGames = (set1b + set2b) - (set1a + set2a);
    pontos += saldoGames;
    pontos += PONTOS_TIEBREAK;
  }
  if (set1a < set1b && set2a > set2b && tiebreaka > tiebreakb) {
    pontos += DERROTA;
    saldoGames = (set1b + set2b) - (set1a + set2a);
    pontos += saldoGames;
  }
  if (set1a > set1b && set2a < set2b && tiebreaka > tiebreakb) {
    pontos += DERROTA;
    saldoGames = (set1b + set2b) - (set1a + set2a);
    pontos += saldoGames;
  }
  if (set1a > set1b && set2a > set2b) {
    pontos += DERROTA;
    saldoGames = (set1b + set2b) - (set1a + set2a);
    pontos += saldoGames;
  } 

  return pontos;
}

}  
