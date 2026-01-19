// src/attendances/attendances.service.ts

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendances.dto';

@Injectable()
export class AttendancesService {
  constructor(private prisma: PrismaService) {}

  async findAll(employeeId?: string, month?: string, year?: string) {
    const whereClause: any = {};

    if (employeeId) {
      whereClause.employeeId = employeeId;
    }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      whereClause.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.attendance.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            name: true,
            employeeCode: true,
            hourlyRate: true,
          },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findByEmployee(employeeId: string) {
    return this.prisma.attendance.findMany({
      where: { employeeId },
      orderBy: { date: 'desc' },
    });
  }

  async create(data: CreateAttendanceDto) {
    // Check if attendance already exists
    const existingAttendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: data.employeeId,
          date: new Date(data.date),
        },
      },
    });

    if (existingAttendance) {
      throw new ConflictException('Attendance for this date already exists');
    }

    return this.prisma.attendance.create({
      data: {
        employeeId: data.employeeId,
        date: new Date(data.date),
        checkIn: data.checkIn ? new Date(data.checkIn) : null,
        checkOut: data.checkOut ? new Date(data.checkOut) : null,
        shiftType: data.shiftType,
        workHours: data.workHours,
        overtimeHours: data.overtimeHours,
        status: data.status || 'present',
        notes: data.notes,
      },
    });
  }

  async remove(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    await this.prisma.attendance.delete({
      where: { id },
    });
  }
}
