import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { RolesGuard } from './guard/roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
    // ✅ FIX: Gunakan registerAsync agar JWT_SECRET terbaca setelah ConfigModule diinisialisasi
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [JwtModule],
})
export class AuthModule {}
