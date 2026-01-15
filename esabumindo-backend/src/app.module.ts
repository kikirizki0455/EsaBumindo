import { Controller, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

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
    PrismaModule,
    UserModule,
    AuthModule,
    ArticlesModule,
    EmployeesModule,
    AttendancesModule,
    SalariesModule,
    ConfigModule.forRoot({
      isGlobal: true, // supaya bisa di pakai di mana saja
    }),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
