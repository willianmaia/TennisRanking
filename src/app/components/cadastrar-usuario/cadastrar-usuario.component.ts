import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastrar-usuario',
  templateUrl: './cadastrar-usuario.component.html',
  styleUrls: ['./cadastrar-usuario.component.css']
})
export class CadastrarUsuarioComponent {
  nome: string = '';
  sobrenome: string = '';
  email: string = '';
  password: string = '';
  papel: string = '';
  ranking: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) { }

  cadastrarUsuario(): void {
    this.authService.criarUsuario(this.nome, this.sobrenome, this.email, this.password, this.papel, this.ranking)
      .subscribe(
        response => {
          // Usuário criado com sucesso
          alert('Usuário cadastrado com sucesso');
          this.limparFormulario();
        },
        error => {
          // Tratar erros de criação de usuário
          //this.errorMessage = error.error;
          alert('Não foi possível cadastrar usuário. Verifique se o mesmo já está cadastrado.');
          console.error(error);
        }
      );
  }

  limparFormulario(): void {
    this.nome = '';
    this.sobrenome = '';
    this.email = '';
    this.password = '';
    this.papel = '';
    this.ranking = '';
  }
}
