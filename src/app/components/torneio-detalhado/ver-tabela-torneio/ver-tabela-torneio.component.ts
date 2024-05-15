import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TorneioService } from '../../../services/torneio.service';
import { Jogador } from '../../../models/jogador.model';
import { Confronto } from '../../../models/confronto.model';

@Component({
  selector: 'app-ver-tabela-torneio',
  templateUrl: './ver-tabela-torneio.component.html',
  styleUrls: ['./ver-tabela-torneio.component.css']
})
export class VerTabelaTorneioComponent implements OnInit {
  torneioId: string = '';
  confrontos: Confronto[] = [];
  jogadorA: Jogador = { nome: '', sobrenome: '' };
  jogadorB: Jogador = { nome: '', sobrenome: '' };
  jogadores: Jogador[] = [];

  constructor(private route: ActivatedRoute, private torneioService: TorneioService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.torneioId = params.get('idTorneio') || '';
      console.log('idTorneio:', this.torneioId);
      this.carregarConfrontosTorneio(this.torneioId);
      this.carregarJogadoresTorneio(this.torneioId);
    });
  }

  carregarConfrontosTorneio(torneioId: string): void {
    this.torneioService.getConfrontosTorneio(torneioId)
      .subscribe(
        (confrontos: Confronto[]) => {
          this.confrontos = confrontos;
          this.calcularPosicoes(); // Calcular as posições após carregar os confrontos
        },
        (error) => {
          console.error('Ocorreu um erro ao carregar os confrontos do torneio:', error);
        }
      );
  }

  salvarConfrontoTorneio(): void {
    // Implemente conforme necessário
  }

  carregarJogadoresTorneio(torneioId: string): void {
    this.torneioService.getJogadoresTorneio(torneioId)
      .subscribe(
        (jogadores: Jogador[]) => {
          this.jogadores = jogadores; // Atualiza a lista de jogadores
        },
        (error) => {
          console.error('Ocorreu um erro ao carregar os jogadores do torneio:', error);
        }
      );
  }

  calcularPosicoes(): void {
    const imagemWidth = 2260; // Largura da imagem
    const imagemHeight = 1072; // Altura da imagem
  
    this.confrontos.forEach((confronto, index) => {
      // Obter as coordenadas do retângulo mapeado
      const area = document.querySelector(`area[alt="jogador_a_oitavas_${index + 1}"]`);
      if (area) {
        const coords = area.getAttribute('coords');
        if (coords) {
          const parsedCoords = coords.split(',').map(coord => parseInt(coord.trim(), 10));
          // Calcular as posições posX e posY com base nas coordenadas
          const posX = (parsedCoords[0] + parsedCoords[2]) / 2;
          const posY = (parsedCoords[1] + parsedCoords[3]) / 2;
          // Atribuir as posições posX e posY ao confronto atual
          confronto.posX = posX;
          confronto.posY = posY;
        }
      }
    });
  }
  
  
}
