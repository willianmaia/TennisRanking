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
  confrontos: any[] = [];
  resultados: any[] = [];

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
        // Extrair os confrontos do array e formatar para exibição
        const confrontosArray = Object.keys(confrontos[0]) // Obter as chaves do primeiro confronto
          .filter(key => key !== 'id') // Filtrar a chave 'id'
          .map(key => confrontos[0][key]); // Mapear as chaves para obter os confrontos

        this.confrontos = confrontosArray;
        console.log('Confrontos recuperados:', this.confrontos);
      },
      (error) => {
        console.error('Erro ao recuperar confrontos:', error);
      }
    );
  }  
  

  sortearConfrontos() {
    const senha = prompt('Digite a senha para sortear:');
    if (senha === '123') {
      this.jogadorService.getJogadores().subscribe({
        next: (jogadores: Jogador[]) => {
          const confrontosSorteados = this.confrontosService.sortearConfrontos(jogadores);
          this.confrontosService.salvarConfrontos(confrontosSorteados).subscribe({
            next: (response) => {
              console.log('Confrontos salvos com sucesso:', response);
              this.confrontos = confrontosSorteados;
            },
            error: (error) => {
              console.error('Erro ao salvar confrontos:', error);
            }
          });
        },
        error: (error) => {
          console.error('Erro ao recuperar jogadores:', error);
        }
      });      
    } else {
      alert('Senha incorreta. Operação cancelada.');
    }
  }
  

  salvarResultado(confronto: any) {
    // Definindo o id do confronto como 0
    confronto.id = 0;
  
    // Preparando os resultados a serem salvos
    const resultados = {
      set1a: confronto.set1a,
      set1b: confronto.set1b,
      set2a: confronto.set2a,
      set2b: confronto.set2b,
      tiebreaka: confronto.tiebreaka,
      tiebreakb: confronto.tiebreakb
    };
  
    console.log('Confronto ID:', confronto.id);
    console.log('Resultados:', resultados);
  
    // Chamando o serviço para salvar os resultados com o confronto.id fixo em 0
    this.confrontosService.salvarResultado(confronto.id, resultados).subscribe(
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
