import { Component, OnInit } from '@angular/core';
import { RankingService } from '../../services/ranking.service';
import { Ranking } from '../../models/ranking.model';

@Component({
  selector: 'app-rankings',
  templateUrl: './rankings.component.html',
  styleUrls: ['./rankings.component.css']
})
export class RankingsComponent implements OnInit {
  rankings: Ranking[] = [];

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.buscarRankings();
  }

  buscarRankings() {
    this.rankingService.getRankings().subscribe(
      (rankings: Ranking[]) => {
        this.rankings = rankings;
        console.error('rankings:', rankings);
      },
      (error) => {
        console.error('Erro ao buscar rankings:', error);
      }
    );
  }

}
