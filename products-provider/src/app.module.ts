import { Module } from '@nestjs/common';

import { AppService, ProductObserverService, ProductService } from './services';
import { SSEService } from './services/SSE.service';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ProductService, SSEService, ProductObserverService],
})
export class AppModule {}
