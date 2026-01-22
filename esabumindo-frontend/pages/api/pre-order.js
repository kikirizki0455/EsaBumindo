import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Format data untuk email ke admin
const formatPreOrderEmailForAdmin = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #0c439a 0%, #ca161e 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .section { margin: 20px 0; padding: 20px; border-bottom: 1px solid #eee; }
        .section-title { color: #0c439a; font-weight: bold; font-size: 16px; border-bottom: 2px solid #ca161e; padding-bottom: 10px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px; }
        .label { font-weight: bold; background: #f5f5f5; width: 35%; }
        .value { background: #fafafa; }
        .badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .badge-email { background: #e3f2fd; color: #0c439a; }
        .badge-whatsapp { background: #e8f5e9; color: #25d366; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .contact-link { color: #0c439a; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 PRE-ORDER BARU</h1>
          <p>Ada pelanggan baru yang ingin memesan produk Anda</p>
        </div>

        <div class="section">
          <div class="section-title">📦 INFORMASI PRODUK</div>
          <table>
            <tr>
              <td class="label">Nama Produk:</td>
              <td class="value"><strong>${data.product}</strong></td>
            </tr>
            <tr>
              <td class="label">ID Produk:</td>
              <td class="value">${data.productId}</td>
            </tr>
            <tr>
              <td class="label">Jumlah Pesanan:</td>
              <td class="value"><strong>${
                data.quantity
              } unit/karton</strong></td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">👤 INFORMASI PELANGGAN</div>
          <table>
            <tr>
              <td class="label">Nama Lengkap:</td>
              <td class="value">${data.customerName}</td>
            </tr>
            <tr>
              <td class="label">Email:</td>
              <td class="value"><a href="mailto:${
                data.customerEmail
              }" class="contact-link">${data.customerEmail}</a></td>
            </tr>
            <tr>
              <td class="label">WhatsApp:</td>
              <td class="value"><a href="https://wa.me/${data.customerPhone.replace(
                /\D/g,
                ""
              )}" class="contact-link">${data.customerPhone}</a></td>
            </tr>
            <tr>
              <td class="label">Perusahaan:</td>
              <td class="value">${data.company}</td>
            </tr>
            <tr>
              <td class="label">Industri/Sektor:</td>
              <td class="value">${data.industri || "Tidak disebutkan"}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">📝 CATATAN PELANGGAN</div>
          <div style="background: #fafafa; padding: 15px; border-left: 4px solid #ca161e; border-radius: 4px;">
            ${data.message || "<em>Tidak ada catatan tambahan</em>"}
          </div>
        </div>

        <div class="section">
          <div class="section-title">📞 PREFERENSI KONTAK</div>
          <p>Pelanggan lebih suka dihubungi melalui:</p>
          <p>
            <span class="badge ${
              data.contactMethod === "email" ? "badge-email" : "badge-whatsapp"
            }">
              ${data.contactMethod === "email" ? "✉️ EMAIL" : "💬 WHATSAPP"}
            </span>
          </p>
        </div>

        <div class="footer">
          <p><strong>Waktu Pesanan:</strong> ${new Date(
            data.timestamp
          ).toLocaleString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            timeZone: "Asia/Jakarta",
          })}</p>
          <p style="margin-top: 15px; color: #999;">ID Pesanan: ${Date.now()}</p>
          <p style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 15px;">
            © ESABUMINDO - Chemical Adhesive Solutions<br>
            Sistem Pre-Order Otomatis
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Format data untuk email konfirmasi ke customer
const formatPreOrderEmailForCustomer = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #0c439a 0%, #ca161e 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .section { margin: 20px 0; padding: 20px; border-bottom: 1px solid #eee; }
        .section-title { color: #0c439a; font-weight: bold; font-size: 16px; border-bottom: 2px solid #ca161e; padding-bottom: 10px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px; }
        .label { font-weight: bold; background: #f5f5f5; width: 35%; }
        .value { background: #fafafa; }
        .success-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .info-box { background: #e3f2fd; border-left: 4px solid #0c439a; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ PRE-ORDER DITERIMA</h1>
          <p>Terima kasih telah mempercayai ESABUMINDO!</p>
        </div>

        <div class="section">
          <div class="success-box">
            <h2 style="color: #4caf50; margin: 0;">Pre-Order Anda Telah Berhasil Diterima</h2>
            <p style="margin: 10px 0 0 0; color: #666;">Tim kami akan menghubungi Anda dalam waktu 24 jam</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">📦 RINGKASAN PESANAN</div>
          <table>
            <tr>
              <td class="label">Produk:</td>
              <td class="value"><strong>${data.product}</strong></td>
            </tr>
            <tr>
              <td class="label">Jumlah:</td>
              <td class="value"><strong>${
                data.quantity
              } unit/karton</strong></td>
            </tr>
            <tr>
              <td class="label">Perusahaan:</td>
              <td class="value">${data.company}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="section-title">👤 DATA PRIBADI</div>
          <table>
            <tr>
              <td class="label">Nama:</td>
              <td class="value">${data.customerName}</td>
            </tr>
            <tr>
              <td class="label">Email:</td>
              <td class="value">${data.customerEmail}</td>
            </tr>
            <tr>
              <td class="label">WhatsApp:</td>
              <td class="value">${data.customerPhone}</td>
            </tr>
          </table>
        </div>

        <div class="section">
          <div class="info-box">
            <strong>📞 Cara Kami Akan Menghubungi Anda:</strong>
            <p style="margin: 10px 0 0 0;">
              Kami akan menghubungi melalui <strong>${
                data.contactMethod === "email" ? "Email" : "WhatsApp"
              }</strong> yang Anda pilih untuk mendiskusikan detail pesanan dan penawaran terbaik.
            </p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">📋 LANGKAH SELANJUTNYA</div>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li>Tim kami akan meninjau pesanan Anda</li>
            <li>Kami akan menghubungi Anda dengan penawaran harga terbaik</li>
            <li>Diskusikan detail pesanan dan jadwal pengiriman</li>
            <li>Konfirmasi pesanan dan lakukan pembayaran</li>
            <li>Proses produksi dan pengiriman dimulai</li>
          </ol>
        </div>

        <div class="section">
          <div class="section-title">❓ PERTANYAAN?</div>
          <p>Jika ada pertanyaan, jangan ragu untuk menghubungi kami:</p>
          <p>📧 Email: <strong>kikirizki0455@gmail.com</strong></p>
          <p>💬 WhatsApp: <strong>082146024328</strong></p>
        </div>

        <div class="footer">
          <p><strong>Tanggal Pesanan:</strong> ${new Date(
            data.timestamp
          ).toLocaleString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Jakarta",
          })}</p>
          <p style="margin-top: 10px; color: #999;">ID Pesanan: <strong>${Date.now()}</strong></p>
          <p style="margin-top: 15px; border-top: 1px solid #ddd; padding-top: 15px;">
            © ESABUMINDO - Chemical Adhesive Solutions<br>
            <em>Solusi Adhesive Terpercaya untuk Industri Indonesia</em>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Format data untuk WhatsApp
const formatPreOrderDataForWhatsApp = (data) => {
  const timestamp = new Date(data.timestamp).toLocaleString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });

  return `Halo ${data.customerName.split(" ")[0]} 👋

*PRE-ORDER BARU DARI WEBSITE*

═══════════════════════════════

*📦 INFORMASI PRODUK*
Produk: ${data.product}
Jumlah: ${data.quantity} unit/karton

*👤 INFORMASI PELANGGAN*
Nama: ${data.customerName}
Email: ${data.customerEmail}
Perusahaan: ${data.company}
Industri: ${data.industri || "Tidak disebutkan"}

*📝 CATATAN PELANGGAN*
"${data.message || "Tidak ada catatan tambahan"}"

*📞 PREFERENSI KONTAK*
${
  data.contactMethod === "email"
    ? "✉️ Hubungi via Email"
    : "💬 Hubungi via WhatsApp"
}

═══════════════════════════════
⏰ ${timestamp}
ID: ${Date.now()}

Silakan hubungi pelanggan untuk diskusi lebih lanjut.`;
};

// Send WhatsApp message function
const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    // Method 1: Menggunakan WhatsApp Business API via axios (jika sudah terintegrasi)
    // Method 2: Menggunakan service seperti Fonnte atau Twilio

    // Untuk sekarang, kita log saja atau bisa gunakan webhook
    const response = await fetch(
      process.env.WHATSAPP_WEBHOOK_URL ||
        "http://localhost:3001/api/whatsapp/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          message: message,
        }),
      }
    );

    if (response.ok) {
      console.log("WhatsApp message sent successfully");
      return true;
    } else {
      console.log("WhatsApp message sending failed, but email was sent");
      return false;
    }
  } catch (error) {
    console.log(
      "WhatsApp service not available, but email notification was sent:",
      error.message
    );
    return false;
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = req.body;

    // Validasi data
    if (
      !data.customerName ||
      !data.customerEmail ||
      !data.customerPhone ||
      !data.company ||
      !data.product ||
      !data.quantity
    ) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap",
        required: [
          "customerName",
          "customerEmail",
          "customerPhone",
          "company",
          "product",
          "quantity",
        ],
      });
    }

    const orderId = Date.now();

    // ========== EMAIL HANDLING ==========

    // Send email to admin (kikirizki0455@gmail.com)
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "noreply@esabumindo.com",
      to: "kikirizki0455@gmail.com", // Email admin tetap
      subject: `🔔 Pre-Order Baru: ${data.product} - ${data.customerName}`,
      html: formatPreOrderEmailForAdmin(data),
      replyTo: data.customerEmail,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER || "noreply@esabumindo.com",
      to: data.customerEmail,
      subject: "✅ Pre-Order Anda Telah Diterima - ESABUMINDO",
      html: formatPreOrderEmailForCustomer(data),
    });

    // ========== WHATSAPP HANDLING ==========
    let whatsappSent = false;

    if (data.contactMethod === "whatsapp") {
      const whatsappMessage = formatPreOrderDataForWhatsApp(data);

      // Send to admin WhatsApp (082146024328)
      whatsappSent = await sendWhatsAppMessage("082146024328", whatsappMessage);
    }

    return res.status(200).json({
      success: true,
      message: "Pre-order berhasil dikirim",
      orderId: orderId,
      emailSent: true,
      whatsappSent: whatsappSent || false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Pre-order error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengirim pre-order",
      error: error.message,
    });
  }
}
