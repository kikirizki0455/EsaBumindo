// src/attendances/attendances.controller.ts

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendances.dto';

@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Get()
  async findAll(
    @Query('employeeId') employeeId?: string,
    @Query('month') month?: string,
    @Query('year') year?: string,
  ) {
    return this.attendancesService.findAll(employeeId, month, year);
  }

  @Get('employee/:id')
  async findByEmployee(@Param('id') employeeId: string) {
    return this.attendancesService.findByEmployee(employeeId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.create(createAttendanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.attendancesService.remove(id);
  }
}
