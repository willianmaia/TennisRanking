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
    this.router.navigate(['/']);
  }

  redirectToMenu() {
    this.router.navigate(['/menu']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
