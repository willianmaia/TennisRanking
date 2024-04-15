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
  

  atualizarHistorico(): void {
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
            jogador1: this.jogadorSelecionado!.nome,
            jogador2: adversario,
            resultado: {
              set1: `${confronto.set1a} x ${confronto.set1b}`,
              set2: `${confronto.set2a} x ${confronto.set2b}`,
              tiebreak: `${confronto.tiebreaka} x ${confronto.tiebreakb}`
            }
          };
  
          this.historicoFiltrado.push(partida);
        }
      });
    }
  }
  

  obterNomeAdversario(confronto: string, nomeJogador: string): string {
    // Extrai o nome do adversário do confronto
    const partes = confronto.split(' x ');
    const adversario = partes.find((parte) => parte.trim() !== nomeJogador);
    return adversario ? adversario.trim() : 'Adversário Desconhecido';
  }

}
