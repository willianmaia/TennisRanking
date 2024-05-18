import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuinicialComponent } from './components/menuinicial/menuinicial.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { ConfrontosComponent } from './components/confrontos/confrontos.component';
import { JogadoresComponent } from './components/jogadores/jogadores.component';
import { LoginComponent } from './components/login/login.component';
import { ResetarSenhaComponent } from './components/resetar-senha/resetar-senha.component';
import { CadastrarUsuarioComponent } from './components/cadastrar-usuario/cadastrar-usuario.component';
import { TorneiosComponent } from './components/torneios/torneios.component';
import { TorneioDetalhadoComponent } from './components/torneio-detalhado/torneio-detalhado.component';
import { CadastrarJogadorTorneioComponent } from './components/torneio-detalhado/cadastrar-jogador-torneio/cadastrar-jogador-torneio.component';
import { VerTabelaTorneioComponent } from './components/torneio-detalhado/ver-tabela-torneio/ver-tabela-torneio.component';
import { AuthGuard } from './authGuard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'resetarsenha', component: ResetarSenhaComponent },
  { path: 'cadastrarusuario', component: CadastrarUsuarioComponent },
  { path: 'menu', component: MenuinicialComponent, canActivate: [AuthGuard] },
  { path: 'cadastro', component: CadastroComponent, canActivate: [AuthGuard] },
  { path: 'ranking', component: RankingComponent},
  { path: 'historico', component: HistoricoComponent, canActivate: [AuthGuard] },
  { path: 'confrontos', component: ConfrontosComponent, canActivate: [AuthGuard] },
  { path: 'jogadores', component: JogadoresComponent, canActivate: [AuthGuard] },
  { path: 'torneios', component: TorneiosComponent, canActivate: [AuthGuard] },
  { path: 'torneio/:id', component: TorneioDetalhadoComponent, canActivate: [AuthGuard]},
  { path: 'cadastrar-jogador-torneio/:idTorneio', component: CadastrarJogadorTorneioComponent, canActivate: [AuthGuard] },
  { path: 'ver-tabela-torneio/:idTorneio/:nome', component: VerTabelaTorneioComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
