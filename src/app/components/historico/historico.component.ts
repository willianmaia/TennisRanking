import { Component, OnInit } from '@angular/core';
import { ConfrontosService } from '../../services/confrontos.service';
import { JogadorService } from '../../services/jogador.service';
import { Confronto } from '../../models/confronto.model';
import { Jogador } from '../../models/jogador.model';
import { ActivatedRoute} from '@angular/router';
import { RankingService } from 'src/app/services/ranking.service';
import { Ranking } from '../../models/ranking.model';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {

  confrontos: Confronto[] = [];
  jogadores: Jogador[] = [];
  historicoFiltrado: any[] = [];
  jogadorSelecionado: Jogador | null = null;
  historicoConfrontos: Confronto[] = [];
  ranking: Ranking = { id: '', nome: ''};
  idRanking: string = '';

  constructor(
    private confrontosService: ConfrontosService,
    private jogadorService: JogadorService,
    private route: ActivatedRoute, 
    private rankingService: RankingService
  ) { }

  ngOnInit(): void {
    const idRanking = this.route.snapshot.paramMap.get('idRanking');
    if (idRanking) {
      this.idRanking = idRanking;
      this.carregarConfrontos();
      this.carregarJogadores();
      this.getRankingById(idRanking);
    }
  }

  getRankingById(id: string): void {
    this.rankingService.getRankingById(id).subscribe(
      (ranking: Ranking) => {
        console.log('Ranking carregado:', ranking);
        this.ranking = ranking;
      },
      (error) => {
        console.error('Erro ao buscar ranking:', error);
      }
    );
  }

  carregarConfrontos(): void {
    this.confrontosService.recuperarConfrontos(this.idRanking).subscribe((confrontos: Confronto[]) => {
      this.confrontos = confrontos.flat();
      this.atualizarHistorico();
    });
  }

  carregarJogadores(): void {
    this.jogadorService.getJogadores(this.idRanking).subscribe((jogadores: Jogador[]) => {
      this.jogadores = jogadores;
    });
  }

  selecionarJogador(event: Event): void {
    const selectedPlayerId = (event.target as HTMLSelectElement).value;
    const jogador = this.jogadores.find(j => j.id === selectedPlayerId);
  
    if (jogador) {
      this.jogadorSelecionado = jogador;
      this.atualizarHistorico();
    } else {
      console.error('Jogador não encontrado com o ID:', selectedPlayerId);
    }
  }
  

  atualizarHistorico(): void {
    if (!this.jogadorSelecionado || this.confrontos.length === 0 || this.jogadores.length === 0) {
      this.historicoFiltrado = [];
      return;
    }
  
    const nomeCompletoJogador = `${this.jogadorSelecionado.nome} ${this.jogadorSelecionado.sobrenome}`;
  
    this.historicoFiltrado = this.confrontos
      .filter((confronto: Confronto | null) => confronto && confronto.confronto && confronto.set1a && confronto.set1b)
      .filter((confronto: Confronto) => {
        const [jogadorA, jogadorB] = this.getPlayersFromConfronto(confronto);
  
        return jogadorA?.id === this.jogadorSelecionado!.id || jogadorB?.id === this.jogadorSelecionado!.id;
      })
      .map((confronto: Confronto) => {
        const [jogadorA, jogadorB] = this.getPlayersFromConfronto(confronto);
      
        // Verificar se jogadorA e jogadorB são diferentes de nulo
        if (jogadorA && jogadorB) {
          const nomeCompletoJogador = `${this.jogadorSelecionado!.nome} ${this.jogadorSelecionado!.sobrenome}`;
      
          const vencedor1set = confronto.set1a > confronto.set1b ? jogadorA : jogadorB;
          const vencedor2set = confronto.set2a > confronto.set2b ? jogadorA : jogadorB;
          let vencedorTiebreak = null;
          if (confronto.tiebreaka !== '') {
            vencedorTiebreak = confronto.tiebreaka < confronto.tiebreakb ? jogadorA : jogadorB;
          }
      
          const jogadorOponente = jogadorA.id === this.jogadorSelecionado!.id ? jogadorB : jogadorA;
      
          return {
            jogador1: nomeCompletoJogador,
            jogador2: `${jogadorOponente?.nome} ${jogadorOponente?.sobrenome}`,
            resultado: {
              set1: `${confronto.set1a} x ${confronto.set1b} - ${vencedor1set?.nome} ${vencedor1set?.sobrenome}`,
              set2: `${confronto.set2a} x ${confronto.set2b} - ${vencedor2set?.nome} ${vencedor2set?.sobrenome}`,
              tiebreak: vencedorTiebreak ? `${confronto.tiebreaka} x ${confronto.tiebreakb} - ${vencedorTiebreak?.nome} ${vencedorTiebreak?.sobrenome}` : ''
            }
          };
        }
        // Retornar nulo se jogadorA ou jogadorB forem nulos
        return null;
      })
      
      .filter((confronto: any) => confronto !== null && confronto.jogador2 !== null);
  }
  
  
  getPlayersFromConfronto(confronto: Confronto): [Jogador | null, Jogador | null] {
    if (!confronto || !confronto.confronto) {
      return [null, null];
    }
  
    const partes = confronto.confronto.split(' x ');
    if (partes.length !== 2) {
      return [null, null];
    }
  
    const nomeJogadorA = partes[0].trim();
    const nomeJogadorB = partes[1].trim();
  
    const jogadorA = this.jogadores.find(jogador => `${jogador.nome} ${jogador.sobrenome}` === nomeJogadorA);
    const jogadorB = this.jogadores.find(jogador => `${jogador.nome} ${jogador.sobrenome}` === nomeJogadorB);
  
    return [jogadorA || null, jogadorB || null];
  }

  obterNomeAdversario(confronto: string, nomeJogador: string): string {
    const partes = confronto.split(' x ');
    const adversario = partes.find((parte) => parte.trim() !== nomeJogador);
    return adversario ? adversario.trim() : 'Adversário Desconhecido';
  }

}
