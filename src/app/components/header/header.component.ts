import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router, private authService: AuthService) { }

  redirectToHome() {
    this.router.navigate(['/']); // Navega para a rota principal ('/')
  }

  redirectToMenu() {
    this.router.navigate(['/menu']); // Navega para a rota do menu
  }

  logout() {
    this.authService.logout();
    // Redireciona para a página de login
    this.router.navigate(['/login']);
  }

}
