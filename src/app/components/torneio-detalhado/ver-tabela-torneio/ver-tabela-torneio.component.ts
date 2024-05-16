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
  jogadores: Jogador[] = [];

  constructor(private route: ActivatedRoute, private torneioService: TorneioService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.torneioId = params.get('idTorneio') || '';
      console.log('idTorneio:', this.torneioId);
      this.carregarJogadoresTorneio(this.torneioId);
    });
  }
  
  carregarJogadoresTorneio(torneioId: string): void {
    this.torneioService.getJogadoresTorneio(torneioId)
      .subscribe(
        (jogadores: Jogador[]) => {
          this.jogadores = jogadores;
          console.log('Jogadores carregados:', this.jogadores);
        },
        (error) => {
          console.error('Ocorreu um erro ao carregar os jogadores do torneio:', error);
        }
      );
  }
}
