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
        console.log('Jogadores carregados:', this.jogadores);

        // Após carregar os jogadores, calculamos os pontos
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
        console.log('Confrontos recuperados:', confrontosMatriz);
        const pontos: any = {};
  
        // Iterar sobre cada lista de confrontos na matriz
        confrontosMatriz.forEach((listaConfrontosInteira: any[][], indiceLista: number) => {
          console.log(`Processando lista de confrontos ${indiceLista}:`, listaConfrontosInteira);

          // Iterar sobre cada lista de confrontos na matriz
          listaConfrontosInteira.slice(1).forEach((listaConfrontos: any[], indiceLista: number) => {
          console.log(`Processando lista de confrontos 2 ${indiceLista}:`, listaConfrontos);
  
          // Iterar sobre cada objeto de confronto dentro da lista
          listaConfrontos.forEach((confronto: any, indiceConfronto: number) => {
            console.log(`Confronto ${indiceConfronto} - Conteúdo:`, confronto);
  
            if (confronto && confronto.confronto) {
              const nomeConfronto = confronto.confronto;
              const { set1a, set1b, set2a, set2b, tiebreaka, tiebreakb } = confronto;
  
              console.log('Nome do Confronto:', nomeConfronto);
              console.log('Set 1A:', set1a);
              console.log('Set 1B:', set1b);
              console.log('Set 2A:', set2a);
              console.log('Set 2B:', set2b);
  
              // Verificar se o confronto tem um nome válido
              if (nomeConfronto.trim() !== '') {
                const [jogador1, jogador2] = nomeConfronto.split(' x ');
  
                console.log('Jogador 1:', jogador1);
                console.log('Jogador 2:', jogador2);
  
                // Calcular pontos para os jogadores do confronto atual
                const pontosJogador1 = this.calcularPontosJogador(jogador1, set1a, set1b, set2a, set2b, tiebreaka, tiebreakb);
                const pontosJogador2 = this.calcularPontosJogador(jogador2, set1b, set1a, set2b, set2a, tiebreakb, tiebreaka);
  
                console.log('Pontos do Jogador 1:', pontosJogador1);
                console.log('Pontos do Jogador 2:', pontosJogador2);
  
                // Adicionar pontos aos jogadores no objeto de pontos
                pontos[jogador1] = (pontos[jogador1] || 0) + pontosJogador1;
                pontos[jogador2] = (pontos[jogador2] || 0) + pontosJogador2;
  
                console.log('Pontos:', pontos);
              } else {
                console.warn('Nome de confronto inválido encontrado. Ignorando no cálculo de pontos.');
              }
            } else {
              console.warn(`Confronto inválido encontrado na lista ${indiceLista}, índice ${indiceConfronto}. Ignorando no cálculo de pontos.`);
            }
          });
        });
  
        // Criar o ranking a partir do objeto de pontos
        const ranking = Object.keys(pontos).map((jogador) => ({ nome: jogador, pontos: pontos[jogador] }));
  
        // Ordenar o ranking com base nos pontos (do maior para o menor)
        ranking.sort((a, b) => b.pontos - a.pontos);
  
        // Atualizar a lista de jogadores com o ranking ordenado
        this.jogadores = ranking;
  
        console.log('Ranking:', ranking); // Verificar o ranking após o cálculo
      }
    
    );
  });      
}

  calcularPontosJogador(jogador: string, setGanho1: string, setPerdido1: string, setGanho2: string, setPerdido2: string, tiebreakGanho: string, tiebreakPerdido: string): number {
    const VITORIA = 100;
    const DERROTA = 25;
    const PONTOS_SET = 10;
  
    // Converter strings para números ou tratá-las como zero se forem vazias
    const set1a = setGanho1 !== '' ? parseInt(setGanho1, 10) : 0;
    const set1b = setPerdido1 !== '' ? parseInt(setPerdido1, 10) : 0;
    const set2a = setGanho2 !== '' ? parseInt(setGanho2, 10) : 0;
    const set2b = setPerdido2 !== '' ? parseInt(setPerdido2, 10) : 0;
    const tiebreaka = tiebreakGanho !== '' ? parseInt(tiebreakGanho, 10) : 0;
    const tiebreakb = tiebreakPerdido !== '' ? parseInt(tiebreakPerdido, 10) : 0;
  
    const saldoGames = (set1a - set1b) + (set2a - set2b);
  
    let pontos = 0;
  
    // Calcular pontos de acordo com as regras
    pontos += (set1a > set1b ? PONTOS_SET : 0); // 1º set
    pontos += (set2a > set2b ? PONTOS_SET : 0); // 2º set
    pontos += saldoGames; // Saldo em games
  
    if (set1a > set1b && set2a > set2b) {
      pontos += VITORIA; // Vitória
    } else {
      pontos += DERROTA; // Derrota
    }
  
    return pontos;
  }
}  
