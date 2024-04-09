import { Component, OnInit } from '@angular/core';
import { JogadorService } from '../../services/jogador.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  jogadores: any[] = [];

  constructor(private jogadorService: JogadorService) { }

  ngOnInit(): void {
    this.carregarJogadores();
  }

  carregarJogadores() {
    this.jogadorService.getJogadores().subscribe(
      (jogadores) => {
        this.jogadores = jogadores; // Atribui os jogadores ao array no componente
        console.log('Jogadores carregados:', this.jogadores);
      },
      (error) => {
        console.error('Erro ao carregar jogadores:', error);
      }
    );
  }
}
