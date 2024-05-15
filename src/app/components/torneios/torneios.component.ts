import { Component, OnInit } from '@angular/core';
import { TorneioService } from '../../services/torneio.service';
import { Torneio } from '../../models/torneio.model';

@Component({
  selector: 'app-torneio',
  templateUrl: './torneios.component.html',
  styleUrls: ['./torneios.component.css']
})
export class TorneiosComponent implements OnInit {
  torneios: Torneio[] = [];

  constructor(private torneioService: TorneioService) { }

  ngOnInit() {
    this.buscarTorneios();
  }

  buscarTorneios() {
    this.torneioService.getTorneios().subscribe(
      (torneios: Torneio[]) => {
        this.torneios = torneios;
        console.error('torneios:', torneios);
      },
      (error) => {
        console.error('Erro ao buscar torneios:', error);
        // Trate o erro de acordo com sua lógica de aplicativo
      }
    );
  }
}
