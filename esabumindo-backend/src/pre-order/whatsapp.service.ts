import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WhatsAppService {
  private readonly apiKey: string | undefined;
  private readonly apiUrl: string = 'https://api.fonnte.com/send';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('WHATSAPP_API_KEY');

    if (!this.apiKey) {
      console.warn(
        '⚠️ WHATSAPP_API_KEY not configured - WhatsApp notifications will be disabled',
      );
    } else {
      console.log('✅ WhatsApp service initialized with Fonnte API');
    }
  }

  /**
   * Send WhatsApp message via Fonnte API
   */
  async sendMessage(phoneNumber: string, message: string): Promise<boolean> {
    if (!this.apiKey) {
      console.warn(
        '⚠️ WhatsApp API key not configured, skipping WhatsApp send',
      );
      return false;
    }

    try {
      // Format phone number (remove +, spaces, dashes)
      const formattedPhone = phoneNumber.replace(/[\s\-\+]/g, '');

      // Ensure it starts with country code (62 for Indonesia)
      const finalPhone = formattedPhone.startsWith('0')
        ? `62${formattedPhone.substring(1)}`
        : formattedPhone;

      console.log(`📱 Sending WhatsApp to: ${finalPhone}`);

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: finalPhone,
          message: message,
          delay: 1000,
          countryCode: '62',
        }),
      });

      const result = await response.json();

      if (result.status === true || result.status === 'success') {
        console.log('✅ WhatsApp sent successfully via Fonnte');
        return true;
      } else {
        console.error('❌ Fonnte API error:', result.reason || result.message);
        return false;
      }
    } catch (error) {
      console.error('❌ WhatsApp sending error:', error.message);
      return false;
    }
  }

  /**
   * Format pre-order data for WhatsApp message (Direct Order)
   */
  formatDirectOrderMessage(data: any): string {
    const timestamp = new Date().toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });

    return `Halo ${data.customerName.split(' ')[0]} 👋

*PRE-ORDER LANGSUNG DARI WEBSITE*

═══════════════════════════════

*📦 INFORMASI PESANAN*
Produk: ${data.product}
Jumlah: ${data.quantityKg} kg
Kemasan: ${data.packaging}

*👤 INFORMASI PELANGGAN*
Nama: ${data.customerName}
Email: ${data.customerEmail}
Perusahaan: ${data.company}
Industri: ${data.industri || 'Tidak disebutkan'}

*📝 CATATAN PELANGGAN*
"${data.message || 'Tidak ada catatan tambahan'}"

*📞 PREFERENSI KONTAK*
${data.contactMethod === 'email' ? '✉️ Hubungi via Email' : '💬 Hubungi via WhatsApp'}

═══════════════════════════════
⏰ ${timestamp}
ID: ${Date.now()}

🎯 ACTION: Hubungi untuk diskusi harga, stok, dan jadwal pengiriman.`;
  }

  /**
   * Format pre-order data for WhatsApp message (Sample Order)
   */
  formatSampleOrderMessage(data: any): string {
    const timestamp = new Date().toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });

    return `Halo ${data.customerName.split(' ')[0]} 👋

*PERMINTAAN SAMPLE PRODUK DARI WEBSITE*

═══════════════════════════════

*🧪 INFORMASI SAMPLE*
Produk: ${data.product}
Jumlah: ${data.quantityKg} kg
Kemasan: ${data.packaging}

*👤 INFORMASI PELANGGAN*
Nama: ${data.customerName}
Email: ${data.customerEmail}
Perusahaan: ${data.company}
Industri: ${data.industri || 'Tidak disebutkan'}

*📝 CATATAN PELANGGAN*
"${data.message || 'Tidak ada catatan tambahan'}"

*📞 PREFERENSI KONTAK*
${data.contactMethod === 'email' ? '✉️ Hubungi via Email' : '💬 Hubungi via WhatsApp'}

═══════════════════════════════
⏰ ${timestamp}
ID: ${Date.now()}

⚠️ CATATAN: Ini adalah permintaan SAMPLE untuk testing. Prospek potensial untuk pesanan besar.
Pastikan memberikan service terbaik dan follow-up dengan baik.`;
  }
}
