import { Component } from '@angular/core';
import { JogadorService } from '../../services/jogador.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {

  jogador: any = {}; // Objeto para armazenar os dados do jogador

  constructor(private jogadorService: JogadorService) { }

  salvarJogador() {
    // Chamar o serviço para salvar o jogador no JSON Server
    this.jogadorService.salvarJogador(this.jogador).subscribe(
      (response) => {
        console.log('Jogador cadastrado com sucesso:', response);
        // Limpar o formulário após o cadastro
        this.jogador = {};
      },
      (error) => {
        console.error('Erro ao cadastrar jogador:', error);
      }
    );
  }

}
