import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TennisRanking';
  showFooter = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Define a rota na qual o footer não deve aparecer
      const noFooterRoutes = ['/ver-tabela-torneio'];

      // Verifica se a rota atual está na lista de rotas sem footer
      this.showFooter = !noFooterRoutes.some(route => event.urlAfterRedirects.startsWith(route));
    });
  }
}
