import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-resetar-senha',
  templateUrl: './resetar-senha.component.html',
  styleUrls: ['./resetar-senha.component.css']
})
export class ResetarSenhaComponent {
  email: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) { }

  resetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = "As senhas não correspondem.";
      return;
    }

    this.authService.resetPassword(this.email, this.newPassword)
      .subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.error(error);
          this.errorMessage = "Erro ao redefinir a senha.";
        }
      );
  }
}
