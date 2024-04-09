import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuinicialComponent } from './components/menuinicial/menuinicial.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { ConfrontosComponent } from './components/confrontos/confrontos.component';
import { JogadoresComponent } from './components/jogadores/jogadores.component';

const routes: Routes = [
  { path: '', component: MenuinicialComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'ranking', component: RankingComponent },
  { path: 'historico', component: HistoricoComponent },
  { path: 'confrontos', component: ConfrontosComponent },
  { path: 'jogadores', component: JogadoresComponent }
  // Adicione outras rotas conforme necessário
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
