import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: {
    email: string;
    password: string;
    name: string;
    role: Role;
  }) {
    const existing = await this.userService.findByEmail(data.email);

    if (existing) {
      throw new BadRequestException('email sudah terdaftar');
    }

    const hashed = await bcrypt.hash(data.password, 10);

    return this.userService.create({
      email: data.email,
      password: hashed,
      name: data.name,
      role: data.role,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('email tidak di temukan');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password Salah');
    }

    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);
    return {
      message: 'login berhasil',
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async deleteUser(targetUserId: number, currentUser: any) {
    const target = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!target) {
      throw new NotFoundException('User tidak ditemukan');
    }

    if (target.role === Role.DIREKTUR && currentUser.role !== Role.DIREKTUR) {
      throw new ForbiddenException(
        'Tidak boleh menghapus user dengan role DIREKTUR',
      );
    }

    if (target.id === currentUser.id) {
      throw new ForbiddenException('Tidak boleh menghapus akun sendiri');
    }

    return this.prisma.user.delete({ where: { id: targetUserId } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
}
