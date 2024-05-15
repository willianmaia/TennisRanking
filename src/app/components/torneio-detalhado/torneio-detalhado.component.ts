import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TorneioService } from '../../services/torneio.service';
import { Torneio } from '../../models/torneio.model';

@Component({
  selector: 'app-torneio-detalhado',
  templateUrl: './torneio-detalhado.component.html',
  styleUrls: ['./torneio-detalhado.component.css']
})
export class TorneioDetalhadoComponent implements OnInit {
  torneio: Torneio = {
    id: '',
    nome: '',
    data: '',
    horario: '',
    local: '',
    jogadores: []
  };

  constructor(private route: ActivatedRoute, private torneioService: TorneioService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const torneioId = params.get('id');
      if (torneioId) {
        this.torneioService.getTorneioById(torneioId).subscribe(torneio => {
          this.torneio = torneio;
        });
      }
    });
  }
}

