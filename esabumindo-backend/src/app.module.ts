import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { PreOrderModule } from './pre-order/pre-order.module';
import { ProductionModule } from './production/production.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ArticlesModule } from './articles/articles.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendancesModule } from './attendances/attendances.module';
import { SalariesModule } from './salaries/salaries.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // ✅ SECURITY: Global Rate Limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    // API Modules - HARUS DIDEFINISIKAN SEBELUM ServeStaticModule
    EmailModule,
    PreOrderModule,
    ProductionModule,
    PrismaModule,
    UserModule,
    AuthModule,
    ArticlesModule,
    EmployeesModule,
    AttendancesModule,
    SalariesModule,
    // ServeStaticModule HARUS PALING AKHIR untuk menghindari conflict
    // dengan API routes
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // ✅ SECURITY: Enable ThrottlerGuard globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
