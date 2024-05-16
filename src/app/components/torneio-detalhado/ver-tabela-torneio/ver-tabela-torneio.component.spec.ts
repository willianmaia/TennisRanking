import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerTabelaTorneioComponent } from './ver-tabela-torneio.component';

describe('VerTabelaTorneioComponent', () => {
  let component: VerTabelaTorneioComponent;
  let fixture: ComponentFixture<VerTabelaTorneioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerTabelaTorneioComponent]
    });
    fixture = TestBed.createComponent(VerTabelaTorneioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
