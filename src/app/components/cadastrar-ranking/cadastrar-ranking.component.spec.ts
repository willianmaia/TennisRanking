import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarRankingComponent } from './cadastrar-ranking.component';

describe('CadastrarRankingComponent', () => {
  let component: CadastrarRankingComponent;
  let fixture: ComponentFixture<CadastrarRankingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarRankingComponent]
    });
    fixture = TestBed.createComponent(CadastrarRankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
