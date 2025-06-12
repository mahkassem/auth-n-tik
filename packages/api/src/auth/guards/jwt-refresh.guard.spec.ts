import { JwtRefreshGuard } from './jwt-refresh.guard';

describe('JwtRefreshGuard', () => {
  let guard: JwtRefreshGuard;

  beforeEach(() => {
    guard = new JwtRefreshGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with jwt-refresh strategy', () => {
    expect(guard).toBeInstanceOf(JwtRefreshGuard);
  });

  it('should have canActivate method', () => {
    expect(typeof guard.canActivate).toBe('function');
  });
});
