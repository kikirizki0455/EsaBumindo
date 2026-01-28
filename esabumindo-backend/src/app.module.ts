import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
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
      envFilePath: '.env.example',
    }),
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
  providers: [AppService],
})
export class AppModule {}
