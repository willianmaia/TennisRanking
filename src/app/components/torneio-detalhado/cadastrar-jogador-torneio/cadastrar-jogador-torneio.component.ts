import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TorneioService } from '../../../services/torneio.service';
import { Jogador } from '../../../models/jogador.model';

@Component({
  selector: 'app-cadastrar-jogador-torneio',
  templateUrl: './cadastrar-jogador-torneio.component.html',
  styleUrls: ['./cadastrar-jogador-torneio.component.css']
})
export class CadastrarJogadorTorneioComponent {
  jogador: Jogador = { nome: '', sobrenome: '' };
  nomeInvalido: boolean = false;
  sobrenomeInvalido: boolean = false;
  jogadorCadastrado: boolean = false; // Propriedade para controlar a exibição do alerta

  constructor(private route: ActivatedRoute, private torneioService: TorneioService) { }

  salvarJogadorTorneio() {
    // Validação dos campos nome e sobrenome
    this.nomeInvalido = !this.validarNome(this.jogador.nome);
    this.sobrenomeInvalido = !this.validarNome(this.jogador.sobrenome);

    // Se os campos são válidos, proceder com a adição do jogador ao torneio
    if (!this.nomeInvalido && !this.sobrenomeInvalido) {
      this.route.params.subscribe(params => {
        const torneioId = params['id'];
        this.torneioService.adicionarJogadorTorneio(torneioId, this.jogador).subscribe(
          (response) => {
            console.log('Jogador adicionado com sucesso:', response);
            // Defina a propriedade jogadorCadastrado como verdadeira para exibir o alerta
            this.jogadorCadastrado = true;
            // Limpe os campos do formulário
            this.jogador = { nome: '', sobrenome: '' };
          },
          (error) => {
            console.error('Erro ao adicionar jogador:', error);
            // Trate o erro conforme necessário
          }
        );
      });
    }
  }

  validarNome(nome: string): boolean {
    // Lógica de validação do nome
    // Retorne true se o nome for válido, caso contrário, retorne false
    return nome.match(/^[a-zA-Z\s]{2,50}$/) !== null;
  }
}
