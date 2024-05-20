import { Component, OnInit } from '@angular/core';
import { RankingService } from '../../services/ranking.service';
import { Ranking } from '../../models/ranking.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ranking-menu',
  templateUrl: './ranking-menu.component.html',
  styleUrls: ['./ranking-menu.component.css']
})
export class RankingMenuComponent implements OnInit {
  ranking: Ranking = { id: '', nome: ''};

  constructor(
    private route: ActivatedRoute,
    private rankingService: RankingService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idRanking = params.get('idRanking');
      if (idRanking) {
        this.getRankingById(idRanking);
      }
    });
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

  cadastrarJogadorRanking(): void {
    const idRanking = this.route.snapshot.paramMap.get('idRanking');
    if (idRanking && this.ranking.nome) {
      this.router.navigate(['/cadastro', idRanking, this.ranking.nome]);
    }
  }

  verRanking(): void {
    const idRanking = this.route.snapshot.paramMap.get('idRanking');
    if (idRanking && this.ranking.nome) {
      this.router.navigate(['/ranking', idRanking, this.ranking.nome]);
    }
  }

  verHistoricoConfrontos(): void {
    const idRanking = this.route.snapshot.paramMap.get('idRanking');
    if (idRanking && this.ranking.nome) {
      this.router.navigate(['/historico', idRanking, this.ranking.nome]);
    }
  }

  verConfrontos(): void {
    const idRanking = this.route.snapshot.paramMap.get('idRanking');
    if (idRanking && this.ranking.nome) {
      this.router.navigate(['/confrontos', idRanking, this.ranking.nome]);
    }
  }

  verJogadores(): void {
    const idRanking = this.route.snapshot.paramMap.get('idRanking');
    if (idRanking && this.ranking.nome) {
      this.router.navigate(['/jogadores', idRanking, this.ranking.nome]);
    }
  }
}
