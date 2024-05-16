import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarJogadorTorneioComponent } from './cadastrar-jogador-torneio.component';

describe('CadastrarJogadorTorneioComponent', () => {
  let component: CadastrarJogadorTorneioComponent;
  let fixture: ComponentFixture<CadastrarJogadorTorneioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarJogadorTorneioComponent]
    });
    fixture = TestBed.createComponent(CadastrarJogadorTorneioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
