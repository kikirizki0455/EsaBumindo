export default function ProductTechnicalInfo({ product }) {
  const technicalInfo = [
    {
      title: "Komposisi Bahan",
      content:
        "Formulasi khusus dengan bahan-bahan premium yang dipilih secara teliti untuk menghasilkan performa maksimal dan daya tahan jangka panjang.",
    },
    {
      title: "Proses Aplikasi",
      content:
        "Aplikasi mudah dengan dispenser standar. Cocok untuk otomasi industri maupun penggunaan manual. Tidak memerlukan peralatan khusus.",
    },
    {
      title: "Penyimpanan",
      content:
        "Simpan pada suhu 15-25°C, jauh dari sinar matahari langsung. Masa simpan hingga 24 bulan dalam kondisi tertutup rapat.",
    },
    {
      title: "Sertifikasi & Standar",
      content:
        "Telah tersertifikasi ISO 9001:2015, SNI, dan memenuhi standar internasional untuk kualitas dan keamanan produk.",
    },
  ];

  const usageGuidelines = [
    "Pastikan permukaan bersih dan kering sebelum aplikasi",
    "Gunakan dalam ventilasi yang baik",
    "Gunakan sarung tangan untuk melindungi kulit",
    "Hindari kontak dengan mata",
    "Jangan gunakan pada permukaan yang basah atau berminyak",
  ];

  return (
    <div className="space-y-8">
      {/* Technical Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {technicalInfo.map((info, idx) => (
          <div
            key={idx}
            className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              {info.title}
            </h4>
            <p className="text-gray-700 leading-relaxed">{info.content}</p>
          </div>
        ))}
      </div>

      {/* Usage Guidelines */}
      <div className="bg-gradient-to-br from-[#0c439a]/5 to-[#ca161e]/5 p-8 rounded-lg border border-gray-200">
        <h4 className="text-lg font-bold text-gray-900 mb-4">
          Panduan Penggunaan
        </h4>
        <ul className="space-y-3">
          {usageGuidelines.map((guideline, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="text-[#ca161e] font-bold mt-1">•</span>
              <span className="text-gray-700">{guideline}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Safety Info */}
      <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
        <h4 className="text-lg font-bold text-amber-900 mb-3">
          ⚠️ Informasi Keselamatan
        </h4>
        <p className="text-amber-800 mb-3">
          Produk ini aman untuk penggunaan industri. Namun, harap perhatikan
          petunjuk keselamatan berikut:
        </p>
        <ul className="space-y-2 text-sm text-amber-800">
          <li>• Hindari menghirup uap dalam waktu lama</li>
          <li>• Gunakan APD yang sesuai (sarung tangan, masker jika perlu)</li>
          <li>• Jika terkena mata, bilas dengan air bersih segera</li>
          <li>• Simpan jauh dari jangkauan anak-anak</li>
        </ul>
      </div>

      {/* Contact for More Info */}
      <div className="p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-700 mb-4">
          Butuh informasi teknis lebih lanjut atau konsultasi?
        </p>
        <button className="inline-block px-6 py-3 bg-[#0c439a] text-white font-semibold rounded-lg hover:bg-[#0a3478] transition-colors">
          Hubungi Tim Teknis Kami
        </button>
      </div>
    </div>
  );
}
