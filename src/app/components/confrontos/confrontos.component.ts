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
  jogadores: any[] = []; // Adicione esta propriedade para armazenar os jogadores
  editandoConfrontos: boolean = false;

  constructor(private confrontosService: ConfrontosService) {}
  

  ngOnInit() {
    this.carregarConfrontosSalvos();
    this.carregarJogadores(); // Carrega os jogadores ao inicializar o componente
  }

  carregarConfrontosSalvos() {
    this.confrontosService.recuperarConfrontosPorRodada(this.rodadaAtual).subscribe(
      (response: any[]) => {
        if (response && Array.isArray(response)) {
          this.confrontosProcessados = response
            .filter((confrontoData: any) => confrontoData && confrontoData.confronto)
            .map((confrontoData: any) => ({
              confronto: confrontoData.confronto,
              set1a: confrontoData.set1a,
              set1b: confrontoData.set1b,
              set2a: confrontoData.set2a,
              set2b: confrontoData.set2b,
              tiebreaka: confrontoData.tiebreaka,
              tiebreakb: confrontoData.tiebreakb,
              wo: confrontoData.woja || confrontoData.wojb ? 
                (confrontoData.woja ? confrontoData.confronto.split(' ')[0] : confrontoData.confronto.split(' ')[3]) :
                '',
              woja: confrontoData.woja,
              wojb: confrontoData.wojb
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
  

  carregarJogadores() {
    this.confrontosService.recuperarJogadores().subscribe(
      (jogadores: any[]) => {
        this.jogadores = jogadores;
      },
      (error) => {
        console.error('Erro ao carregar jogadores:', error);
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
  }

  private sortearConfrontosDiretamente(confrontosASortear: Confronto[]) {
    this.confrontosService.sortearConfrontosPorRodada(this.rodadaAtual).subscribe({
      next: (response: any) => {
        if (response && response.message) {
          console.log(response.message);
          this.carregarConfrontosSalvos();
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

  editarConfrontos() {
    this.confrontosProcessados.forEach((confronto: any) => {
      confronto.editando = true;
    });
    this.editandoConfrontos = true;
  }

  async salvarConfrontosEditados() {
    const confrontosEditados: any[] = this.confrontosProcessados.filter((confronto: any) => confronto.editando);

    let confrontoExistente = false;
  
    await this.carregarConfrontosSalvos();
  
    for (const confrontoEditado of confrontosEditados) {
      const jogador1 = this.jogadores.find(jogador => jogador.id === confrontoEditado.novoJogador1);
      const jogador2 = this.jogadores.find(jogador => jogador.id === confrontoEditado.novoJogador2);
  
      confrontoEditado.confronto = `${jogador1.nome} ${jogador1.sobrenome} x ${jogador2.nome} ${jogador2.sobrenome}`;

      confrontoEditado.set1a = '';
      confrontoEditado.set1b = '';
      confrontoEditado.set2a = '';
      confrontoEditado.set2b = '';
      confrontoEditado.tiebreaka = '';
      confrontoEditado.tiebreakb = '';
      confrontoEditado.ja = '';
      confrontoEditado.jb = '';

      delete confrontoEditado.editando;
      delete confrontoEditado.novoJogador1;
      delete confrontoEditado.novoJogador2;

      const confrontoEditadoString = `${confrontoEditado.confronto}`;
      if (await this.confrontoExistenteNaLista(confrontoEditadoString)) {
        confrontoExistente = true;
        break;
      }
    }

    if (confrontoExistente) {
      alert(`Um ou mais confrontos editados já existem na lista de confrontos.`);
      return;
    }
    this.salvarConfrontosRodada(confrontosEditados);
    this.editandoConfrontos = false;
  }

  private salvarConfrontosRodada(confrontosEditados: any[]) {
    this.confrontosService.salvarConfrontosRodada(this.rodadaAtual, confrontosEditados).subscribe(
      () => {
        alert('Confrontos editados salvos com sucesso!');
        // Atualizar a lista de confrontos após o salvamento
        this.carregarConfrontosSalvos();
      },
      (error) => {
        alert('Erro ao salvar confrontos editados.');
      }
    );
  }

private async confrontoExistenteNaLista(confrontoEditadoString: string): Promise<boolean> {
  try {
    const confrontosExistentesConsolidados = await this.confrontosService.criarListaConfrontosExistentesConsolidados().toPromise();

    if (!confrontosExistentesConsolidados || confrontosExistentesConsolidados.length === 0) {
      return false;
    }

    const confrontosValidos = confrontosExistentesConsolidados
      .flatMap(confrontos => confrontos ? confrontos.filter(confronto => confronto !== null) : [])
      .filter(confronto => confronto !== undefined);

    if (confrontosValidos.length === 0) {
      return false;
    }

    const confrontosValidosFlat = confrontosValidos.flatMap(confrontos => confrontos);

    const confrontosExistentesFlat = confrontosValidosFlat.map(confronto => confronto.confronto);

    return confrontosExistentesFlat.includes(confrontoEditadoString);
  } catch (error) {
    return false; 
  }
}

marcarJogadores(confronto: any, opcaoSelecionada: string) {
  if (opcaoSelecionada === '') {
    confronto.woja = false;
    confronto.wojb = false;
  } else if (opcaoSelecionada === confronto.confronto.split(' ')[0]) {
    confronto.woja = true;
    confronto.wojb = false;
  } else if (opcaoSelecionada === confronto.confronto.split(' ')[3]) {
    confronto.woja = false;
    confronto.wojb = true;
  }
}

}
