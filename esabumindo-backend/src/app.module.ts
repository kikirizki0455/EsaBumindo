import { Controller, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    PrismaModule,
    AdminModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true, // supaya bisa di pakai di mana saja
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
