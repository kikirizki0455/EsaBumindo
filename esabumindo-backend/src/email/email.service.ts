import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

interface EmailAttempt {
  email: string;
  timestamp: number;
  count: number;
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private emailAttempts: Map<string, EmailAttempt> = new Map();

  // Anti-spam configuration
  private readonly MAX_ATTEMPTS = 3;
  private readonly TIME_WINDOW = 60 * 60 * 1000; // 1 hour
  private readonly CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes

  constructor(private configService: ConfigService) {
    // ✅ Get email config from ConfigService
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

    // Validate required environment variables
    if (!emailUser || !emailPassword) {
      console.error(
        '❌ ERROR: EMAIL_USER and EMAIL_PASSWORD must be defined in .env file',
      );
      throw new Error('EMAIL_USER and EMAIL_PASSWORD must be defined in .env');
    }

    console.log('✅ Email configuration loaded:');
    console.log(`   - EMAIL_USER: ${emailUser}`);
    console.log(
      `   - EMAIL_PASSWORD: ${emailPassword ? '***hidden***' : 'NOT SET'}`,
    );

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });

    // Verify transporter configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('❌ Email configuration error:', error);
      } else {
        console.log('✅ Email service ready to send messages');
      }
    });

    // Start cleanup interval
    setInterval(() => this.cleanupOldAttempts(), this.CLEANUP_INTERVAL);
  }

  /**
   * Check if email sender has exceeded rate limit
   */
  private checkRateLimit(email: string): void {
    const now = Date.now();
    const attempt = this.emailAttempts.get(email);

    if (!attempt) {
      this.emailAttempts.set(email, {
        email,
        timestamp: now,
        count: 1,
      });
      return;
    }

    const timeDiff = now - attempt.timestamp;

    if (timeDiff > this.TIME_WINDOW) {
      this.emailAttempts.set(email, {
        email,
        timestamp: now,
        count: 1,
      });
      return;
    }

    if (attempt.count >= this.MAX_ATTEMPTS) {
      const remainingTime = Math.ceil(
        (this.TIME_WINDOW - timeDiff) / 1000 / 60,
      );
      throw new HttpException(
        {
          success: false,
          message: `Terlalu banyak percobaan. Silakan coba lagi dalam ${remainingTime} menit.`,
          rateLimited: true,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    attempt.count += 1;
    this.emailAttempts.set(email, attempt);
  }

  /**
   * Cleanup old attempts from memory
   */
  private cleanupOldAttempts(): void {
    const now = Date.now();
    const toDelete: string[] = [];

    this.emailAttempts.forEach((attempt, email) => {
      if (now - attempt.timestamp > this.TIME_WINDOW) {
        toDelete.push(email);
      }
    });

    toDelete.forEach((email) => this.emailAttempts.delete(email));

    if (toDelete.length > 0) {
      console.log(`🧹 Cleaned up ${toDelete.length} old email attempts`);
    }
  }

  /**
   * Validate email content for spam patterns
   */
  private validateContent(data: {
    name: string;
    email: string;
    message: string;
  }): void {
    const spamKeywords = [
      'viagra',
      'cialis',
      'lottery',
      'winner',
      'click here',
      'buy now',
      'limited time',
      'act now',
      'casino',
      'poker',
      'pills',
      'weight loss',
      'earn money',
      'work from home',
    ];

    const content = `${data.name} ${data.message}`.toLowerCase();

    const hasSpam = spamKeywords.some((keyword) => content.includes(keyword));

    if (hasSpam) {
      throw new HttpException(
        {
          success: false,
          message:
            'Pesan terdeteksi sebagai spam. Silakan gunakan bahasa yang lebih formal.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urls = content.match(urlPattern);

    if (urls && urls.length > 3) {
      throw new HttpException(
        {
          success: false,
          message:
            'Terlalu banyak tautan dalam pesan. Silakan kurangi jumlah URL.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async sendContactMessage(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<void> {
    try {
      // Anti-spam checks
      this.checkRateLimit(data.email);
      this.validateContent(data);

      const emailUser = this.configService.get<string>('EMAIL_USER');
      const adminEmail =
        this.configService.get<string>('EMAIL_ADMIN') || emailUser;

      if (!adminEmail) {
        throw new Error('No admin email configured');
      }

      // Send email to admin
      await this.transporter.sendMail({
        from: `"Website Esa Bumindo" <${emailUser}>`,
        to: adminEmail,
        replyTo: data.email,
        subject: `Pesan Kontak Baru - ${data.name}`,
        html: this.getHtmlTemplate(data),
      });

      console.log(`✅ Email sent successfully to admin: ${adminEmail}`);

      // Send confirmation email to user
      try {
        await this.transporter.sendMail({
          from: `"Esa Bumindo" <${emailUser}>`,
          to: data.email,
          subject: 'Konfirmasi - Pesan Anda Telah Diterima',
          html: this.getConfirmationTemplate(data),
        });
        console.log(`✅ Confirmation email sent to user: ${data.email}`);
      } catch (confirmError) {
        console.warn(
          '⚠️ Failed to send confirmation email:',
          confirmError.message,
        );
      }
    } catch (error) {
      console.error('❌ Email service error:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: `Gagal mengirim email: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getHtmlTemplate(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): string {
    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesan Kontak Baru</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 10px; letter-spacing: 1px; }
        .content { padding: 40px 30px; }
        .info-section { background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin-bottom: 30px; border-radius: 4px; }
        .info-row { margin-bottom: 15px; }
        .info-label { color: #667eea; font-weight: 600; font-size: 12px; text-transform: uppercase; }
        .info-value { color: #555; font-size: 14px; margin-top: 5px; }
        .message-section { background: #fff9e6; border-left: 4px solid #ffc107; padding: 20px; margin-bottom: 30px; border-radius: 4px; }
        .message-content { color: #555; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🧴 ESA BUMINDO</div>
            <div>Solusi Adhesive Berkualitas Tinggi</div>
        </div>
        <div class="content">
            <h2>Pesan Baru dari Website</h2>
            <div class="info-section">
                <div class="info-row">
                    <div class="info-label">👤 Nama</div>
                    <div class="info-value">${data.name}</div>
                </div>
                <div class="info-row">
                    <div class="info-label">✉️ Email</div>
                    <div class="info-value"><a href="mailto:${data.email}">${data.email}</a></div>
                </div>
                ${data.phone ? `<div class="info-row"><div class="info-label">📞 Telepon</div><div class="info-value">${data.phone}</div></div>` : ''}
            </div>
            <div class="message-section">
                <div class="info-label">📝 Pesan</div>
                <div class="message-content">${data.message}</div>
            </div>
        </div>
        <div class="footer">
            <strong>ESA BUMINDO</strong><br>
            © ${new Date().getFullYear()} Esa Bumindo. Semua hak dilindungi.
        </div>
    </div>
</body>
</html>`;
  }

  private getConfirmationTemplate(data: { name: string }): string {
    return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Konfirmasi Pesan</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); }
        .header { background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); padding: 40px 20px; text-align: center; color: white; }
        .content { padding: 40px 30px; }
        .success-box { background: #e8f5e9; border: 2px solid #4caf50; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="font-size: 28px; font-weight: bold;">🧴 ESA BUMINDO</div>
        </div>
        <div class="content">
            <h2>Halo ${data.name},</h2>
            <div class="success-box">
                <div style="font-size: 40px; color: #4caf50;">✓</div>
                <div style="color: #2e7d32; font-size: 16px; font-weight: 600;">Pesan Anda Telah Berhasil Diterima!</div>
            </div>
            <p>Terima kasih telah menghubungi kami. Tim kami akan segera merespon dalam waktu 1-2 jam kerja.</p>
        </div>
        <div class="footer">
            <strong>ESA BUMINDO</strong><br>
            © ${new Date().getFullYear()} Esa Bumindo. Semua hak dilindungi.
        </div>
    </div>
</body>
</html>`;
  }
}
