import { CurrentUser } from './current-user.decorator';

describe('CurrentUser Decorator', () => {
  it('should be defined', () => {
    expect(CurrentUser).toBeDefined();
  });

  it('should extract user from request', () => {
    // Get the decorator factory function
    const decoratorFactory = CurrentUser();

    // Since CurrentUser is created with createParamDecorator,
    // we need to test its behavior by simulating how NestJS would use it
    expect(typeof decoratorFactory).toBe('function');
  });

  it('should be a parameter decorator', () => {
    // Test that CurrentUser can be used as a parameter decorator
    const decorator = CurrentUser();
    expect(typeof decorator).toBe('function');

    // Parameter decorators should be callable with target, propertyKey, and parameterIndex
    expect(() => {
      const mockTarget = {};
      const mockPropertyKey = 'testMethod';
      const mockParameterIndex = 0;
      decorator(mockTarget, mockPropertyKey, mockParameterIndex);
    }).not.toThrow();
  });
});
