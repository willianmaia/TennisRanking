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
          this.router.navigateByUrl('/menu');
          // Simula um token de autenticação
          const authToken = 'fakeAuthToken';

          // Salva o token no armazenamento local
          localStorage.setItem(this.TOKEN_KEY, authToken);
        },
        error => {
          console.error(error);
          if (error.error && error.error.error) {
            alert(error.error.error);
          } else {
            alert("Erro ao fazer login. Por favor, tente novamente.");
          }
        }
      );
  }
  
  redirectToResetPasswordPage(): void {
    this.router.navigateByUrl('/resetarsenha');
  }
}
