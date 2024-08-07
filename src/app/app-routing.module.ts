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
import { RankingsComponent } from './components/rankings/rankings.component';
import { RankingMenuComponent } from './components/ranking-menu/ranking-menu.component';
import { CadastrarRankingComponent } from './components/cadastrar-ranking/cadastrar-ranking.component';
import { CadastrarTorneioComponent } from './components/cadastrar-torneio/cadastrar-torneio.component';
import { AlunosComponent } from './components/alunos/alunos.component';
import { CadastrarAlunoComponent } from './components/alunos/cadastrar-aluno/cadastrar-aluno.component';
import { AlunoDetalheComponent } from './components/alunos/aluno-detalhe/aluno-detalhe.component';
import { AuthGuard } from './authGuard';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'resetarsenha', component: ResetarSenhaComponent },
  { path: 'cadastrarusuario', component: CadastrarUsuarioComponent },
  { path: 'menu', component: MenuinicialComponent, canActivate: [AuthGuard] },
  { path: 'rankings', component: RankingsComponent, canActivate: [AuthGuard]},
  { path: 'ranking-menu/:idRanking', component: RankingMenuComponent, canActivate: [AuthGuard]},
  { path: 'ranking/:idRanking/:nome', component: RankingComponent},
  { path: 'cadastro/:idRanking/:nome', component: CadastroComponent, canActivate: [AuthGuard] },
  { path: 'historico/:idRanking/:nome', component: HistoricoComponent, canActivate: [AuthGuard] },
  { path: 'confrontos/:idRanking/:nome', component: ConfrontosComponent, canActivate: [AuthGuard] },
  { path: 'jogadores/:idRanking/:nome', component: JogadoresComponent, canActivate: [AuthGuard] },
  { path: 'torneios', component: TorneiosComponent, canActivate: [AuthGuard] },
  { path: 'torneio/:id', component: TorneioDetalhadoComponent, canActivate: [AuthGuard]},
  { path: 'cadastrar-jogador-torneio/:idTorneio', component: CadastrarJogadorTorneioComponent, canActivate: [AuthGuard] },
  { path: 'cadastrar-ranking', component: CadastrarRankingComponent, canActivate: [AuthGuard] },
  { path: 'cadastrar-torneio', component: CadastrarTorneioComponent, canActivate: [AuthGuard] },
  { path: 'alunos', component: AlunosComponent, canActivate: [AuthGuard] },
  { path: 'alunos/cadastrar-aluno', component: CadastrarAlunoComponent, canActivate: [AuthGuard] },
  { path: 'ver-tabela-torneio/:idTorneio/:nome', component: VerTabelaTorneioComponent },
  { path: 'aluno-detalhe/:nome', component: AlunoDetalheComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
