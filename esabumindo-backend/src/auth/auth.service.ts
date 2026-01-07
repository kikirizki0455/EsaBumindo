import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AdminService } from 'src/admin/admin.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async register(data: { email: string; password: string; name: string }) {
    const existing = await this.adminService.findByEmail(data.email);

    if (existing) {
      throw new BadRequestException('email sudah terdaftar');
    }

    const hashed = await bcrypt.hash(data.password, 10);

    return this.adminService.create({
      email: data.email,
      password: hashed,
      name: data.name,
    });
  }

  async login(email: string, password: string) {
    const admin = await this.adminService.findByEmail(email);
    if (!admin) {
      throw new UnauthorizedException('email tidak di temukan');
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password Salah');
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
    };
    const token = this.jwtService.sign(payload);
    return {
      message: 'login berhasil',
      access_token: token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    };
  }
}
