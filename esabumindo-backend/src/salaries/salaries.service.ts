// src/salaries/salaries.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Salary } from '@prisma/client';
import { CalculateSalaryDto } from './dto/calculate-salaries.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class SalariesService {
  constructor(private prisma: PrismaService) {}

  async findAll(month?: string, year?: string) {
    const whereClause: any = {};

    if (month && year) {
      whereClause.month = parseInt(month);
      whereClause.year = parseInt(year);
    }

    return this.prisma.salary.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            name: true,
            employeeCode: true,
            position: true,
            department: true,
            hourlyRate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const salary = await this.prisma.salary.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });

    if (!salary) {
      throw new NotFoundException(`Salary with ID ${id} not found`);
    }

    return salary;
  }

  async calculateSalaries(data: CalculateSalaryDto) {
    const { month, year } = data;

    // Get all active employees
    const employees = await this.prisma.employee.findMany({
      where: { status: 'active' },
    });

    const results: Salary[] = [];

    for (const employee of employees) {
      // Get attendances for this month
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      const attendances = await this.prisma.attendance.findMany({
        where: {
          employeeId: employee.id,
          date: { gte: startDate, lte: endDate },
          status: 'present',
        },
      });

      // Calculate totals
      const totalWorkHours = attendances.reduce(
        (sum, att) => sum + parseFloat(att.workHours?.toString() || '0'),
        0,
      );

      const totalOvertimeHours = attendances.reduce(
        (sum, att) => sum + parseFloat(att.overtimeHours?.toString() || '0'),
        0,
      );

      const totalDays = attendances.length;

      const hourlyRate = parseFloat(employee.hourlyRate.toString());
      const basicSalary = totalWorkHours * hourlyRate;
      const overtimePay = totalOvertimeHours * hourlyRate * 1.5;
      const totalSalary = basicSalary + overtimePay;

      // Check if salary already exists
      const existingSalary = await this.prisma.salary.findUnique({
        where: {
          employeeId_month_year: {
            employeeId: employee.id,
            month,
            year,
          },
        },
      });

      if (existingSalary) {
        // Update existing
        const updated = await this.prisma.salary.update({
          where: { id: existingSalary.id },
          data: {
            basicSalary: new Decimal(basicSalary),
            overtimePay: new Decimal(overtimePay),
            totalWorkHours: new Decimal(totalWorkHours),
            totalOverTimeHours: new Decimal(totalOvertimeHours),
            totalDays,
            totalSalary: new Decimal(totalSalary),
          },
        });
        results.push(updated);
      } else {
        // Create new
        const created = await this.prisma.salary.create({
          data: {
            employeeId: employee.id,
            month,
            year,
            basicSalary: new Decimal(basicSalary),
            overtimePay: new Decimal(overtimePay),
            totalWorkHours: new Decimal(totalWorkHours),
            totalOverTimeHours: new Decimal(totalOvertimeHours),
            totalDays,
            totalSalary: new Decimal(totalSalary),
            status: 'pending',
          },
        });
        results.push(created);
      }
    }

    return {
      message: 'Salaries calculated successfully',
      count: results.length,
    };
  }

  async markAsPaid(id: string) {
    await this.findOne(id);

    return this.prisma.salary.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt: new Date(),
      },
    });
  }
}
