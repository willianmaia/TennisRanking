import { Component } from '@angular/core';
import { JogadorService } from '../../services/jogador.service';
import { Jogador } from '../../models/jogador.model';
import { ActivatedRoute} from '@angular/router';
import { RankingService } from 'src/app/services/ranking.service';
import { Ranking } from '../../models/ranking.model';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  jogador: Jogador = { id: '', nome: '', sobrenome: '', dataNascimento: '' };
  nomeInvalido = false;
  sobrenomeInvalido = false;
  dataNascimentoInvalida = false;
  ranking: Ranking = { id: '', nome: ''};
  idRanking: string = '';

  constructor(
    private jogadorService: JogadorService, 
    private route: ActivatedRoute, 
    private rankingService: RankingService
  ) { }

  ngOnInit(): void {
    const idRanking = this.route.snapshot.paramMap.get('idRanking');
    if (idRanking) {
      this.idRanking = idRanking;
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

  salvarJogador() {
    // Remover espaços em branco dos valores do jogador
    this.jogador.nome = this.jogador.nome.trim();
    this.jogador.sobrenome = this.jogador.sobrenome.trim();
    if (this.jogador.dataNascimento) {
      this.jogador.dataNascimento = this.jogador.dataNascimento.trim();
    }
  
    // Validar os campos
    if (!this.jogador.nome) {
      this.nomeInvalido = true;
    } else {
      const nomeRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
      this.nomeInvalido = !nomeRegex.test(this.jogador.nome);
    }
  
    if (!this.jogador.sobrenome) {
      this.sobrenomeInvalido = true;
    } else {
      const sobrenomeRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
      this.sobrenomeInvalido = !sobrenomeRegex.test(this.jogador.sobrenome);
    }
  
    if (!this.jogador.dataNascimento) {
      this.dataNascimentoInvalida = true;
    } else {
      const dataNascimentoRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      this.dataNascimentoInvalida = !dataNascimentoRegex.test(this.jogador.dataNascimento);
    }
  
    // Salvar jogador se os campos forem válidos
    if (!this.nomeInvalido && !this.sobrenomeInvalido && !this.dataNascimentoInvalida) {
      this.jogadorService.salvarJogador(this.idRanking, this.jogador).subscribe(
        (response) => {
          console.log('Jogador cadastrado com sucesso:', response);
          this.jogador = { id: '', nome: '', sobrenome: '', dataNascimento: '' };
        },
        (error) => {
          console.error('Erro ao cadastrar jogador:', error);
        }
      );
    }
  }
  
}
