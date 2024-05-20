import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { TorneioService } from 'src/app/services/torneio.service';

@Component({
  selector: 'app-cadastrar-torneio',
  templateUrl: './cadastrar-torneio.component.html',
  styleUrls: ['./cadastrar-torneio.component.css']
})
export class CadastrarTorneioComponent {
  novoTorneio = {
    nome: '',
    data: '',
    horario: '',
    local: ''
  };

  constructor(private authService: AuthService, private torneioService: TorneioService) { }

  cadastrarTorneio() {
    if (this.camposValidos()) {
      this.torneioService.criarTorneio(this.novoTorneio).subscribe(
        response => {
          console.log('Torneio criado com sucesso:', response);
          alert('Torneio cadastrado com sucesso');
          this.limparFormulario();
        },
        error => {
          console.error('Erro ao criar torneio:', error);
          const errorMessage = error.error.message || 'Erro ao cadastrar novo torneio';
          alert(`${errorMessage}`);
        }
      );
    } else {
      alert('Todos os campos são obrigatórios');
    }
  }

  camposValidos(): boolean {
    return this.novoTorneio.nome.trim() !== '' &&
           this.novoTorneio.data.trim() !== '' &&
           this.novoTorneio.horario.trim() !== '' &&
           this.novoTorneio.local.trim() !== '';
  }

  limparFormulario(): void {
    this.novoTorneio.nome = '';
    this.novoTorneio.data = '';
    this.novoTorneio.horario = '';
    this.novoTorneio.local = '';
  }

}
