import { Component, OnInit } from '@angular/core';
import { TorneioService } from '../../../services/torneio.service';
import { Torneio } from '../../../models/torneio.model';
import { Confronto } from '../../../models/confronto.model';

@Component({
  selector: 'app-lista-jogos',
  templateUrl: './lista-jogos.component.html',
  styleUrls: ['./lista-jogos.component.css']
})
export class ListaJogosComponent implements OnInit {
  torneios: Torneio[] = [];
  confrontos: Confronto[] = [];
  selecionados: { [index: number]: boolean } = {}; // Armazena seleção de torneios usando índice numérico
  listaGerada: boolean = false;

  constructor(private torneioService: TorneioService) { }

  ngOnInit(): void {
    this.torneioService.getTorneios().subscribe({
      next: (data) => {
        this.torneios = data;
        this.torneios.forEach((_, index) => this.selecionados[index] = false); // Inicializa a seleção
      },
      error: (err) => console.error('Erro ao buscar torneios: ', err)
    });
  }

  // Função para alternar a seleção de torneios
  toggleSelection(index: number): void {
    this.selecionados[index] = !this.selecionados[index];
  }

  // Função para buscar confrontos dos torneios selecionados e gerar a lista
  gerarListaJogos(): void {
    const torneiosSelecionados = this.torneios
      .map((torneio, index) => ({ torneio, index }))
      .filter(item => this.selecionados[item.index]);
  
    if (torneiosSelecionados.length === 0) {
      alert('Selecione pelo menos um torneio.');
      return;
    }
  
    this.confrontos = [];
    const confrontosRequests = torneiosSelecionados.map(item => {
      return this.torneioService.getConfrontosTorneio(item.index.toString()).toPromise(); // Usa o índice como string
    });
  
    // Usando Promise.all para aguardar todas as requisições
    Promise.all(confrontosRequests).then(responses => {
      responses.forEach(response => {
        if (response) { // Verifica se a resposta não é undefined
          this.confrontos.push(...response);
        }
      });
  
      // Filtra os confrontos para remover aqueles sem horário
      this.confrontos = this.confrontos.filter(confronto => confronto.horario && confronto.horario.includes('-'));
  
      // Ordena os confrontos por dia e horário
      this.confrontos.sort(this.ordenarPorDiaEHora);

      // Marca que a lista foi gerada
      this.listaGerada = true;

      // Agora envia a lista de confrontos para o backend
      this.enviarListaDeConfrontos();
    }).catch(error => {
      console.error('Erro ao buscar confrontos: ', error);
    });
  }

  // Função para converter o dia e a hora em um valor numérico para comparação
  private ordenarPorDiaEHora(confrontoA: Confronto, confrontoB: Confronto): number {
    const dias: { [key: string]: number } = { 'SEX': 0, 'SAB': 1, 'DOM': 2 }; // Mapeando dias da semana
    const [diaA, horaA] = confrontoA.horario.split('-') as [string, string];
    const [diaB, horaB] = confrontoB.horario.split('-') as [string, string];
  
    // Primeiro, compara os dias
    const diaAIndex = dias[diaA as keyof typeof dias];
    const diaBIndex = dias[diaB as keyof typeof dias];
  
    if (diaAIndex !== diaBIndex) {
      return diaAIndex - diaBIndex; // Ordena pelos dias
    }
  
    // Se forem do mesmo dia, compara as horas (removendo o 'h' para comparação numérica)
    const horaAInt = parseInt(horaA.replace('h', ''), 10);
    const horaBInt = parseInt(horaB.replace('h', ''), 10);

    return horaAInt - horaBInt; // Ordena pelas horas
  }

  // Função para enviar a lista de confrontos
  private enviarListaDeConfrontos(): void {
    // Crie a lista de confrontos para enviar (por exemplo, usando o ID ou algum outro campo)
    const confrontosParaEnviar = this.confrontos.map(confronto => confronto.horario); // Supondo que o horário seja a informação importante
    
    this.torneioService.enviarListaConfrontos(confrontosParaEnviar).subscribe({
      next: (response) => {
        console.log('Lista de confrontos enviada com sucesso:', response);
      },
      error: (error) => {
        console.error('Erro ao enviar lista de confrontos:', error);
      }
    });
  }
}
