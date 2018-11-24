import { TestBed } from '@angular/core/testing';

import { ChartPopulationService } from './chart-population.service';

describe('ChartPopulationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChartPopulationService = TestBed.get(ChartPopulationService);
    expect(service).toBeTruthy();
  });
});
