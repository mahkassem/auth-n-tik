import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              app: {
                nodeEnv: 'test',
                port: 8001,
                debug: false,
                logsLevel: 'error',
                secret: 'test-secret',
              },
            }),
          ],
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return environment info', () => {
      const result = appController.getHello();
      expect(result).toContain('test environment');
      expect(result).toContain('port 8001');
      expect(result).toContain('debug: false');
    });
  });

  describe('health', () => {
    it('should return health check info', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('ok');
      expect(result.environment).toBe('test');
      expect(result.port).toBe(8001);
      expect(result.debug).toBe(false);
      expect(result.timestamp).toBeDefined();
    });
  });
});
