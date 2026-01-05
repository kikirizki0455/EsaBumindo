import { Controller, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // supaya bisa di pakai di mana saja
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
