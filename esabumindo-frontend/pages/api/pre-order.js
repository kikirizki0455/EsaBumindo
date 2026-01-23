import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Format data untuk email ke admin (DIRECT ORDER)
const formatPreOrderEmailForAdminDirectOrder = (data) => {
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
        .badge-direct { background: #e3f2fd; color: #0c439a; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .contact-link { color: #0c439a; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 PRE-ORDER LANGSUNG (DIRECT ORDER)</h1>
          <p>Ada pelanggan baru yang ingin melakukan pesanan langsung</p>
        </div>

        <div class="section">
          <div class="section-title">📦 INFORMASI PRODUK & PESANAN</div>
          <table>
            <tr>
              <td class="label">Tipe Pesanan:</td>
              <td class="value"><strong><span class="badge badge-direct">✓ DIRECT ORDER</span></strong></td>
            </tr>
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
              <td class="value"><strong>${data.quantityKg} kg</strong></td>
            </tr>
            <tr>
              <td class="label">Kemasan:</td>
              <td class="value">${data.packaging}</td>
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

        <div class="section">
          <div class="section-title">⚡ ACTION REQUIRED</div>
          <p style="color: #ca161e; font-weight: bold;">Hubungi pelanggan segera untuk:</p>
          <ul style="padding-left: 20px;">
            <li>Konfirmasi ketersediaan stok</li>
            <li>Diskusikan harga berdasarkan volume</li>
            <li>Tentukan jadwal pengiriman</li>
            <li>Proses pembayaran</li>
          </ul>
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

// Format data untuk email ke admin (SAMPLE)
const formatPreOrderEmailForAdminSample = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #ca161e 0%, #8b0000 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .section { margin: 20px 0; padding: 20px; border-bottom: 1px solid #eee; }
        .section-title { color: #ca161e; font-weight: bold; font-size: 16px; border-bottom: 2px solid #ca161e; padding-bottom: 10px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px; }
        .label { font-weight: bold; background: #f5f5f5; width: 35%; }
        .value { background: #fafafa; }
        .badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .badge-sample { background: #ffe0e0; color: #ca161e; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
        .contact-link { color: #ca161e; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🧪 PERMINTAAN SAMPLE PRODUK</h1>
          <p>Ada pelanggan yang ingin mengambil sample untuk testing</p>
        </div>

        <div class="section">
          <div class="section-title">🧴 INFORMASI PRODUK & SAMPLE</div>
          <table>
            <tr>
              <td class="label">Tipe Pesanan:</td>
              <td class="value"><strong><span class="badge badge-sample">🧪 SAMPLE TEST</span></strong></td>
            </tr>
            <tr>
              <td class="label">Nama Produk:</td>
              <td class="value"><strong>${data.product}</strong></td>
            </tr>
            <tr>
              <td class="label">ID Produk:</td>
              <td class="value">${data.productId}</td>
            </tr>
            <tr>
              <td class="label">Jumlah Sample:</td>
              <td class="value"><strong>${
                data.quantityKg
              } kg (Max: 100 kg)</strong></td>
            </tr>
            <tr>
              <td class="label">Kemasan:</td>
              <td class="value">${data.packaging}</td>
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

        <div class="section">
          <div class="section-title">⚡ CATATAN PENTING</div>
          <p style="background: #fff3cd; padding: 10px; border-left: 4px solid #ffc107; border-radius: 4px; color: #856404;">
            <strong>🎯 SALES OPPORTUNITY:</strong><br>
            Ini adalah prospek yang ingin mencoba produk Anda. Jika sample cocok dengan kebutuhan, pelanggan ini potensial melakukan pesanan dalam jumlah besar. 
            Pastikan memberikan service terbaik dan follow-up dengan baik.
          </p>
        </div>

        <div class="footer">
          <p><strong>Waktu Permintaan:</strong> ${new Date(
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

// Format data untuk email konfirmasi ke customer (DIRECT ORDER)
const formatPreOrderEmailForCustomerDirectOrder = (data) => {
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
          <h1>✅ PESANAN LANGSUNG DITERIMA</h1>
          <p>Terima kasih telah mempercayai ESABUMINDO!</p>
        </div>

        <div class="section">
          <div class="success-box">
            <h2 style="color: #4caf50; margin: 0;">Pesanan Langsung Anda Telah Berhasil Diterima</h2>
            <p style="margin: 10px 0 0 0; color: #666;">Tim sales kami akan menghubungi Anda dalam waktu maksimal 24 jam untuk diskusi lebih lanjut</p>
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
              <td class="value"><strong>${data.quantityKg} kg</strong></td>
            </tr>
            <tr>
              <td class="label">Kemasan:</td>
              <td class="value">${data.packaging}</td>
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
              }</strong> yang Anda pilih untuk:
            </p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Konfirmasi ketersediaan stok</li>
              <li>Penawaran harga terbaik berdasarkan volume</li>
              <li>Diskusikan detail dan jadwal pengiriman</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="section-title">📋 LANGKAH SELANJUTNYA</div>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li>Tim kami akan meninjau pesanan Anda</li>
            <li>Kami akan menghubungi dengan penawaran harga terbaik</li>
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

// Format data untuk email konfirmasi ke customer (SAMPLE)
const formatPreOrderEmailForCustomerSample = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #ca161e 0%, #8b0000 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .section { margin: 20px 0; padding: 20px; border-bottom: 1px solid #eee; }
        .section-title { color: #ca161e; font-weight: bold; font-size: 16px; border-bottom: 2px solid #ca161e; padding-bottom: 10px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 10px; }
        .label { font-weight: bold; background: #f5f5f5; width: 35%; }
        .value { background: #fafafa; }
        .success-box { background: #ffe0e0; border-left: 4px solid #ca161e; padding: 20px; border-radius: 4px; margin: 20px 0; }
        .info-box { background: #e3f2fd; border-left: 4px solid #0c439a; padding: 15px; border-radius: 4px; margin: 15px 0; }
        .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ PERMINTAAN SAMPLE DITERIMA</h1>
          <p>Kami siap memberikan sample terbaik untuk Anda!</p>
        </div>

        <div class="section">
          <div class="success-box">
            <h2 style="color: #ca161e; margin: 0;">Permintaan Sample Anda Telah Berhasil Diterima</h2>
            <p style="margin: 10px 0 0 0; color: #666;">Tim kami akan menghubungi Anda dalam waktu maksimal 24 jam untuk mengatur pengiriman sample</p>
          </div>
        </div>

        <div class="section">
          <div class="section-title">🧪 RINGKASAN PERMINTAAN SAMPLE</div>
          <table>
            <tr>
              <td class="label">Produk:</td>
              <td class="value"><strong>${data.product}</strong></td>
            </tr>
            <tr>
              <td class="label">Jumlah Sample:</td>
              <td class="value"><strong>${data.quantityKg} kg</strong></td>
            </tr>
            <tr>
              <td class="label">Kemasan:</td>
              <td class="value">${data.packaging}</td>
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
              }</strong> untuk mengatur:
            </p>
            <ul style="margin: 10px 0 0 0; padding-left: 20px;">
              <li>Jadwal pengiriman sample</li>
              <li>Cara penerimaan sample</li>
              <li>Konsultasi teknis penggunaan produk</li>
            </ul>
          </div>
        </div>

        <div class="section">
          <div class="section-title">🎯 TIPS PENGGUNAAN SAMPLE</div>
          <ul style="padding-left: 20px; line-height: 1.8;">
            <li>Pastikan permukaan yang akan direkat bersih dan kering</li>
            <li>Ikuti instruksi aplikasi yang ada di packaging</li>
            <li>Lakukan test pada area kecil terlebih dahulu</li>
            <li>Jika ada pertanyaan teknis, hubungi tim kami</li>
          </ul>
        </div>

        <div class="section">
          <div class="section-title">📋 LANGKAH SELANJUTNYA</div>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li>Kami akan menghubungi untuk mengatur pengiriman</li>
            <li>Terima dan coba sample</li>
            <li>Berikan feedback hasil testing</li>
            <li>Jika cocok, kami siap melayani pesanan dalam jumlah besar</li>
          </ol>
        </div>

        <div class="section">
          <div class="section-title">❓ PERTANYAAN?</div>
          <p>Hubungi kami untuk konsultasi teknis atau pertanyaan lainnya:</p>
          <p>📧 Email: <strong>kikirizki0455@gmail.com</strong></p>
          <p>💬 WhatsApp: <strong>082146024328</strong></p>
        </div>

        <div class="footer">
          <p><strong>Tanggal Permintaan:</strong> ${new Date(
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

  if (data.orderType === "sample") {
    return `Halo ${data.customerName.split(" ")[0]} 👋

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

⚠️ CATATAN: Ini adalah permintaan SAMPLE untuk testing. Prospek potensial untuk pesanan besar.
Pastikan memberikan service terbaik dan follow-up dengan baik.`;
  } else {
    return `Halo ${data.customerName.split(" ")[0]} 👋

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

🎯 ACTION: Hubungi untuk diskusi harga, stok, dan jadwal pengiriman.`;
  }
};

// Send WhatsApp message function
const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const response = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: process.env.NEXT_PUBLIC_WHATSAPP_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: phoneNumber, // Format: 6282146024328 (tanpa +)
        message: message,
        delay: 1000, // delay 1 detik
        countryCode: "62", // Indonesia
      }),
    });

    const result = await response.json();

    if (result.status === true) {
      console.log("✅ WhatsApp via Fonnte sent successfully");
      return true;
    } else {
      console.log("❌ Fonnte error:", result.reason);
      return false;
    }
  } catch (error) {
    console.error("WhatsApp Fonnte error:", error.message);
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
      !data.quantityKg ||
      !data.orderType
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
          "quantityKg",
          "orderType",
        ],
      });
    }

    // ========== RATE LIMITING CHECK ==========
    // Check rate limit status dari client
    if (data.rateLimitStatus && !data.rateLimitStatus.allowed) {
      return res.status(429).json({
        success: false,
        message: data.rateLimitStatus.message,
        rateLimited: true,
        retryAfter: data.rateLimitStatus.retryAfter,
        remaining: data.rateLimitStatus.remaining,
      });
    }

    // Validate sample order quantity
    if (
      data.orderType === "sample" &&
      (data.quantityKg < 1 || data.quantityKg > 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Jumlah sample harus antara 1-100 kg",
      });
    }

    // ========== FORWARD TO NESTJS BACKEND ==========
    console.log("📤 Forwarding pre-order to NestJS backend...");

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

    const response = await fetch(`${backendUrl}/pre-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderType: data.orderType,
        product: data.product,
        productId: data.productId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        company: data.company,
        industri: data.industri || "",
        quantityKg: parseFloat(data.quantityKg),
        packaging: data.packaging,
        message: data.message || "",
        contactMethod: data.contactMethod,
      }),
    });

    const result = await response.json();

    // ========== HANDLE BACKEND RESPONSE ==========
    if (!response.ok) {
      console.error("❌ Backend error:", result);
      return res.status(response.status).json(result);
    }

    console.log("✅ Pre-order processed successfully:", result);

    const orderId = Date.now();

    // ========== EMAIL HANDLING ==========
    let emailSent = false;
    let emailError = null;

    try {
      // Select appropriate email templates based on order type
      const adminEmailTemplate =
        data.orderType === "sample"
          ? formatPreOrderEmailForAdminSample(data)
          : formatPreOrderEmailForAdminDirectOrder(data);

      const customerEmailTemplate =
        data.orderType === "sample"
          ? formatPreOrderEmailForCustomerSample(data)
          : formatPreOrderEmailForCustomerDirectOrder(data);

      // Check if email credentials are configured
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.warn("Email credentials not configured, skipping email send");
        emailSent = false;
      } else {
        // Send email to admin
        await transporter.sendMail({
          from: process.env.EMAIL_USER || "noreply@esabumindo.com",
          to: "kikirizki0455@gmail.com",
          subject: `${
            data.orderType === "sample"
              ? "🧪 Permintaan Sample: "
              : "🔔 Pre-Order Langsung: "
          }${data.product} - ${data.customerName}`,
          html: adminEmailTemplate,
          replyTo: data.customerEmail,
        });

        // Send confirmation email to customer
        await transporter.sendMail({
          from: process.env.EMAIL_USER || "noreply@esabumindo.com",
          to: data.customerEmail,
          subject: `${
            data.orderType === "sample"
              ? "✅ Permintaan Sample Diterima - ESABUMINDO"
              : "✅ Pesanan Langsung Diterima - ESABUMINDO"
          }`,
          html: customerEmailTemplate,
        });

        emailSent = true;
      }
    } catch (emailErr) {
      console.error("Email sending error:", emailErr);
      emailError = emailErr.message;
      // Don't fail the entire request if email fails
      // Just log it and continue
    }

    // ========== WHATSAPP HANDLING ==========
    let whatsappSent = false;

    try {
      if (data.contactMethod === "whatsapp") {
        const whatsappMessage = formatPreOrderDataForWhatsApp(data);

        // Send to admin WhatsApp (082146024328)
        whatsappSent = await sendWhatsAppMessage(
          "082146024328",
          whatsappMessage
        );
      }
    } catch (waErr) {
      console.error("WhatsApp sending error:", waErr);
      // Don't fail if WhatsApp fails
    }

    return res.status(200).json({
      success: true,
      message: `${
        data.orderType === "sample" ? "Permintaan sample" : "Pesanan langsung"
      } berhasil dikirim`,
      orderId: orderId,
      orderType: data.orderType,
      emailSent: emailSent,
      emailError: emailError || null,
      whatsappSent: whatsappSent || false,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Pre-order error:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal mengirim pre-order: " + error.message,
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
