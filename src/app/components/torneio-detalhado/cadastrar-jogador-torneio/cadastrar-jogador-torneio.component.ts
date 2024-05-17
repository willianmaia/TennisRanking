import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TorneioService } from '../../../services/torneio.service';
import { Jogador } from '../../../models/jogador.model';

@Component({
  selector: 'app-cadastrar-jogador-torneio',
  templateUrl: './cadastrar-jogador-torneio.component.html',
  styleUrls: ['./cadastrar-jogador-torneio.component.css']
})
export class CadastrarJogadorTorneioComponent implements OnInit {
  jogador: Jogador = { nome: '', sobrenome: '' };
  nomeInvalido: boolean = false;
  sobrenomeInvalido: boolean = false;
  jogadorCadastrado: boolean = false;
  idTorneio: string = '';

  constructor(private route: ActivatedRoute, private torneioService: TorneioService) {
    this.idTorneio = '';
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.idTorneio = params.get('idTorneio') || '';
      console.log('idTorneio:', this.idTorneio);
    });
  }

  salvarJogadorTorneio() {
    // Use trim() para remover espaços extras antes de validar
    this.jogador.nome = this.jogador.nome.trim();
    this.jogador.sobrenome = this.jogador.sobrenome.trim();

    this.nomeInvalido = !this.validarNome(this.jogador.nome);
    this.sobrenomeInvalido = !this.validarNome(this.jogador.sobrenome);

    if (!this.nomeInvalido && !this.sobrenomeInvalido) {
        this.torneioService.adicionarJogadorTorneio(this.idTorneio, this.jogador).subscribe(
            (response) => {
                console.log('Jogador adicionado com sucesso:', response);
                alert('Jogador cadastrado com sucesso');
                this.jogadorCadastrado = true;
                // Limpe os campos do formulário
                this.jogador = { nome: '', sobrenome: '' };
            },
            (error) => {
                console.error('Erro ao adicionar jogador:', error);
            }
        );
    }
  }

  validarNome(nome: string): boolean {
    return nome.match(/^[a-zA-Z\s]{2,50}$/) !== null;
  }
}
