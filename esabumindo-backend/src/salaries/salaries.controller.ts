// src/salaries/salaries.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SalariesService } from './salaries.service';
import { CalculateSalaryDto } from './dto/calculate-salaries.dto';

@Controller('salaries')
export class SalariesController {
  constructor(private readonly salariesService: SalariesService) {}

  @Get()
  async findAll(@Query('month') month?: string, @Query('year') year?: string) {
    return this.salariesService.findAll(month, year);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.salariesService.findOne(id);
  }

  @Post('calculate')
  @HttpCode(HttpStatus.OK)
  async calculate(@Body() calculateSalaryDto: CalculateSalaryDto) {
    return this.salariesService.calculateSalaries(calculateSalaryDto);
  }

  @Patch(':id/pay')
  async markAsPaid(@Param('id') id: string) {
    return this.salariesService.markAsPaid(id);
  }
}
