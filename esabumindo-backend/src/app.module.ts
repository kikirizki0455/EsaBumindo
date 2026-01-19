import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ArticlesModule } from './articles/articles.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendancesModule } from './attendances/attendances.module';
import { SalariesModule } from './salaries/salaries.module';

@Module({
  imports: [
    // ⬇️ INI YANG PENTING
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
    }),

    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    UserModule,
    AuthModule,
    ArticlesModule,
    EmployeesModule,
    AttendancesModule,
    SalariesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
