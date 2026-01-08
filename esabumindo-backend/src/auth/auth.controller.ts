import {
  Post,
  Body,
  Controller,
  Res,
  Delete,
  UseGuards,
  Param,
  ParseIntPipe,
  Get,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { Role } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { Roles } from './decorator/roles.decorator';
import { RolesGuard } from './guard/roles.guard';

@Controller('auth')
export class AuthController {


  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  register(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      role: Role;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body.email, body.password);

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: false, // true kalau https
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return {
      message: 'login berhasil',
      data: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return {
      message: 'berhasil keluar',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return this.authService.findById(req.user.id);
  }

  @Delete(':id')
  @Roles(Role.DIREKTUR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.authService.deleteUser(id, req.user);
  }
}
