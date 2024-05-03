import { Component, OnInit } from '@angular/core';
import { JogadorService } from '../../services/jogador.service';

@Component({
  selector: 'app-jogadores',
  templateUrl: './jogadores.component.html',
  styleUrls: ['./jogadores.component.css']
})
export class JogadoresComponent implements OnInit {
  jogadores: any[] = [];

  constructor(private jogadorService: JogadorService) { }

  ngOnInit(): void {
    this.carregarJogadores();
  }

  carregarJogadores() {
    this.jogadorService.getJogadores().subscribe(
      (jogadores) => {
        this.jogadores = jogadores;
      },
      (error) => {
        console.error('Erro ao carregar jogadores:', error);
      }
    );
  }

  excluirJogador(id: number) {
    this.jogadorService.excluirJogador(id).subscribe(
      () => {
        this.carregarJogadores();
      },
      (error) => {
        console.error('Erro ao excluir jogador:', error);
      }
    );
  }
}
