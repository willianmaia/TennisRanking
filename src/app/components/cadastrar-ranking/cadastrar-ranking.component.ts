import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RankingService } from 'src/app/services/ranking.service';

@Component({
  selector: 'app-cadastrar-ranking',
  templateUrl: './cadastrar-ranking.component.html',
  styleUrls: ['./cadastrar-ranking.component.css']
})
export class CadastrarRankingComponent {
  novoRanking = {
    nome: ''
  };

  constructor(private authService: AuthService, private rankingService: RankingService) { }

  cadastrarRanking() {
    if (this.novoRanking.nome.trim()) {
      this.rankingService.criarRanking(this.novoRanking).subscribe(
        response => {
          console.log('Ranking criado com sucesso:', response);
          alert('Ranking cadastrado com sucesso');
          this.limparFormulario();
        },
        error => {
          console.error('Erro ao criar ranking:', error);
          alert('Erro ao cadastrar novo ranking');
        }
      );
    } else {
      console.error('O nome do ranking é obrigatório');
      alert('O nome do ranking é obrigatório');
    }
  }

  limparFormulario(): void {
    this.novoRanking.nome = '';
  }
}
