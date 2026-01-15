// src/attendances/dto/create-attendance.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsIn,
} from 'class-validator';

export class CreateAttendanceDto {
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsDateString()
  @IsOptional()
  checkIn?: string;

  @IsDateString()
  @IsOptional()
  checkOut?: string;

  @IsString()
  @IsOptional()
  shiftType?: string;

  @IsNumber()
  @IsOptional()
  workHours?: number;

  @IsNumber()
  @IsOptional()
  overtimeHours?: number;

  @IsString()
  @IsIn(['present', 'absent', 'leave'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
