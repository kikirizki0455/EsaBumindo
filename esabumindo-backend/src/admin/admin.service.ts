import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; password: string; name: string }) {
    return this.prisma.admin.create({ data });
  }

  async createAdmin() {
    const hashed = await bcrypt.hash('admin123', 10);

    return this.prisma.admin.create({
      data: {
        email: 'adminesa@gmail.com',
        password: hashed,
        name: 'Super Admin',
      },
    });
  }
  findByEmail(email: string) {
    return this.prisma.admin.findUnique({
      where: { email },
    });
  }
}
