import { Injectable, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Injectable()
class Demo1Service {
  constructor(private readonly app: AppService) {}
  demo() {
    this.app.getHello();
  }
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, Demo1Service],
})
export class AppModule {}
