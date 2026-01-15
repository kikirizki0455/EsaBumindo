// src/employees/dto/create-employee.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsNumber,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsNotEmpty()
  position: string;

  @IsString()
  @IsNotEmpty()
  department: string;

  @IsString()
  @IsIn(['non-shift', 'shift'])
  shiftType: string;

  @IsNumber()
  @IsNotEmpty()
  hourlyRate: number;

  @IsDateString()
  @IsNotEmpty()
  joinDate: string;

  @IsString()
  @IsIn(['active', 'inactive'])
  @IsOptional()
  status?: string;
}
