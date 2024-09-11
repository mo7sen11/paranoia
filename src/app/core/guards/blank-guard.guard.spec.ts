import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { blankGuardGuard } from './blank-guard.guard';

describe('blankGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => blankGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
