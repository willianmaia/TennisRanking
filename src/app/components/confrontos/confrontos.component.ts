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

  constructor(private confrontosService: ConfrontosService) {}
  

  ngOnInit() {
    this.carregarConfrontosSalvos();
    this.carregarJogadores(); // Carrega os jogadores ao inicializar o componente
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

  editarConfrontos() {
    console.log('Confrontos antes da edição:', this.confrontosProcessados);
    this.confrontosProcessados.forEach((confronto: any) => {
      confronto.editando = true; // Definindo como true para editar
    });
    console.log('Confrontos após a edição:', this.confrontosProcessados);
  }
  
  
  
  
  salvarConfrontosEditados() {
    const confrontosEditados: any[] = this.confrontosProcessados.filter((confronto: any) => confronto.editando);

    confrontosEditados.forEach((confrontoEditado: any) => {
      // Obter os jogadores selecionados
      const jogador1 = this.jogadores.find(jogador => jogador.id === confrontoEditado.novoJogador1);
      const jogador2 = this.jogadores.find(jogador => jogador.id === confrontoEditado.novoJogador2);
      
      // Definir o confronto com o nome e sobrenome dos jogadores selecionados
      confrontoEditado.confronto = `${jogador1.nome} ${jogador1.sobrenome} x ${jogador2.nome} ${jogador2.sobrenome}`;
      
      // Restante da lógica de atualização dos confrontos
      confrontoEditado.novoSet1a = confrontoEditado.set1a; // Armazenando o valor original de set1a
      confrontoEditado.novoSet1b = confrontoEditado.set1b; // Armazenando o valor original de set1b
      confrontoEditado.novoSet2a = confrontoEditado.set2a; // Armazenando o valor original de set2a
      confrontoEditado.novoSet2b = confrontoEditado.set2b; // Armazenando o valor original de set2b
      confrontoEditado.novoTiebreaka = confrontoEditado.tiebreaka; // Armazenando o valor original de tiebreaka
      confrontoEditado.novoTiebreakb = confrontoEditado.tiebreakb; // Armazenando o valor original de tiebreakb
    });
  
    console.log('Confrontos editados:', confrontosEditados);
 
    this.confrontosService.criarListaConfrontosExistentesConsolidados().subscribe((confrontosExistentesList: any[]) => {
      console.log('Confrontos recuperados no service:', confrontosExistentesList); // Adicione esta linha para verificar o retorno
      
      // Filtra os confrontos existentes para remover os valores nulos
      const confrontosExistentesFlat = confrontosExistentesList.flat().filter((confronto: any) => confronto !== null);
      
      confrontosEditados.forEach((confrontoEditado: any) => {
        const confrontoEditadoString = `${confrontoEditado.set1a} x ${confrontoEditado.set1b}`;
        
        // Verifica se o confronto editado já existe na lista de confrontos existentes
        if (confrontosExistentesFlat.some((confronto: any) => confronto.confronto === confrontoEditadoString)) {
          alert(`O confronto "${confrontoEditadoString}" já existe na lista de confrontos.`);
          return; // Encerra a função caso o confronto exista
        }
      });
      
      // Adiciona um log para verificar se está entrando na parte de salvar
      console.log('Salvando confrontos editados...');
      
      // Salva os confrontos editados se não houver conflitos
      this.confrontosService.salvarConfrontosRodada(this.rodadaAtual, confrontosEditados).subscribe(() => {
        alert('Confrontos editados salvos com sucesso!');
        this.carregarConfrontosSalvos();
      });
    });
  }
  
  
  
  
}
