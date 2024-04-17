import { Component, OnInit } from '@angular/core';
import { ConfrontosService } from '../../services/confrontos.service';
import { JogadorService } from '../../services/jogador.service';
import { Confronto } from '../../models/confronto.model';
import { Jogador } from '../../models/jogador.model';

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

  constructor(
    private confrontosService: ConfrontosService,
    private jogadorService: JogadorService
  ) { }

  ngOnInit(): void {
    this.carregarConfrontos();
    this.carregarJogadores();
  }

  carregarConfrontos(): void {
    this.confrontosService.recuperarConfrontos().subscribe((confrontos: Confronto[][]) => {
      this.confrontos = confrontos.flat(); // Use flat() para transformar Confronto[][] em Confronto[]
      this.atualizarHistorico();
    });
  }

  carregarJogadores(): void {
    this.jogadorService.getJogadores().subscribe((jogadores: Jogador[]) => {
      this.jogadores = jogadores;
    });
  }

  selecionarJogador(event: Event): void {
    const selectedPlayerId = (event.target as HTMLSelectElement).value;
    const jogador = this.jogadores.find(j => j.id === selectedPlayerId);
  
    if (jogador) {
      this.jogadorSelecionado = jogador;
      this.atualizarHistorico();
    }
  }
  

  /*atualizarHistorico(): void {
    if (!this.jogadorSelecionado) {
      return; // Retorna se jogadorSelecionado for null
    }
  
    if (this.confrontos.length > 0 && this.jogadores.length > 0) {
      // Limpa o histórico filtrado
      this.historicoFiltrado = [];
  
      // Monta o nome completo do jogador selecionado
      const nomeCompleto = `${this.jogadorSelecionado.nome} ${this.jogadorSelecionado.sobrenome}`;
  
      // Percorre os confrontos para filtrar os confrontos relevantes
      this.confrontos.forEach((confronto: Confronto | null) => {
        if (confronto && confronto.confronto && confronto.confronto.includes(nomeCompleto)) {
          const adversario = this.obterNomeAdversario(confronto.confronto, nomeCompleto);
          const partida = {
            jogador1: this.jogadorSelecionado!.nome +' '+ this.jogadorSelecionado!.sobrenome,
            jogador2: adversario,
            resultado: {
              set1: `${confronto.set1a} x ${confronto.set1b} - `,
              set2: `${confronto.set2a} x ${confronto.set2b}`,
              tiebreak: `${confronto.tiebreaka} x ${confronto.tiebreakb}`
            }
          };
  
          this.historicoFiltrado.push(partida);
        }
      });
    }
  }*/

  atualizarHistorico(): void {
    if (!this.jogadorSelecionado) {
      return; // Retorna se jogadorSelecionado for null
    }
  
    if (this.confrontos.length > 0 && this.jogadores.length > 0) {
      // Limpa o histórico filtrado
      this.historicoFiltrado = [];
  
      // Percorre os confrontos para filtrar os confrontos relevantes
      this.confrontos.forEach((confronto: Confronto) => {
        if (confronto) {
        const [jogadorA, jogadorB] = this.getPlayersFromConfronto(confronto);
  
        if (jogadorA && jogadorB) {
          const adversario = this.jogadorSelecionado === jogadorA ? jogadorB : jogadorA;
  
          // Determinar o vencedor do primeiro set
          const vencedor1set = confronto.set1a > confronto.set1b ? this.jogadorSelecionado : adversario;
          // Determinar o vencedor do segundo set
          const vencedor2set = confronto.set2a > confronto.set2b ? this.jogadorSelecionado : adversario;
          // Determinar o vencedor do tiebreak
          const vencedorTiebreak = confronto.tiebreaka > confronto.tiebreakb ? this.jogadorSelecionado : adversario;
  
          const partida = {
            jogador1: this.jogadorSelecionado!.nome + ' ' + this.jogadorSelecionado!.sobrenome,
            jogador2: adversario.nome + ' ' + adversario.sobrenome,
            resultado: {
              set1: `${confronto.set1a} x ${confronto.set1b} - ${vencedor1set!.nome} ${vencedor1set!.sobrenome}`,
              set2: `${confronto.set2a} x ${confronto.set2b} - ${vencedor2set!.nome} ${vencedor2set!.sobrenome}`,
              tiebreak: `${confronto.tiebreaka} x ${confronto.tiebreakb} - ${vencedorTiebreak!.nome} ${vencedorTiebreak!.sobrenome}`
            }
          };
  
          this.historicoFiltrado.push(partida);
        }}
      });
    }
  }
  
  // Função para obter os jogadores A e B a partir do confronto
  getPlayersFromConfronto(confronto: Confronto): [Jogador | null, Jogador | null] {
    const partes = confronto.confronto.split(' x ');
    if (partes.length !== 2) {
      return [null, null];
    }
  
    const nomeJogadorA = partes[0].trim();
    const nomeJogadorB = partes[1].trim();
  
    const jogadorA = this.jogadores.find(jogador => `${jogador.nome} ${jogador.sobrenome}` === nomeJogadorA);
    const jogadorB = this.jogadores.find(jogador => `${jogador.nome} ${jogador.sobrenome}` === nomeJogadorB);
  
    return [jogadorA!, jogadorB!];
  }
  

  obterNomeAdversario(confronto: string, nomeJogador: string): string {
    // Extrai o nome do adversário do confronto
    const partes = confronto.split(' x ');
    const adversario = partes.find((parte) => parte.trim() !== nomeJogador);
    return adversario ? adversario.trim() : 'Adversário Desconhecido';
  }

}
