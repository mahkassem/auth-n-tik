import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  getHello(): string {
    const nodeEnv = this.configService.get<string>('app.nodeEnv');
    const port = this.configService.get<number>('app.port');
    const debug = this.configService.get<boolean>('app.debug');

    return `Hello World! Running on ${nodeEnv} environment, port ${port}, debug: ${debug}`;
  }

  getHealthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.configService.get<string>('app.nodeEnv'),
      port: this.configService.get<number>('app.port'),
      debug: this.configService.get<boolean>('app.debug'),
    };
  }
}
