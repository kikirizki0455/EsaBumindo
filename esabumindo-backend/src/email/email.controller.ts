import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmailService } from './email.service';
import { SendContactEmailDto } from './dto/send-contact-email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('contact')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async sendContactEmail(@Body() data: SendContactEmailDto) {
    try {
      // Send email
      await this.emailService.sendContactMessage(data);

      return {
        success: true,
        message: 'Pesan berhasil dikirim',
      };
    } catch (error) {
      console.error('❌ Email sending error:', error);

      // If it's already an HttpException, throw it as is
      if (error instanceof HttpException) {
        throw error;
      }

      // Otherwise, throw a 500 error
      throw new HttpException(
        {
          success: false,
          message: `Gagal mengirim pesan: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
