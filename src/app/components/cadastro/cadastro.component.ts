import { Component } from '@angular/core';
import { JogadorService } from '../../services/jogador.service';
import { Jogador } from '../../models/jogador.model';

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

  constructor(private jogadorService: JogadorService) { }

  salvarJogador() {
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

    if (!this.nomeInvalido && !this.sobrenomeInvalido && !this.dataNascimentoInvalida) {
      this.jogadorService.salvarJogador(this.jogador).subscribe(
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
