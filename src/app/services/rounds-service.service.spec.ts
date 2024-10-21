import { TestBed } from '@angular/core/testing';

import { RoundsServiceService } from './rounds-service.service';

describe('RoundsServiceService', () => {
  let service: RoundsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoundsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
