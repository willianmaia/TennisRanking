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
    this.editandoConfrontos = true;
    console.log('Confrontos após a edição:', this.confrontosProcessados);
  }
  
  
  
  async salvarConfrontosEditados() {
    const confrontosEditados: any[] = this.confrontosProcessados.filter((confronto: any) => confronto.editando);
  
    // Variável para verificar se algum confronto editado já existe na lista de confrontos existentes
    let confrontoExistente = false;
  
    // Atualizar a lista de confrontos existentes antes de verificar a existência do confronto editado
    await this.carregarConfrontosSalvos(); // Usar await aqui
  
    for (const confrontoEditado of confrontosEditados) {
      // Obter os jogadores selecionados
      const jogador1 = this.jogadores.find(jogador => jogador.id === confrontoEditado.novoJogador1);
      const jogador2 = this.jogadores.find(jogador => jogador.id === confrontoEditado.novoJogador2);
  
      // Definir o confronto com o nome e sobrenome dos jogadores selecionados
      confrontoEditado.confronto = `${jogador1.nome} ${jogador1.sobrenome} x ${jogador2.nome} ${jogador2.sobrenome}`;
  
      // Restante da lógica de atualização dos confrontos
      confrontoEditado.set1a = '';
      confrontoEditado.set1b = '';
      confrontoEditado.set2a = '';
      confrontoEditado.set2b = '';
      confrontoEditado.tiebreaka = '';
      confrontoEditado.tiebreakb = '';
  
      // Remover os campos que não precisam ser salvos
      delete confrontoEditado.editando;
      delete confrontoEditado.novoJogador1;
      delete confrontoEditado.novoJogador2;
  
      // Verificar se o confronto editado já existe na lista de confrontos existentes
      const confrontoEditadoString = `${confrontoEditado.confronto}`;
      if (await this.confrontoExistenteNaLista(confrontoEditadoString)) { // Usar await aqui
        console.log('confrontoEditadoString:', confrontoEditadoString);
        confrontoExistente = true;
        break; // Saia do loop se encontrar um confronto existente
      }
    }
  
    // Se algum confronto editado já existir na lista de confrontos existentes, não prosseguir com o salvamento
    if (confrontoExistente) {
      alert(`Um ou mais confrontos editados já existem na lista de confrontos.`);
      return;
    }
  
    console.log('Confrontos editados:', confrontosEditados);
  
    // Salvando os confrontos editados usando o método salvarConfrontosRodada
    this.salvarConfrontosRodada(confrontosEditados);
    this.editandoConfrontos = false;
  }


  
  // Método para salvar confrontos editados usando o método salvarConfrontosRodada
  private salvarConfrontosRodada(confrontosEditados: any[]) {
    this.confrontosService.salvarConfrontosRodada(this.rodadaAtual, confrontosEditados).subscribe(
      () => {
        console.log('Confrontos editados salvos com sucesso!');
        alert('Confrontos editados salvos com sucesso!');
        // Atualizar a lista de confrontos após o salvamento
        this.carregarConfrontosSalvos();
      },
      (error) => {
        console.error('Erro ao salvar confrontos editados:', error);
        alert('Erro ao salvar confrontos editados. Verifique o console para mais detalhes.');
      }
    );
  }
  


// Método para verificar se o confronto editado já existe na lista de confrontos existentes
private async confrontoExistenteNaLista(confrontoEditadoString: string): Promise<boolean> {
  try {
    // Recuperar os confrontos existentes na forma de uma matriz de arrays
    const confrontosExistentesConsolidados = await this.confrontosService.criarListaConfrontosExistentesConsolidados().toPromise();

    // Verificar se confrontosExistentesConsolidados é undefined ou vazio
    if (!confrontosExistentesConsolidados || confrontosExistentesConsolidados.length === 0) {
      console.error('Confrontos existentes não encontrados ou lista vazia.');
      return false;
    }

    // Filtrar confrontos nulos
    const confrontosValidos = confrontosExistentesConsolidados
      .flatMap(confrontos => confrontos ? confrontos.filter(confronto => confronto !== null) : [])
      .filter(confronto => confronto !== undefined);

    console.error('confrontosValidos:', confrontosValidos);
    console.log('Tamanho de confrontosValidos:', confrontosValidos.length);

    // Verificar se há valores undefined nos arrays dentro de confrontosValidos
    if (confrontosValidos.length === 0) {
      console.error('Confrontos existentes contêm apenas valores undefined.');
      return false;
    }

    const confrontosValidosFlat = confrontosValidos.flatMap(confrontos => confrontos);

    // Extrair os confrontos da matriz de arrays
    const confrontosExistentesFlat = confrontosValidosFlat.map(confronto => confronto.confronto);
    console.error('confrontosExistentesFinal:', confrontosExistentesFlat);

    return confrontosExistentesFlat.includes(confrontoEditadoString);
  } catch (error) {
    console.error('Erro ao verificar confronto existente na lista:', error);
    return false; // Retornar false em caso de erro
  }
}





  
}
