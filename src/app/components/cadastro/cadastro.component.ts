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
    // Validar campos obrigatórios
    if (!this.jogador.nome) {
      this.nomeInvalido = true;
    } else {
      // Validar formato do nome utilizando regex (apenas letras e espaços, de 2 a 50 caracteres)
      const nomeRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
      this.nomeInvalido = !nomeRegex.test(this.jogador.nome);
    }

    if (!this.jogador.sobrenome) {
      this.sobrenomeInvalido = true;
    } else {
      // Validar formato do sobrenome utilizando regex (apenas letras e espaços, de 2 a 50 caracteres)
      const sobrenomeRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
      this.sobrenomeInvalido = !sobrenomeRegex.test(this.jogador.sobrenome);
    }

    if (!this.jogador.dataNascimento) {
      this.dataNascimentoInvalida = true;
    } else {
      // Validar formato da data de nascimento utilizando regex (dd/mm/aaaa)
      const dataNascimentoRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      this.dataNascimentoInvalida = !dataNascimentoRegex.test(this.jogador.dataNascimento);
    }

    // Se todos os campos estão preenchidos e válidos, salvar o jogador
    if (!this.nomeInvalido && !this.sobrenomeInvalido && !this.dataNascimentoInvalida) {
      this.jogadorService.salvarJogador(this.jogador).subscribe(
        (response) => {
          console.log('Jogador cadastrado com sucesso:', response);
          // Limpar o formulário após o cadastro
          this.jogador = { id: '', nome: '', sobrenome: '', dataNascimento: '' };
        },
        (error) => {
          console.error('Erro ao cadastrar jogador:', error);
        }
      );
    }
  }
}
