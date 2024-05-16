import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TorneioService } from '../../services/torneio.service';
import { Torneio } from '../../models/torneio.model';

@Component({
  selector: 'app-torneio-detalhado',
  templateUrl: './torneio-detalhado.component.html',
  styleUrls: ['./torneio-detalhado.component.css']
})
export class TorneioDetalhadoComponent implements OnInit {
  torneio: Torneio = { id: '', nome: '', data: '', horario: '', local: '', jogadores: [] };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private torneioService: TorneioService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params && params.has('id')) { // Verifica se params é null ou indefinido e se contém a chave 'id'
        const id = params.get('id');
        if (id) { // Verifica se id é null ou indefinido
          const indice = +id;
          if (!isNaN(indice)) {
            this.buscarTorneioPorIndice(indice);
          }
        }
      }
    });
  }

  buscarTorneioPorIndice(indice: number) {
    this.torneioService.getTorneioPorIndice(indice).subscribe(torneio => {
      this.torneio = torneio;
    }, error => {
      console.error('Erro ao buscar torneio:', error);
    });
  }

  cadastrarJogadorTorneio(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.router.navigate(['/cadastrar-jogador-torneio', id]);
    }
  }

  verTabelaTorneio(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.router.navigate(['/ver-tabela-torneio', id]);
    }
  }
}
