import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {

  historicoConfrontos: any[] = []; // Defina o tipo apropriado para a propriedade

  constructor() { }

  ngOnInit(): void {
    // Aqui você pode inicializar o histórico de confrontos, por exemplo, buscando do serviço
    this.historicoConfrontos = [
      { jogador1: 'Jogador A', jogador2: 'Jogador B', resultado: 'Vitória do Jogador A' },
      { jogador1: 'Jogador C', jogador2: 'Jogador D', resultado: 'Empate' },
      // Adicione outros confrontos conforme necessário
    ];
  }

}
