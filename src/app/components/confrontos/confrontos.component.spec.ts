import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfrontosComponent } from './confrontos.component';

describe('ConfrontosComponent', () => {
  let component: ConfrontosComponent;
  let fixture: ComponentFixture<ConfrontosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfrontosComponent]
    });
    fixture = TestBed.createComponent(ConfrontosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
