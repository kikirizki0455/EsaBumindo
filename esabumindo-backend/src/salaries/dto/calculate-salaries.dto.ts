// src/salaries/dto/calculate-salary.dto.ts

import { IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class CalculateSalaryDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(12)
  month: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(2020)
  year: number;
}
