export default function ProductSpecifications({ product }) {
  const specifications = [
    {
      category: "Performa",
      items: [
        { label: "Kekuatan Ikat", value: "Tinggi" },
        { label: "Waktu Pengeringan", value: "5-10 menit" },
        { label: "Suhu Tahan", value: "hingga 200°C" },
        { label: "Daya Tahan", value: "Permanen" },
      ],
    },
    {
      category: "Karakteristik Fisik",
      items: [
        { label: "Warna", value: "Bening" },
        { label: "Viskositas", value: "Medium" },
        { label: "Bau", value: "Minimal" },
        { label: "Bentuk", value: "Cair" },
      ],
    },
    {
      category: "Keamanan & Lingkungan",
      items: [
        { label: "Non-Toxic", value: "Ya" },
        { label: "Eco-Friendly", value: "Ya" },
        { label: "VOC Content", value: "Rendah" },
        { label: "Hypoallergenic", value: "Ya" },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {specifications.map((spec, idx) => (
        <div key={idx}>
          <h4 className="text-lg font-bold text-gray-900 mb-4">
            {spec.category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spec.items.map((item, itemIdx) => (
              <div
                key={itemIdx}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700 font-medium">{item.label}</span>
                <span className="text-gray-900 font-bold text-lg">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Download Button */}
      <div className="pt-8 border-t border-gray-200">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#0c439a] text-white font-semibold rounded-lg hover:bg-[#0a3478] transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 16v-4m0 0V8m0 4H8m0 0v4m0-4H4m0 0h4m0 4h4m0 0h4m0-4v4m0 0h4"
            />
          </svg>
          Download Spesifikasi Lengkap (PDF)
        </button>
      </div>
    </div>
  );
}
