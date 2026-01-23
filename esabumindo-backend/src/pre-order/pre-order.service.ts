import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreatePreOrderDto } from './dto/create-pre-order.dto';
import { WhatsAppService } from './whatsapp.service';
import * as nodemailer from 'nodemailer';

interface RateLimitAttempt {
  email: string;
  timestamp: number;
  count: number;
}

@Injectable()
export class PreOrderService {
  private transporter: nodemailer.Transporter;
  private preOrderAttempts: Map<string, RateLimitAttempt> = new Map();

  private readonly MAX_ATTEMPTS = 5; // 5 pre-orders per hour
  private readonly TIME_WINDOW = 60 * 60 * 1000; // 1 hour

  constructor(
    private configService: ConfigService,
    private whatsappService: WhatsAppService,
  ) {
    const emailUser = this.configService.get<string>('EMAIL_USER');
    const emailPassword = this.configService.get<string>('EMAIL_PASSWORD');

    if (emailUser && emailPassword) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      });
      console.log('✅ Pre-order email service initialized');
    }
  }

  /**
   * Check rate limit for pre-orders
   */
  private checkRateLimit(email: string): void {
    const now = Date.now();
    const attempt = this.preOrderAttempts.get(email);

    if (!attempt) {
      this.preOrderAttempts.set(email, { email, timestamp: now, count: 1 });
      return;
    }

    const timeDiff = now - attempt.timestamp;

    if (timeDiff > this.TIME_WINDOW) {
      this.preOrderAttempts.set(email, { email, timestamp: now, count: 1 });
      return;
    }

    if (attempt.count >= this.MAX_ATTEMPTS) {
      const remainingTime = Math.ceil(
        (this.TIME_WINDOW - timeDiff) / 1000 / 60,
      );
      throw new HttpException(
        {
          success: false,
          message: `Terlalu banyak pre-order. Coba lagi dalam ${remainingTime} menit.`,
          rateLimited: true,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    attempt.count += 1;
    this.preOrderAttempts.set(email, attempt);
  }

  /**
   * Create pre-order
   */
  async createPreOrder(dto: CreatePreOrderDto) {
    try {
      // Check rate limit
      this.checkRateLimit(dto.customerEmail);

      // Validate sample quantity
      if (dto.orderType === 'sample' && dto.quantityKg > 100) {
        throw new HttpException(
          {
            success: false,
            message: 'Jumlah sample maksimal 100 kg',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const orderId = Date.now();
      const orderData = {
        ...dto,
        orderId,
        timestamp: new Date().toISOString(),
      };

      // Send email notifications
      let emailSent = false;
      try {
        if (this.transporter) {
          await this.sendEmailNotifications(orderData);
          emailSent = true;
        }
      } catch (emailError) {
        console.error('Email error:', emailError.message);
      }

      // Send WhatsApp notification to admin
      let whatsappSent = false;
      try {
        const adminPhone = '082146024328'; // Your admin WhatsApp number
        const message =
          dto.orderType === 'sample'
            ? this.whatsappService.formatSampleOrderMessage(orderData)
            : this.whatsappService.formatDirectOrderMessage(orderData);

        whatsappSent = await this.whatsappService.sendMessage(
          adminPhone,
          message,
        );
      } catch (waError) {
        console.error('WhatsApp error:', waError.message);
      }

      return {
        success: true,
        message: `${dto.orderType === 'sample' ? 'Permintaan sample' : 'Pesanan langsung'} berhasil dikirim`,
        orderId,
        orderType: dto.orderType,
        emailSent,
        whatsappSent,
        timestamp: orderData.timestamp,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `Gagal memproses pre-order: ${error.message}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Send email notifications (admin + customer)
   */
  private async sendEmailNotifications(data: any) {
    const adminEmail =
      this.configService.get<string>('EMAIL_ADMIN') ||
      this.configService.get<string>('EMAIL_USER');

    // Send to admin
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: adminEmail,
      subject: `${data.orderType === 'sample' ? '🧪 Permintaan Sample' : '🔔 Pre-Order Langsung'}: ${data.product}`,
      html:
        data.orderType === 'sample'
          ? this.getSampleEmailTemplate(data)
          : this.getDirectOrderEmailTemplate(data),
    });

    // Send confirmation to customer
    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: data.customerEmail,
      subject: `✅ ${data.orderType === 'sample' ? 'Permintaan Sample' : 'Pesanan Langsung'} Diterima - ESABUMINDO`,
      html: this.getCustomerConfirmationTemplate(data),
    });

    console.log(`✅ Emails sent for order ${data.orderId}`);
  }

  private getDirectOrderEmailTemplate(data: any): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
body{font-family:Arial,sans-serif;color:#333}.container{max-width:600px;margin:0 auto}
.header{background:linear-gradient(135deg,#0c439a 0%,#ca161e 100%);color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0}
.section{margin:20px 0;padding:20px;border-bottom:1px solid #eee}
.section-title{color:#0c439a;font-weight:bold;font-size:16px;border-bottom:2px solid #ca161e;padding-bottom:10px;margin-bottom:15px}
table{width:100%;border-collapse:collapse}td{padding:10px}
.label{font-weight:bold;background:#f5f5f5;width:35%}.value{background:#fafafa}
.footer{background:#f5f5f5;padding:20px;text-align:center;font-size:12px;color:#666}
</style></head>
<body><div class="container">
<div class="header"><h1>🔔 PRE-ORDER LANGSUNG</h1><p>Pesanan baru dari ${data.customerName}</p></div>
<div class="section"><div class="section-title">📦 INFORMASI PRODUK</div><table>
<tr><td class="label">Produk:</td><td class="value"><strong>${data.product}</strong></td></tr>
<tr><td class="label">Jumlah:</td><td class="value"><strong>${data.quantityKg} kg</strong></td></tr>
<tr><td class="label">Kemasan:</td><td class="value">${data.packaging}</td></tr>
</table></div>
<div class="section"><div class="section-title">👤 INFORMASI PELANGGAN</div><table>
<tr><td class="label">Nama:</td><td class="value">${data.customerName}</td></tr>
<tr><td class="label">Email:</td><td class="value"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td></tr>
<tr><td class="label">WhatsApp:</td><td class="value"><a href="https://wa.me/${data.customerPhone.replace(/\D/g, '')}">${data.customerPhone}</a></td></tr>
<tr><td class="label">Perusahaan:</td><td class="value">${data.company}</td></tr>
<tr><td class="label">Industri:</td><td class="value">${data.industri || '-'}</td></tr>
</table></div>
<div class="section"><div class="section-title">📝 CATATAN</div><p>${data.message || 'Tidak ada catatan'}</p></div>
<div class="footer">ID: ${data.orderId} | ${new Date(data.timestamp).toLocaleString('id-ID')}</div>
</div></body></html>`;
  }

  private getSampleEmailTemplate(data: any): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
body{font-family:Arial,sans-serif;color:#333}.container{max-width:600px;margin:0 auto}
.header{background:linear-gradient(135deg,#ca161e 0%,#8b0000 100%);color:white;padding:30px;text-align:center;border-radius:8px 8px 0 0}
.section{margin:20px 0;padding:20px;border-bottom:1px solid #eee}
.section-title{color:#ca161e;font-weight:bold;font-size:16px;border-bottom:2px solid #ca161e;padding-bottom:10px;margin-bottom:15px}
table{width:100%;border-collapse:collapse}td{padding:10px}
.label{font-weight:bold;background:#f5f5f5;width:35%}.value{background:#fafafa}
.footer{background:#f5f5f5;padding:20px;text-align:center;font-size:12px;color:#666}
</style></head>
<body><div class="container">
<div class="header"><h1>🧪 PERMINTAAN SAMPLE</h1><p>Permintaan sample dari ${data.customerName}</p></div>
<div class="section"><div class="section-title">🧴 INFORMASI SAMPLE</div><table>
<tr><td class="label">Produk:</td><td class="value"><strong>${data.product}</strong></td></tr>
<tr><td class="label">Jumlah:</td><td class="value"><strong>${data.quantityKg} kg</strong></td></tr>
<tr><td class="label">Kemasan:</td><td class="value">${data.packaging}</td></tr>
</table></div>
<div class="section"><div class="section-title">👤 INFORMASI PELANGGAN</div><table>
<tr><td class="label">Nama:</td><td class="value">${data.customerName}</td></tr>
<tr><td class="label">Email:</td><td class="value"><a href="mailto:${data.customerEmail}">${data.customerEmail}</a></td></tr>
<tr><td class="label">WhatsApp:</td><td class="value"><a href="https://wa.me/${data.customerPhone.replace(/\D/g, '')}">${data.customerPhone}</a></td></tr>
<tr><td class="label">Perusahaan:</td><td class="value">${data.company}</td></tr>
<tr><td class="label">Industri:</td><td class="value">${data.industri || '-'}</td></tr>
</table></div>
<div class="section"><div class="section-title">📝 CATATAN</div><p>${data.message || 'Tidak ada catatan'}</p></div>
<div class="footer">ID: ${data.orderId} | ${new Date(data.timestamp).toLocaleString('id-ID')}</div>
</div></body></html>`;
  }

  private getCustomerConfirmationTemplate(data: any): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
body{font-family:Arial,sans-serif;color:#333}.container{max-width:600px;margin:0 auto}
.header{background:linear-gradient(135deg,#4caf50 0%,#45a049 100%);color:white;padding:40px 20px;text-align:center}
.content{padding:40px 30px}.success-box{background:#e8f5e9;border:2px solid #4caf50;border-radius:8px;padding:20px;text-align:center;margin:30px 0}
.footer{background:#f5f5f5;padding:20px;text-align:center;font-size:12px;color:#666}
</style></head>
<body><div class="container">
<div class="header"><h1>✅ ${data.orderType === 'sample' ? 'PERMINTAAN SAMPLE DITERIMA' : 'PESANAN DITERIMA'}</h1></div>
<div class="content">
<div class="success-box"><div style="font-size:40px;color:#4caf50">✓</div>
<div style="color:#2e7d32;font-size:16px;font-weight:600">Pesanan Anda Berhasil Diterima!</div></div>
<p>Halo <strong>${data.customerName}</strong>,</p>
<p>Terima kasih telah ${data.orderType === 'sample' ? 'mengambil sample' : 'melakukan pre-order'} produk <strong>${data.product}</strong>.</p>
<p>Tim kami akan menghubungi Anda melalui <strong>${data.contactMethod === 'email' ? 'Email' : 'WhatsApp'}</strong> dalam 1x24 jam.</p>
<p><strong>Detail Pesanan:</strong><br>
Produk: ${data.product}<br>
Jumlah: ${data.quantityKg} kg<br>
ID Pesanan: ${data.orderId}</p>
</div>
<div class="footer">© ESABUMINDO - Chemical Adhesive Solutions</div>
</div></body></html>`;
  }
}
