import { Component, OnInit } from '@angular/core';
import { ConfrontosService } from '../../services/confrontos.service';

@Component({
  selector: 'app-confrontos',
  templateUrl: './confrontos.component.html',
  styleUrls: ['./confrontos.component.css']
})
export class ConfrontosComponent implements OnInit {
  rodadaAtual: number = 1;
  confrontos: any[] = [];

  constructor(private confrontosService: ConfrontosService) {}

  ngOnInit() {
    this.carregarConfrontosSalvos();
  }

  carregarConfrontosSalvos() {
    this.confrontosService.recuperarConfrontos().subscribe(
      (confrontos) => {
        this.confrontos = confrontos;
        console.log('Confrontos recuperados:', this.confrontos);
      },
      (error) => {
        console.error('Erro ao recuperar confrontos:', error);
      }
    );
  }

  sortearConfrontosPorRodada() {
    const senha = prompt('Digite a senha para sortear:');
    if (senha === '123') {
      this.confrontosService.sortearConfrontosPorRodada(this.rodadaAtual).subscribe({
        next: (confrontosSorteados) => {
          this.confrontos = confrontosSorteados;
          console.log('Confrontos sorteados para a rodada', this.rodadaAtual + ':', this.confrontos);
        },
        error: (error) => {
          console.error('Erro ao sortear confrontos por rodada:', error);
        }
      });
    } else {
      alert('Senha incorreta. Operação cancelada.');
    }
  }

  salvarResultado(confronto: any) {
    confronto.id = 0;
    const resultados = {
      set1a: confronto.set1a,
      set1b: confronto.set1b,
      set2a: confronto.set2a,
      set2b: confronto.set2b,
      tiebreaka: confronto.tiebreaka,
      tiebreakb: confronto.tiebreakb
    };

    this.confrontosService.salvarResultado(confronto.id, resultados).subscribe(
      (response) => {
        console.log('Resultado salvo com sucesso:', response);
      },
      (error) => {
        console.error('Erro ao salvar resultado:', error);
      }
    );
  }
}
