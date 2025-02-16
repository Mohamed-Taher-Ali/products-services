import { MiddlewareConsumer, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

import {
  AppService,
  SSEService,
  ProductService,
  ProductsCronService,
} from './services';
import { PrismaModule } from './modules';
import { AppController } from './app.controller';
import { PaginationMiddleware } from './middlewares';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
  ],
  providers: [AppService, ProductService, ProductsCronService, SSEService],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PaginationMiddleware).forRoutes('*');
  }
}
