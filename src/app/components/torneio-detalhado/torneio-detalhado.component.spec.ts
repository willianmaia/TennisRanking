import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorneioDetalhadoComponent } from './torneio-detalhado.component';

describe('TorneioDetalhadoComponent', () => {
  let component: TorneioDetalhadoComponent;
  let fixture: ComponentFixture<TorneioDetalhadoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TorneioDetalhadoComponent]
    });
    fixture = TestBed.createComponent(TorneioDetalhadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
