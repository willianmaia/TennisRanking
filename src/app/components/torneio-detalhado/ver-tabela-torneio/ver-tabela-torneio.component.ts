import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TorneioService } from '../../../services/torneio.service';
import { Jogador } from '../../../models/jogador.model';
import { Confronto } from '../../../models/confronto.model';
import { AuthService } from 'src/app/services/auth.service';
import * as QRCode from 'qrcode';


@Component({
  selector: 'app-ver-tabela-torneio',
  templateUrl: './ver-tabela-torneio.component.html',
  styleUrls: ['./ver-tabela-torneio.component.css']
})
export class VerTabelaTorneioComponent implements OnInit {
  torneioId: string = '';
  torneioNome: string = '';
  confrontos: Confronto[] = [];
  jogadores: Jogador[] = [];
  exibirTabela8: boolean = false;
  exibirTabela16: boolean = false
  confrontoData: { [key: string]: any } = {};
  usuarioLogado: boolean = false;
  apenasVisualizacao: boolean = false;
  loading: boolean = false;
  qrCodeUrl: string = '';

  constructor(private route: ActivatedRoute, private torneioService: TorneioService, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.torneioId = params.get('idTorneio') || '';
      this.torneioNome = params.get('nome') || '';
      this.carregarJogadoresTorneio(this.torneioId);
      this.carregarConfrontosTorneio(this.torneioId);
      this.usuarioLogado = this.authService.isLoggedIn();
      this.apenasVisualizacao = !this.usuarioLogado;
      this.generateQRCode();
  
      // Inicialize todos os confrontos possíveis
      const fases = [
        "oitavas1", "oitavas2", "oitavas3", "oitavas4",
        "oitavas5", "oitavas6", "oitavas7", "oitavas8",
        "quartas1", "quartas2", "quartas3", "quartas4",
        "semi1", "semi2", "final"
      ];
      fases.forEach(fase => {
        if (!this.confrontoData[fase]) {
          this.confrontoData[fase] = {
            horario: '',
            jogadorA: '',
            jogadorB: '',
            set1a: '',
            set1b: '',
            set2a: '',
            set2b: '',
            tiebreaka: '',
            tiebreakb: ''
          };
        }
      });
    });
  }
  

  carregarJogadoresTorneio(torneioId: string): void {
    this.torneioService.getJogadoresTorneio(torneioId)
      .subscribe(
        (jogadores: Jogador[]) => {
          this.jogadores = jogadores;
          console.log('Jogadores carregados:', this.jogadores);
          
          // Verifique o número de jogadores e decida qual tabela exibir
          if (this.jogadores.length <= 8) {
            this.exibirTabela8 = true;
          }
          if (this.jogadores.length >= 9 && this.jogadores.length <= 16) {
            this.exibirTabela16 = true;
          }
        },
        (error) => {
          console.error('Ocorreu um erro ao carregar os jogadores do torneio:', error);
        }
      );
  }

  carregarConfrontosTorneio(torneioId: string): void {
    this.torneioService.getConfrontosTorneio(torneioId)
      .subscribe(
        (confrontos: Confronto[]) => {
          this.confrontos = confrontos;
          console.log('Confrontos carregados:', this.confrontos);
          this.preencherConfrontos();
        },
        (error) => {
          console.error('Ocorreu um erro ao carregar os confrontos do torneio:', error);
        }
      );
  }

  preencherConfrontos(): void {
    this.confrontos.forEach(confronto => {
      if (!this.confrontoData[confronto.fase]) {
        this.confrontoData[confronto.fase] = {};
      }
      this.confrontoData[confronto.fase].horario = confronto.horario;
      this.confrontoData[confronto.fase].jogadorA = `${confronto.jogadorANome} ${confronto.jogadorASobrenome}`;
      this.confrontoData[confronto.fase].jogadorB = `${confronto.jogadorBNome} ${confronto.jogadorBSobrenome}`;
      this.confrontoData[confronto.fase].set1a = confronto.set1a;
      this.confrontoData[confronto.fase].set1b = confronto.set1b;
      this.confrontoData[confronto.fase].set2a = confronto.set2a;
      this.confrontoData[confronto.fase].set2b = confronto.set2b;
      this.confrontoData[confronto.fase].tiebreaka = confronto.tiebreaka;
      this.confrontoData[confronto.fase].tiebreakb = confronto.tiebreakb;
    });
  }
  

  saveData(index: number = 0): void {
    this.loading = true;
    const fases = [
      "oitavas1", "oitavas2", "oitavas3", "oitavas4",
      "oitavas5", "oitavas6", "oitavas7", "oitavas8",
      "quartas1", "quartas2", "quartas3", "quartas4",
      "semi1", "semi2", "final"
    ];
  
    if (index < fases.length) {
      const fase = fases[index];
      const confronto = {
        fase: fase,
        horario: (document.querySelector(`#${fase}-horario`) as HTMLInputElement)?.value,
        jogadorANome: (document.querySelector(`#${fase}-jogadorA`) as HTMLInputElement)?.value.split(' ')[0] || "",
        jogadorASobrenome: (document.querySelector(`#${fase}-jogadorA`) as HTMLInputElement)?.value.split(' ')[1] || "",
        jogadorBNome: (document.querySelector(`#${fase}-jogadorB`) as HTMLInputElement)?.value.split(' ')[0] || "",
        jogadorBSobrenome: (document.querySelector(`#${fase}-jogadorB`) as HTMLInputElement)?.value.split(' ')[1] || "",
        set1a: (document.querySelector(`#${fase}-set1a`) as HTMLInputElement)?.value,
        set1b: (document.querySelector(`#${fase}-set1b`) as HTMLInputElement)?.value,
        set2a: (document.querySelector(`#${fase}-set2a`) as HTMLInputElement)?.value,
        set2b: (document.querySelector(`#${fase}-set2b`) as HTMLInputElement)?.value,
        tiebreaka: (document.querySelector(`#${fase}-tiebreaka`) as HTMLInputElement)?.value,
        tiebreakb: (document.querySelector(`#${fase}-tiebreakb`) as HTMLInputElement)?.value,
        confronto: "",
        woja: false,
        wojb: false,
      };
  
      // Chamada ao método do serviço para salvar o dado do confronto
      this.torneioService.salvarConfrontoTorneio(confronto, this.torneioId)
        .subscribe(
          response => {
            console.log(`Confronto da ${fase} salvo com sucesso:`, response);
            // Avança para a próxima fase
            this.saveData(index + 1);
          },
          error => {
            console.error(`Erro ao salvar o Confronto da ${fase}:`, error);
            this.loading = false;
          }
        );
    } else {
        this.loading = false;
        alert('Salvo com sucesso!');
    }
  }

  generateQRCode() {
    const message = encodeURIComponent("Olá! Gostaria de saber mais sobre a aplicação da tabela do torneio.");
    const whatsappUrl = `https://wa.me/+55011932281200/?text=${message}`;
  
    QRCode.toDataURL(whatsappUrl, (err, url) => {
      if (err) {
        console.error('Erro ao gerar o QR code:', err);
        return;
      }
      this.qrCodeUrl = url;
    });
  }
  
  
}
