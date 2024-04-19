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
  confrontosExistentesFinal: Confronto[] = [];

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


  async sortearConfrontosPorRodada() {
    const senha = prompt('Digite a senha para sortear:');
    if (senha !== '123') {
      alert('Senha incorreta. Operação cancelada.');
      return;
    }
    else{
      this.sortearConfrontosDiretamente([]);
    }

    /*try {
      const confrontosExistentes = await this.confrontosService.criarListaConfrontosExistentes().toPromise();

      if (!confrontosExistentes || confrontosExistentes.length === 0) {
        console.log('Lista de confrontos existentes está vazia ou indefinida.');
        this.sortearConfrontosDiretamente([]);
        return;
      }
    } catch (error) {
      console.error('Erro ao recuperar confrontos existentes:', error);
    }*/
  }


  private sortearConfrontosDiretamente(confrontosASortear: Confronto[]) {
    this.confrontosService.sortearConfrontosPorRodada(this.rodadaAtual).subscribe({
      next: (response: any) => {
        if (response && response.message) {
          console.log(response.message); // Exibe a mensagem de sucesso do servidor
          this.carregarConfrontosSalvos(); // Atualiza os confrontos após o sorteio
        } else {
          console.error('Resposta inválida ao sortear confrontos por rodada:', response);
        }
      },
      error: (error) => {
        console.error('Erro ao sortear confrontos por rodada:', error);
      }
    });
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


