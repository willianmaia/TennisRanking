import { Component, OnInit } from '@angular/core';
import { JogadorService } from '../../services/jogador.service';
import { ActivatedRoute} from '@angular/router';
import { RankingService } from 'src/app/services/ranking.service';
import { Ranking } from '../../models/ranking.model';

@Component({
  selector: 'app-jogadores',
  templateUrl: './jogadores.component.html',
  styleUrls: ['./jogadores.component.css']
})
export class JogadoresComponent implements OnInit {
  jogadores: any[] = [];
  ranking: Ranking = { id: '', nome: ''};
  idRanking: string = '';

  constructor(
    private jogadorService: JogadorService, 
    private route: ActivatedRoute, 
    private rankingService: RankingService
  ) { }

  ngOnInit(): void {
    const idRanking = this.route.snapshot.paramMap.get('idRanking');
    console.error('idRanking:', idRanking);
    if (idRanking) {
      this.idRanking = idRanking;
      this.carregarJogadores(idRanking);
      this.getRankingById(idRanking);
    }
  }

  getRankingById(id: string): void {
    this.rankingService.getRankingById(id).subscribe(
      (ranking: Ranking) => {
        this.ranking = ranking;
      },
      (error) => {
        console.error('Erro ao buscar ranking:', error);
      }
    );
  }

  carregarJogadores(idRanking: string) {
    console.error('idRanking:', idRanking);
    this.jogadorService.getJogadores(idRanking).subscribe(
      (jogadores) => {
        this.jogadores = jogadores;
      },
      (error) => {
        console.error('Erro ao carregar jogadores:', error);
      }
    );
  }

  excluirJogador(id: number): void {
    this.jogadorService.excluirJogador(this.idRanking, id).subscribe(
      () => {
        this.carregarJogadores(this.idRanking);
      },
      (error) => {
        console.error('Erro ao excluir jogador:', error);
      }
    );
  }
}
