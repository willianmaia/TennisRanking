import { Component, OnInit } from '@angular/core';
import { ConfrontosService } from '../../services/confrontos.service';
import { Jogador } from 'src/app/models/jogador.model'; // Importe a interface Jogador
import { JogadorService } from '../../services/jogador.service'; // Importe o serviço JogadoresService

@Component({
  selector: 'app-confrontos',
  templateUrl: './confrontos.component.html',
  styleUrls: ['./confrontos.component.css']
})
export class ConfrontosComponent implements OnInit {
  rodadaAtual: number = 1;
  confrontos: string[] = [];

  constructor(
    private confrontosService: ConfrontosService,
    private jogadorService: JogadorService
  ) {}

  ngOnInit() {
    this.carregarConfrontosSalvos();
  }

  carregarConfrontosSalvos() {
    this.confrontosService.recuperarConfrontos().subscribe(
      (confrontos) => {
        this.confrontos = confrontos;
      },
      (error) => {
        console.error('Erro ao recuperar confrontos:', error);
      }
    );
  }

  sortearConfrontos() {
    const senha = prompt('Digite a senha para sortear:');
    if (senha === 'senha_correta') {
      this.jogadorService.getJogadores().subscribe(
        (jogadores: Jogador[]) => {
          const confrontosSorteados = this.confrontosService.sortearConfrontos(jogadores);
          this.confrontosService.salvarConfrontos(confrontosSorteados).subscribe(
            (response) => {
              console.log('Confrontos salvos com sucesso:', response);
              this.confrontos = confrontosSorteados;
            },
            (error) => {
              console.error('Erro ao salvar confrontos:', error);
            }
          );
        },
        (error) => {
          console.error('Erro ao recuperar jogadores:', error);
        }
      );
    } else {
      alert('Senha incorreta. Operação cancelada.');
    }
  }
  

  inserirResultado(confronto: string, resultado: string) {
    this.confrontosService.salvarResultado(confronto, resultado).subscribe(
      (response) => {
        console.log('Resultado salvo com sucesso:', response);
        // Lógica adicional após salvar o resultado
      },
      (error) => {
        console.error('Erro ao salvar resultado:', error);
        // Tratar erros de salvamento
      }
    );
  }
}
