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
    JogadoresComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [JogadorService],
  bootstrap: [AppComponent]
})
export class AppModule { }