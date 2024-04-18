import { Component, OnInit } from '@angular/core';
import { ConfrontosService } from '../../services/confrontos.service';
import { Confronto } from '../../models/confronto.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-confrontos',
  templateUrl: './confrontos.component.html',
  styleUrls: ['./confrontos.component.css']
})
export class ConfrontosComponent implements OnInit {
  rodadaAtual: number = 1;
  confrontos: Confronto[] = [];
  confrontosProcessados: any[] = [];

  constructor(private confrontosService: ConfrontosService) {}

  ngOnInit() {
    this.carregarConfrontosSalvos();
  }

  carregarConfrontosSalvos() {
    this.confrontosService.recuperarConfrontosPorRodada(this.rodadaAtual).subscribe(
      (response: any[]) => {
        if (response && Array.isArray(response)) {
          // Processa e filtra os confrontos da rodada atual
          this.confrontosProcessados = response
            .filter((confrontoData: any) => confrontoData && confrontoData.confronto) // Filtra confrontos válidos
            .map((confrontoData: any) => ({
              confronto: confrontoData.confronto,
              set1a: confrontoData.set1a,
              set1b: confrontoData.set1b,
              set2a: confrontoData.set2a,
              set2b: confrontoData.set2b,
              tiebreaka: confrontoData.tiebreaka,
              tiebreakb: confrontoData.tiebreakb
            }));

          console.log('Confrontos da rodada atual:', this.confrontosProcessados);
        } else {
          this.confrontosProcessados = [];
        }
      },
      (error) => {
        console.error('Erro ao recuperar confrontos:', error);
        this.confrontosProcessados = [];
      }
    );
  }

  /*sortearConfrontosPorRodada() {
    const senha = prompt('Digite a senha para sortear:');
    if (senha === '123') {
      this.confrontosService.sortearConfrontosPorRodada(this.rodadaAtual).subscribe({
        next: (response: any) => {
          if (response && response.message) {
            console.log(response.message); // Exibe a mensagem de sucesso do servidor
            
            // Atualiza os confrontos após o sorteio
            this.carregarConfrontosSalvos();
          } else {
            console.error('Resposta inválida ao sortear confrontos por rodada:', response);
          }
        },
        error: (error) => {
          console.error('Erro ao sortear confrontos por rodada:', error);
        }
      });
    } else {
      alert('Senha incorreta. Operação cancelada.');
    }
  }*/

  sortearConfrontosPorRodada() {
    const senha = prompt('Digite a senha para sortear:');
    if (senha === '123') {
      // Recupera os confrontos existentes para a rodada atual
      this.confrontosService.recuperarConfrontosPorRodada(this.rodadaAtual).subscribe(
        (confrontosExistentes: any[]) => {
          if (confrontosExistentes && confrontosExistentes.length > 0) {
            console.log('Confrontos existentes encontrados:', confrontosExistentes);
            // Se existirem confrontos, encerra a operação
            return;
          }
  
          // Se não houver confrontos existentes, sorteia os confrontos para a rodada atual
          console.log('Nenhum confronto encontrado para a rodada atual. Realizando sorteio...');
  
          this.confrontosService.sortearConfrontosPorRodada(this.rodadaAtual).subscribe({
            next: (response: any) => {
              if (response && response.message) {
                console.log(response.message); // Exibe a mensagem de sucesso do servidor
  
                // Atualiza os confrontos após o sorteio
                this.carregarConfrontosSalvos();
              } else {
                console.error('Resposta inválida ao sortear confrontos por rodada:', response);
              }
            },
            error: (error) => {
              console.error('Erro ao sortear confrontos por rodada:', error);
            }
          });
        },
        (error) => {
          console.error('Erro ao recuperar confrontos existentes:', error);
          // Tratar o erro específico de resposta 404
          if (error.status === 404) {
            console.log('Nenhum confronto encontrado para a rodada atual. Realizando sorteio...');
            // Realizar o sorteio dos confrontos para a rodada atual
            this.confrontosService.sortearConfrontosPorRodada(this.rodadaAtual).subscribe({
              next: (response: any) => {
                if (response && response.message) {
                  console.log(response.message); // Exibe a mensagem de sucesso do servidor
  
                  // Atualiza os confrontos após o sorteio
                  this.carregarConfrontosSalvos();
                } else {
                  console.error('Resposta inválida ao sortear confrontos por rodada:', response);
                }
              },
              error: (error) => {
                console.error('Erro ao sortear confrontos por rodada:', error);
              }
            });
          } else {
            console.error('Erro desconhecido ao recuperar confrontos:', error);
          }
        }
      );
    } else {
      alert('Senha incorreta. Operação cancelada.');
    }
  }
  
  
  

  salvarConfrontos(confrontos: any[]) {
    if (confrontos.length > 0) {
      this.confrontosService.salvarResultado(confrontos, this.rodadaAtual).subscribe(
        (response) => {
          console.log('Confrontos salvos com sucesso:', response);
          alert('Confrontos salvos com sucesso!');
        },
        (error) => {
          console.error('Erro ao salvar confrontos:', error);
          alert('Erro ao salvar confrontos. Verifique o console para mais detalhes.');
        }
      );
    } else {
      console.warn('Nenhum confronto para salvar.');
      alert('Nenhum confronto para salvar.');
    }
  }

  salvarResultado(confrontos: Confronto[]) {
    const rodada = 1; 
    this.confrontosService.salvarResultado(confrontos, rodada).subscribe(
      (response) => {
        console.log('Resultado salvo com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao salvar resultado:', error);
      }
    );
  }
  
}


