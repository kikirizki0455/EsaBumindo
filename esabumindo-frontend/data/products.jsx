// Product Types based on available images
export const PRODUCT_TYPES = [
  {
    id: "all-acr",
    name: "All Acrylic",
    image: "/images/products/all-acr.webp",
  },
  { id: "dempul", name: "Dempul", image: "/images/products/dempul.webp" },
  { id: "eva", name: "EVA", image: "/images/products/eva.webp" },
  { id: "psa", name: "PSA", image: "/images/products/psa.webp" },
  { id: "pvac", name: "PVAC", image: "/images/products/pvac.webp" },
  { id: "styrene", name: "Styrene", image: "/images/products/styrene.webp" },
  { id: "vinyl", name: "Vinyl", image: "/images/products/vinyl.webp" },
  { id: "wip", name: "WIP", image: "/images/products/wip.webp" },
];

// Base product structure (ID, type, image only - language-independent)
const BASE_PRODUCTS = [
  // ALL ACRYLIC
  {
    id: "acr-001",
    type: "All Acrylic",
    image: "/images/products/all-acr.webp",
  },
  {
    id: "acr-002",
    type: "All Acrylic",
    image: "/images/products/all-acr.webp",
  },
  {
    id: "acr-003",
    type: "All Acrylic",
    image: "/images/products/all-acr.webp",
  },
  {
    id: "acr-004",
    type: "All Acrylic",
    image: "/images/products/all-acr.webp",
  },
  {
    id: "acr-005",
    type: "All Acrylic",
    image: "/images/products/all-acr.webp",
  },
  // DEMPUL
  { id: "dmp-001", type: "Dempul", image: "/images/products/dempul.webp" },
  { id: "dmp-002", type: "Dempul", image: "/images/products/dempul.webp" },
  { id: "dmp-003", type: "Dempul", image: "/images/products/dempul.webp" },
  { id: "dmp-004", type: "Dempul", image: "/images/products/dempul.webp" },
  { id: "dmp-005", type: "Dempul", image: "/images/products/dempul.webp" },
  // EVA
  { id: "eva-001", type: "EVA", image: "/images/products/eva.webp" },
  { id: "eva-002", type: "EVA", image: "/images/products/eva.webp" },
  { id: "eva-003", type: "EVA", image: "/images/products/eva.webp" },
  { id: "eva-004", type: "EVA", image: "/images/products/eva.webp" },
  { id: "eva-005", type: "EVA", image: "/images/products/eva.webp" },
  // PSA
  { id: "psa-001", type: "PSA", image: "/images/products/psa.webp" },
  { id: "psa-002", type: "PSA", image: "/images/products/psa.webp" },
  { id: "psa-003", type: "PSA", image: "/images/products/psa.webp" },
  { id: "psa-004", type: "PSA", image: "/images/products/psa.webp" },
  { id: "psa-005", type: "PSA", image: "/images/products/psa.webp" },
  // PVAC
  { id: "pvac-001", type: "PVAC", image: "/images/products/pvac.webp" },
  { id: "pvac-002", type: "PVAC", image: "/images/products/pvac.webp" },
  { id: "pvac-003", type: "PVAC", image: "/images/products/pvac.webp" },
  { id: "pvac-004", type: "PVAC", image: "/images/products/pvac.webp" },
  { id: "pvac-005", type: "PVAC", image: "/images/products/pvac.webp" },
  // STYRENE
  { id: "sty-001", type: "Styrene", image: "/images/products/styrene.webp" },
  { id: "sty-002", type: "Styrene", image: "/images/products/styrene.webp" },
  { id: "sty-003", type: "Styrene", image: "/images/products/styrene.webp" },
  { id: "sty-004", type: "Styrene", image: "/images/products/styrene.webp" },
  { id: "sty-005", type: "Styrene", image: "/images/products/styrene.webp" },
  // VINYL
  { id: "vnl-001", type: "Vinyl", image: "/images/products/vinyl.webp" },
  { id: "vnl-002", type: "Vinyl", image: "/images/products/vinyl.webp" },
  { id: "vnl-003", type: "Vinyl", image: "/images/products/vinyl.webp" },
  { id: "vnl-004", type: "Vinyl", image: "/images/products/vinyl.webp" },
  { id: "vnl-005", type: "Vinyl", image: "/images/products/vinyl.webp" },
  // WIP
  {
    id: "wip-001",
    type: "WIP",
    image: "/images/products/wip.webp",
    comingSoon: true,
  },
  {
    id: "wip-002",
    type: "WIP",
    image: "/images/products/wip.webp",
    comingSoon: true,
  },
  {
    id: "wip-003",
    type: "WIP",
    image: "/images/products/wip.webp",
    comingSoon: true,
  },
  {
    id: "wip-004",
    type: "WIP",
    image: "/images/products/wip.webp",
    comingSoon: true,
  },
  {
    id: "wip-005",
    type: "WIP",
    image: "/images/products/wip.webp",
    comingSoon: true,
  },
];

// Base applications (ID, icon, color only - language-independent)
const BASE_APPLICATIONS = [
  { id: "app-1", icon: "⛏️", color: "from-gray-700 to-gray-900" },
  { id: "app-2", icon: "📄", color: "from-amber-600 to-amber-800" },
  { id: "app-3", icon: "🚗", color: "from-blue-600 to-blue-800" },
  { id: "app-4", icon: "📱", color: "from-purple-600 to-purple-800" },
  { id: "app-5", icon: "🏗️", color: "from-orange-600 to-orange-800" },
  { id: "app-6", icon: "🪑", color: "from-green-600 to-green-800" },
];

/**
 * Get localized products based on language
 * @param {object} productData - Translation data from locales (t("productData"))
 * @returns {array} Array of products with localized content
 */
export const getLocalizedProducts = (productData) => {
  if (!productData?.products) {
    // Return base products with default values if no translation
    return BASE_PRODUCTS.map((base) => ({
      ...base,
      name: base.id,
      title: base.id,
      category: base.type,
      application: "",
      performance: "",
      features: [],
      description: "",
    }));
  }

  return BASE_PRODUCTS.map((base) => {
    const translated = productData.products[base.id] || {};
    return {
      ...base,
      name: translated.name || base.id,
      title: translated.title || translated.name || base.id,
      category: translated.category || base.type,
      application: translated.application || "",
      performance: translated.performance || "",
      features: translated.features || [],
      description: translated.description || "",
      comingSoon: base.comingSoon || translated.comingSoon || false,
    };
  });
};

/**
 * Get localized applications based on language
 * @param {object} productData - Translation data from locales (t("productData"))
 * @returns {array} Array of applications with localized content
 */
export const getLocalizedApplications = (productData) => {
  if (!productData?.applications) {
    return BASE_APPLICATIONS.map((base) => ({
      ...base,
      name: base.id,
      description: "",
    }));
  }

  return BASE_APPLICATIONS.map((base) => {
    const translated = productData.applications[base.id] || {};
    return {
      ...base,
      name: translated.name || base.id,
      description: translated.description || "",
    };
  });
};

/**
 * Get product by ID with localized content
 * @param {string} id - Product ID
 * @param {object} productData - Translation data from locales
 * @returns {object|null} Product object or null if not found
 */
export const getLocalizedProductById = (id, productData) => {
  const products = getLocalizedProducts(productData);
  return products.find((product) => product.id === id) || null;
};

/**
 * Get products by type with localized content
 * @param {string} type - Product type
 * @param {object} productData - Translation data from locales
 * @returns {array} Array of products matching the type
 */
export const getLocalizedProductsByType = (type, productData) => {
  const products = getLocalizedProducts(productData);
  return products.filter((product) => product.type === type);
};

// ============================================
// LEGACY EXPORTS (for backward compatibility)
// These use Indonesian as default language
// ============================================

// Default Indonesian product data
const DEFAULT_PRODUCT_DATA = {
  products: {
    "acr-001": {
      name: "ESA Acrylic Bond 100",
      title: "ESA Acrylic Bond 100",
      category: "All Acrylic",
      application: "Konstruksi & Bangunan",
      performance: "Kekuatan Tinggi, Tahan Cuaca",
      features: [
        "Tahan cuaca ekstrem",
        "Daya rekat tinggi",
        "Cepat kering",
        "Tahan UV",
      ],
      description:
        "Lem akrilik premium untuk aplikasi konstruksi dengan daya tahan tinggi terhadap cuaca.",
    },
    "acr-002": {
      name: "ESA Acrylic Pro 200",
      title: "ESA Acrylic Pro 200",
      category: "All Acrylic",
      application: "Industri Otomotif",
      performance: "Grade Industri, Tahan Getaran",
      features: ["Tahan getaran", "Fleksibel", "Tahan panas", "Non-toxic"],
      description:
        "Solusi akrilik untuk industri otomotif dengan ketahanan getaran superior.",
    },
    "acr-003": {
      name: "ESA Acrylic Clear 300",
      title: "ESA Acrylic Clear 300",
      category: "All Acrylic",
      application: "Kaca & Akrilik",
      performance: "Jernih Sempurna, Tidak Menguning",
      features: [
        "Transparan sempurna",
        "Tidak menguning",
        "Curing cepat",
        "Mudah diaplikasi",
      ],
      description:
        "Lem akrilik bening untuk aplikasi kaca dan material transparan.",
    },
    "acr-004": {
      name: "ESA Acrylic Flex 400",
      title: "ESA Acrylic Flex 400",
      category: "All Acrylic",
      application: "Plastik & Komposit",
      performance: "Fleksibel, Multi-Permukaan",
      features: ["Super fleksibel", "Multi-permukaan", "Tahan air", "Ekonomis"],
      description:
        "Lem akrilik fleksibel untuk berbagai jenis permukaan plastik dan komposit.",
    },
    "acr-005": {
      name: "ESA Acrylic Heavy 500",
      title: "ESA Acrylic Heavy 500",
      category: "All Acrylic",
      application: "Industri Berat",
      performance: "Kekuatan Maksimal, Tahan Lama",
      features: [
        "Kekuatan maksimal",
        "Tahan lama",
        "Tahan kimia",
        "Grade industri",
      ],
      description: "Lem akrilik heavy duty untuk aplikasi industri berat.",
    },
    "dmp-001": {
      name: "ESA Dempul Kayu Premium",
      title: "ESA Dempul Kayu Premium",
      category: "Dempul",
      application: "Furniture & Woodworking",
      performance: "Bisa Diamplas, Bisa Diwarnai",
      features: [
        "Bisa diamplas",
        "Bisa dicat",
        "Mengisi celah sempurna",
        "Cepat kering",
      ],
      description:
        "Dempul kayu premium untuk finishing furniture berkualitas tinggi.",
    },
    "dmp-002": {
      name: "ESA Dempul Tembok Pro",
      title: "ESA Dempul Tembok Pro",
      category: "Dempul",
      application: "Konstruksi & Renovasi",
      performance: "Anti Retak, Mudah Diaplikasi",
      features: [
        "Anti retak",
        "Mudah diaplikasi",
        "Hasil halus",
        "Tahan lembab",
      ],
      description:
        "Dempul tembok profesional untuk hasil finishing dinding sempurna.",
    },
    "dmp-003": {
      name: "ESA Dempul Otomotif",
      title: "ESA Dempul Otomotif",
      category: "Dempul",
      application: "Perbaikan Body Otomotif",
      performance: "Cepat Kering, Daya Isi Tinggi",
      features: [
        "Cepat kering",
        "Daya isi tinggi",
        "Mudah diamplas",
        "Tahan benturan",
      ],
      description: "Dempul khusus untuk perbaikan body kendaraan.",
    },
    "dmp-004": {
      name: "ESA Dempul Waterproof",
      title: "ESA Dempul Waterproof",
      category: "Dempul",
      application: "Area Basah & Outdoor",
      performance: "100% Tahan Air, Anti Jamur",
      features: ["100% tahan air", "Anti jamur", "Tahan cuaca", "Tahan lama"],
      description: "Dempul waterproof untuk area basah dan aplikasi outdoor.",
    },
    "dmp-005": {
      name: "ESA Dempul Multi Surface",
      title: "ESA Dempul Multi Surface",
      category: "Dempul",
      application: "Multi Aplikasi",
      performance: "Serbaguna, Semua Permukaan",
      features: [
        "Multi permukaan",
        "Serbaguna",
        "Ekonomis",
        "Hasil profesional",
      ],
      description: "Dempul serbaguna untuk berbagai jenis permukaan.",
    },
    "eva-001": {
      name: "ESA EVA Hot Melt 100",
      title: "ESA EVA Hot Melt 100",
      category: "EVA",
      application: "Packaging & Karton",
      performance: "Setting Cepat, Rekat Kuat",
      features: [
        "Setting cepat",
        "Daya rekat kuat",
        "Cocok untuk karton",
        "Ekonomis",
      ],
      description: "Lem EVA hot melt untuk aplikasi packaging dan karton.",
    },
    "eva-002": {
      name: "ESA EVA Bookbinding",
      title: "ESA EVA Bookbinding",
      category: "EVA",
      application: "Percetakan & Binding",
      performance: "Fleksibel, Ramah Kertas",
      features: [
        "Fleksibel",
        "Tidak merusak kertas",
        "Hasil rapi",
        "Tahan lama",
      ],
      description: "Lem EVA khusus untuk jilid buku dan industri percetakan.",
    },
    "eva-003": {
      name: "ESA EVA Foam Bond",
      title: "ESA EVA Foam Bond",
      category: "EVA",
      application: "Foam & Sponge",
      performance: "Aman untuk Foam, Tanpa Kerusakan",
      features: [
        "Aman untuk foam",
        "Tidak merusak material",
        "Rekat kuat",
        "Cepat kering",
      ],
      description: "Lem EVA untuk bonding foam dan material sponge.",
    },
    "eva-004": {
      name: "ESA EVA Industrial",
      title: "ESA EVA Industrial",
      category: "EVA",
      application: "Industri Manufaktur",
      performance: "Volume Tinggi, Kualitas Konsisten",
      features: [
        "Untuk produksi massal",
        "Kualitas konsisten",
        "Efisien",
        "Hemat biaya",
      ],
      description: "Lem EVA industrial untuk aplikasi manufaktur skala besar.",
    },
    "eva-005": {
      name: "ESA EVA Premium Plus",
      title: "ESA EVA Premium Plus",
      category: "EVA",
      application: "Aplikasi Premium",
      performance: "Kualitas Superior, Grade Premium",
      features: [
        "Kualitas premium",
        "Performa superior",
        "Multi aplikasi",
        "Hasil profesional",
      ],
      description:
        "Lem EVA grade premium untuk aplikasi yang membutuhkan kualitas terbaik.",
    },
    "psa-001": {
      name: "ESA PSA Label Grade",
      title: "ESA PSA Label Grade",
      category: "PSA",
      application: "Label & Sticker",
      performance: "Tack Permanen, Aplikasi Bersih",
      features: [
        "Daya rekat permanen",
        "Aplikasi bersih",
        "Cocok untuk label",
        "Tahan lama",
      ],
      description: "PSA khusus untuk industri label dan sticker.",
    },
    "psa-002": {
      name: "ESA PSA Tape Bond",
      title: "ESA PSA Tape Bond",
      category: "PSA",
      application: "Manufaktur Tape",
      performance: "Tack Tinggi, Coating Konsisten",
      features: [
        "Tack tinggi",
        "Coating konsisten",
        "Untuk produksi tape",
        "Kualitas stabil",
      ],
      description:
        "PSA untuk manufaktur tape dengan kualitas coating konsisten.",
    },
    "psa-003": {
      name: "ESA PSA Removable",
      title: "ESA PSA Removable",
      category: "PSA",
      application: "Aplikasi Removable",
      performance: "Mudah Dilepas, Tanpa Residu",
      features: [
        "Mudah dilepas",
        "Tanpa residu",
        "Bisa direposisi",
        "Pelepasan bersih",
      ],
      description:
        "PSA removable untuk aplikasi yang membutuhkan kemudahan pelepasan.",
    },
    "psa-004": {
      name: "ESA PSA Medical Grade",
      title: "ESA PSA Medical Grade",
      category: "PSA",
      application: "Medis & Healthcare",
      performance: "Aman untuk Kulit, Hypoallergenic",
      features: [
        "Aman untuk kulit",
        "Hypoallergenic",
        "Grade medis",
        "Breathable",
      ],
      description: "PSA grade medis untuk aplikasi healthcare dan plester.",
    },
    "psa-005": {
      name: "ESA PSA Heavy Duty",
      title: "ESA PSA Heavy Duty",
      category: "PSA",
      application: "Mounting Industrial",
      performance: "Tack Ekstrem, Tahan Cuaca",
      features: ["Tack ekstrem", "Tahan cuaca", "Heavy duty", "Rekat permanen"],
      description: "PSA heavy duty untuk mounting industrial dan outdoor.",
    },
    "pvac-001": {
      name: "ESA PVAC Wood Pro",
      title: "ESA PVAC Wood Pro",
      category: "PVAC",
      application: "Woodworking & Furniture",
      performance: "Rekat Kayu Kuat, Bisa Diamplas",
      features: [
        "Rekat kayu kuat",
        "Bisa diamplas",
        "Cepat kering",
        "Non-toxic",
      ],
      description: "Lem PVAC premium untuk industri woodworking dan furniture.",
    },
    "pvac-002": {
      name: "ESA PVAC Paper Bond",
      title: "ESA PVAC Paper Bond",
      category: "PVAC",
      application: "Kertas & Packaging",
      performance: "Aman untuk Kertas, Cepat Kering",
      features: [
        "Aman untuk kertas",
        "Cepat kering",
        "Tidak berkerut",
        "Ekonomis",
      ],
      description: "Lem PVAC untuk aplikasi kertas dan packaging.",
    },
    "pvac-003": {
      name: "ESA PVAC D3 Waterproof",
      title: "ESA PVAC D3 Waterproof",
      category: "PVAC",
      application: "Furniture Outdoor",
      performance: "Tahan Air D3, Tahan Lama",
      features: [
        "Tahan air D3",
        "Untuk outdoor",
        "Tahan cuaca",
        "Kuat dan tahan lama",
      ],
      description: "Lem PVAC D3 waterproof untuk furniture outdoor.",
    },
    "pvac-004": {
      name: "ESA PVAC School Safe",
      title: "ESA PVAC School Safe",
      category: "PVAC",
      application: "Pendidikan & Kerajinan",
      performance: "Aman untuk Anak, Bisa Dicuci",
      features: [
        "Aman untuk anak",
        "Bisa dicuci",
        "Non-toxic",
        "Mudah digunakan",
      ],
      description: "Lem PVAC aman untuk sekolah dan kerajinan anak.",
    },
    "pvac-005": {
      name: "ESA PVAC Industrial",
      title: "ESA PVAC Industrial",
      category: "PVAC",
      application: "Manufaktur Industri",
      performance: "Volume Tinggi, Konsisten",
      features: [
        "Untuk industri",
        "Volume besar",
        "Kualitas konsisten",
        "Hemat biaya",
      ],
      description: "Lem PVAC industrial untuk produksi skala besar.",
    },
    "sty-001": {
      name: "ESA Styrene Board Bond",
      title: "ESA Styrene Board Bond",
      category: "Styrene",
      application: "Styrofoam & Insulasi",
      performance: "Aman untuk Foam, Rekat Kuat",
      features: [
        "Aman untuk styrofoam",
        "Rekat kuat",
        "Tidak merusak foam",
        "Cepat kering",
      ],
      description:
        "Lem styrene untuk bonding styrofoam dan material insulation.",
    },
    "sty-002": {
      name: "ESA Styrene Construction",
      title: "ESA Styrene Construction",
      category: "Styrene",
      application: "Konstruksi & Bangunan",
      performance: "Heavy Duty, Tahan Cuaca",
      features: [
        "Heavy duty",
        "Tahan cuaca",
        "Untuk konstruksi",
        "Daya rekat tinggi",
      ],
      description: "Lem styrene untuk aplikasi konstruksi dan bangunan.",
    },
    "sty-003": {
      name: "ESA Styrene Packaging",
      title: "ESA Styrene Packaging",
      category: "Styrene",
      application: "Industri Packaging",
      performance: "Setting Cepat, Hemat Biaya",
      features: ["Setting cepat", "Hemat biaya", "Untuk packaging", "Efisien"],
      description: "Lem styrene untuk industri packaging dan box.",
    },
    "sty-004": {
      name: "ESA Styrene Craft Pro",
      title: "ESA Styrene Craft Pro",
      category: "Styrene",
      application: "Kerajinan & Pembuatan Model",
      performance: "Presisi, Hasil Bersih",
      features: [
        "Presisi tinggi",
        "Hasil bersih",
        "Untuk model",
        "Mudah digunakan",
      ],
      description: "Lem styrene untuk kerajinan dan pembuatan model.",
    },
    "sty-005": {
      name: "ESA Styrene Industrial Plus",
      title: "ESA Styrene Industrial Plus",
      category: "Styrene",
      application: "Industri Berat",
      performance: "Kekuatan Maksimal, Grade Industri",
      features: [
        "Kekuatan maksimal",
        "Grade industri",
        "Tahan lama",
        "Performa tinggi",
      ],
      description: "Lem styrene industrial untuk aplikasi berat.",
    },
    "vnl-001": {
      name: "ESA Vinyl Floor Bond",
      title: "ESA Vinyl Floor Bond",
      category: "Vinyl",
      application: "Lantai & Karpet",
      performance: "Rekat Permanen, Hasil Rata",
      features: [
        "Rekat permanen",
        "Hasil rata",
        "Untuk lantai vinyl",
        "Tahan lama",
      ],
      description: "Lem vinyl untuk pemasangan lantai vinyl dan karpet.",
    },
    "vnl-002": {
      name: "ESA Vinyl Wall Cover",
      title: "ESA Vinyl Wall Cover",
      category: "Vinyl",
      application: "Penutup Dinding",
      performance: "Mudah Diaplikasi, Bisa Direposisi",
      features: [
        "Mudah diaplikasi",
        "Bisa direposisi",
        "Untuk wall covering",
        "Hasil profesional",
      ],
      description:
        "Lem vinyl untuk pemasangan wall covering dan wallpaper vinyl.",
    },
    "vnl-003": {
      name: "ESA Vinyl Automotive",
      title: "ESA Vinyl Automotive",
      category: "Vinyl",
      application: "Interior Otomotif",
      performance: "Tahan Panas, Fleksibel",
      features: [
        "Tahan panas",
        "Fleksibel",
        "Untuk interior mobil",
        "Tidak berbau",
      ],
      description: "Lem vinyl untuk aplikasi interior otomotif.",
    },
    "vnl-004": {
      name: "ESA Vinyl Marine Grade",
      title: "ESA Vinyl Marine Grade",
      category: "Vinyl",
      application: "Kelautan & Kapal",
      performance: "Tahan Air, Tahan Air Laut",
      features: [
        "100% waterproof",
        "Tahan air laut",
        "Untuk kapal",
        "Tahan UV",
      ],
      description: "Lem vinyl marine grade untuk aplikasi kapal dan laut.",
    },
    "vnl-005": {
      name: "ESA Vinyl Multi Purpose",
      title: "ESA Vinyl Multi Purpose",
      category: "Vinyl",
      application: "Serba Guna",
      performance: "Serbaguna, Semua Jenis Vinyl",
      features: [
        "Serbaguna",
        "Semua jenis vinyl",
        "Ekonomis",
        "Mudah digunakan",
      ],
      description: "Lem vinyl serbaguna untuk berbagai aplikasi vinyl.",
    },
    "wip-001": {
      name: "ESA Bio Adhesive (Segera Hadir)",
      title: "ESA Bio Adhesive (Segera Hadir)",
      category: "WIP",
      application: "Aplikasi Ramah Lingkungan",
      performance: "Biodegradable, Formula Hijau",
      features: [
        "Biodegradable",
        "Ramah lingkungan",
        "Formula hijau",
        "Sustainable",
      ],
      description: "Lem bio-based ramah lingkungan - Segera hadir.",
      comingSoon: true,
    },
    "wip-002": {
      name: "ESA Smart Bond (Segera Hadir)",
      title: "ESA Smart Bond (Segera Hadir)",
      category: "WIP",
      application: "Aplikasi Pintar",
      performance: "Indikator Suhu, Smart Curing",
      features: [
        "Indikator suhu",
        "Smart curing",
        "Teknologi terbaru",
        "Inovatif",
      ],
      description: "Lem pintar dengan indikator curing - Segera hadir.",
      comingSoon: true,
    },
    "wip-003": {
      name: "ESA Nano Tech (Segera Hadir)",
      title: "ESA Nano Tech (Segera Hadir)",
      category: "WIP",
      application: "Aplikasi High-Tech",
      performance: "Partikel Nano, Kekuatan Superior",
      features: [
        "Teknologi nano",
        "Kekuatan superior",
        "Presisi tinggi",
        "Generasi terbaru",
      ],
      description: "Lem dengan teknologi nano - Segera hadir.",
      comingSoon: true,
    },
    "wip-004": {
      name: "ESA UV Cure Pro (Segera Hadir)",
      title: "ESA UV Cure Pro (Segera Hadir)",
      category: "WIP",
      application: "Aplikasi UV Curing",
      performance: "Curing UV Instan, Jernih Sempurna",
      features: [
        "UV curing instan",
        "Jernih sempurna",
        "Tanpa solvent",
        "Hasil sempurna",
      ],
      description: "Lem UV curing untuk aplikasi presisi - Segera hadir.",
      comingSoon: true,
    },
    "wip-005": {
      name: "ESA Conductive Bond (Segera Hadir)",
      title: "ESA Conductive Bond (Segera Hadir)",
      category: "WIP",
      application: "Elektronik & PCB",
      performance: "Konduktif Listrik, Aman ESD",
      features: [
        "Konduktif listrik",
        "Aman ESD",
        "Untuk PCB",
        "Presisi tinggi",
      ],
      description: "Lem konduktif untuk elektronik - Segera hadir.",
      comingSoon: true,
    },
  },
  applications: {
    "app-1": {
      name: "Batu Bara",
      description: "Solusi adhesive untuk industri pertambangan dan pengolahan",
    },
    "app-2": {
      name: "Paper & Pulp",
      description: "Formula khusus untuk industri kertas dan selulosa",
    },
    "app-3": {
      name: "Otomotif",
      description: "Adhesive berkualitas tinggi untuk manufaktur otomotif",
    },
    "app-4": {
      name: "Elektronik",
      description: "Teknologi adhesive presisi untuk industri elektronik",
    },
    "app-5": {
      name: "Konstruksi",
      description: "Material bonding untuk proyek konstruksi skala besar",
    },
    "app-6": {
      name: "Furniture",
      description: "Adhesive ramah lingkungan untuk industri furnitur",
    },
  },
};

// Legacy: ALL_PRODUCTS using default Indonesian
export const ALL_PRODUCTS = getLocalizedProducts(DEFAULT_PRODUCT_DATA);

// Legacy: Get product by ID (uses default Indonesian)
export const getProductById = (id) => {
  return ALL_PRODUCTS.find((product) => product.id === id) || null;
};

// Legacy: Get products by type (uses default Indonesian)
export const getProductsByType = (type) => {
  return ALL_PRODUCTS.filter((product) => product.type === type);
};

// Legacy: APPLICATIONS using default Indonesian
export const APPLICATIONS = getLocalizedApplications(DEFAULT_PRODUCT_DATA);

// Legacy: Featured products
export const BEST_SELLER_PRODUCTS = [
  ALL_PRODUCTS.find((p) => p.id === "pvac-001"),
  ALL_PRODUCTS.find((p) => p.id === "sty-001"),
  ALL_PRODUCTS.find((p) => p.id === "eva-001"),
  ALL_PRODUCTS.find((p) => p.id === "acr-001"),
].filter(Boolean);

export const NEW_PRODUCTS = [
  ALL_PRODUCTS.find((p) => p.id === "psa-001"),
  ALL_PRODUCTS.find((p) => p.id === "vnl-001"),
  ALL_PRODUCTS.find((p) => p.id === "dmp-001"),
  ALL_PRODUCTS.find((p) => p.id === "wip-001"),
].filter(Boolean);
