import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    email: string;
    password: string;
    name: string;
    role: Role;
  }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
      },
    });
  }

  async createUser() {
    const hashed = await bcrypt.hash('admin123', 10);

    return this.prisma.user.create({
      data: {
        email: 'adminesa@gmail.com',
        password: hashed,
        name: 'DIREKTUR',
      },
    });
  }
  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
