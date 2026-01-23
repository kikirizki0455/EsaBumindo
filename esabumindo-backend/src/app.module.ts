import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PreOrderModule } from './pre-order/pre-order.module';

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
    // ⬇️ INI YANG PENTING
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.example',
    }),
    EmailModule,
    PreOrderModule,
    PrismaModule,
    UserModule,
    AuthModule,
    ArticlesModule,
    EmployeesModule,
    AttendancesModule,
    SalariesModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
