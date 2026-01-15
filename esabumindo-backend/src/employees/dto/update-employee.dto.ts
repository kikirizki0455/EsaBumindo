// src/employees/dto/update-employee.dto.ts

import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsIn,
  IsDateString,
} from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @IsOptional()
  employeeCode?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  position?: string;

  @IsString()
  @IsOptional()
  department?: string;

  @IsString()
  @IsIn(['non-shift', 'shift'])
  @IsOptional()
  shiftType?: string;

  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @IsDateString()
  @IsOptional()
  joinDate?: string;

  @IsString()
  @IsIn(['active', 'inactive'])
  @IsOptional()
  status?: string;
}
