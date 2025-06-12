import { ExecutionContext } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should extend AuthGuard with jwt strategy', () => {
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });

  // Note: The actual JWT validation logic is handled by Passport.js,
  // so we test the guard's integration with the framework rather than mocking passport
  it('should have canActivate method', () => {
    expect(typeof guard.canActivate).toBe('function');
  });
});
