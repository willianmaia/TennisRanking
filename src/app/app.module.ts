import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JogadorService } from './services/jogador.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MenuinicialComponent } from './components/menuinicial/menuinicial.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { RankingComponent } from './components/ranking/ranking.component';
import { HistoricoComponent } from './components/historico/historico.component';
import { ConfrontosComponent } from './components/confrontos/confrontos.component';
import { JogadoresComponent } from './components/jogadores/jogadores.component';
import { LoginComponent } from './components/login/login.component';
import { AuthService } from './services/auth.service';
import { ResetarSenhaComponent } from './components/resetar-senha/resetar-senha.component';
import { CadastrarUsuarioComponent } from './components/cadastrar-usuario/cadastrar-usuario.component';
import { TorneiosComponent } from './components/torneios/torneios.component';
import { TorneioDetalhadoComponent } from './components/torneio-detalhado/torneio-detalhado.component';
import { CadastrarJogadorTorneioComponent } from './components/torneio-detalhado/cadastrar-jogador-torneio/cadastrar-jogador-torneio.component';
import { VerTabelaTorneioComponent } from './components/torneio-detalhado/ver-tabela-torneio/ver-tabela-torneio.component';
import { RankingMenuComponent } from './components/ranking-menu/ranking-menu.component';
import { RankingsComponent } from './components/rankings/rankings.component';
import { CadastrarRankingComponent } from './components/cadastrar-ranking/cadastrar-ranking.component';
import { CadastrarTorneioComponent } from './components/cadastrar-torneio/cadastrar-torneio.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MenuinicialComponent,
    CadastroComponent,
    RankingComponent,
    HistoricoComponent,
    ConfrontosComponent,
    JogadoresComponent,
    LoginComponent,
    ResetarSenhaComponent,
    CadastrarUsuarioComponent,
    TorneiosComponent,
    TorneioDetalhadoComponent,
    CadastrarJogadorTorneioComponent,
    VerTabelaTorneioComponent,
    RankingMenuComponent,
    RankingsComponent,
    CadastrarRankingComponent,
    CadastrarTorneioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [JogadorService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
