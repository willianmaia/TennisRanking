import { TestBed } from '@angular/core/testing';

import { ConfrontosService } from './confrontos.service';

describe('ConfrontosService', () => {
  let service: ConfrontosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfrontosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
