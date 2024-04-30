import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  private TOKEN_KEY = 'authToken';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.authService.login(this.email, this.password)
      .subscribe(
        response => {
          // Login bem-sucedido, redirecionar para próxima página
          this.router.navigateByUrl('/menu');
          // Simula um token de autenticação
          const authToken = 'fakeAuthToken';

          // Salva o token no armazenamento local
          localStorage.setItem(this.TOKEN_KEY, authToken);
          console.log(response);
        },
        error => {
          // Tratar erros de login
          console.error(error);
          if (error.error && error.error.error) {
            // Se a resposta de erro contiver a chave "error", exiba a mensagem de erro
            alert(error.error.error);
          } else {
            // Se não, exiba uma mensagem genérica de erro
            alert("Erro ao fazer login. Por favor, tente novamente.");
          }
        }
      );
  }
  

  redirectToResetPasswordPage(): void {
    this.router.navigateByUrl('/resetarsenha');
  }
}
