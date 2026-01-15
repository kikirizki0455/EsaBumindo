import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.employee.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            attendances: true,
            salaries: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findUnique({
      where: { id },
      include: {
        attendances: {
          orderBy: { date: 'desc' },
          take: 10,
        },
        salaries: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }

    return employee;
  }

  async create(data: CreateEmployeeDto) {
    // Check if employee code or email already exists
    const existingEmployee = await this.prisma.employee.findFirst({
      where: {
        OR: [{ employeeCode: data.employeeCode }, { email: data.email }],
      },
    });

    if (existingEmployee) {
      const field =
        existingEmployee.employeeCode === data.employeeCode
          ? 'Employee code'
          : 'Email';
      throw new ConflictException(`${field} already exists`);
    }

    return this.prisma.employee.create({
      data: {
        ...data,
        joinDate: new Date(data.joinDate),
      },
    });
  }

  async update(id: string, data: UpdateEmployeeDto) {
    await this.findOne(id);

    // Check if new employee code or email conflicts
    if (data.employeeCode || data.email) {
      const existingEmployee = await this.prisma.employee.findFirst({
        where: {
          AND: [
            { NOT: { id } },
            {
              OR: [
                ...(data.employeeCode
                  ? [{ employeeCode: data.employeeCode }]
                  : []),
                ...(data.email ? [{ email: data.email }] : []),
              ],
            },
          ],
        },
      });

      if (existingEmployee) {
        const field =
          existingEmployee.employeeCode === data.employeeCode
            ? 'Employee code'
            : 'Email';
        throw new ConflictException(`${field} already exists`);
      }
    }

    return this.prisma.employee.update({
      where: { id },
      data: {
        ...data,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.employee.delete({
      where: { id },
    });
  }
}
