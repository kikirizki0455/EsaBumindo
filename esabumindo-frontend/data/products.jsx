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
  // EVA
  { id: "eva-001", type: "EVA", image: "/images/products/eva.webp" },
  { id: "eva-002", type: "EVA", image: "/images/products/eva.webp" },
  { id: "eva-003", type: "EVA", image: "/images/products/eva.webp" },
  { id: "eva-004", type: "EVA", image: "/images/products/eva.webp" },
  // PSA
  { id: "psa-001", type: "PSA", image: "/images/products/psa.webp" },
  { id: "psa-002", type: "PSA", image: "/images/products/psa.webp" },
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
];

// Base applications (ID, icon, color only - language-independent)
const BASE_APPLICATIONS = [
  {
    id: "app-1",
    icon: "⛏️",
    color: "from-gray-700 to-gray-900",
    name: "Dry Lamination",
    description:
      "High-performance adhesive solution for dry lamination processes, delivering strong bonding strength, fast drying, and consistent film quality for industrial-scale production.",
  },
  {
    id: "app-2",
    icon: "📄",
    color: "from-amber-600 to-amber-800",
    name: "Screen Printing",
    description:
      "Specialized adhesive formulation for screen printing applications, ensuring excellent print clarity, durability, and resistance to water and abrasion.",
  },
  {
    id: "app-3",
    icon: "🚗",
    color: "from-blue-600 to-blue-800",
    name: "Waterproofing",
    description:
      "Reliable adhesive system designed for waterproofing applications, providing strong film formation, water resistance, and long-term protection.",
  },
  {
    id: "app-4",
    icon: "📱",
    color: "from-purple-600 to-purple-800",
    name: "Wet Lamination",
    description:
      "Efficient adhesive solution for wet lamination processes, offering excellent substrate compatibility, smooth application, and stable bonding performance.",
  },
  {
    id: "app-5",
    icon: "🏗️",
    color: "from-orange-600 to-orange-800",
    name: "Joint Flap",
    description: "Material bonding untuk proyek konstruksi skala besar.",
  },
  {
    id: "app-6",
    icon: "🪑",
    color: "from-green-600 to-green-800",
    name: "Wood",
    description:
      "Adhesive system developed for medium to hard wood applications, offering strong bonding, durability, and reliability for structural and joinery use.",
  },
  {
    id: "app-7",
    icon: "🧪",
    color: "from-red-600 to-red-800",
    name: "Paper – Aluminium Lamination",
    description:
      "Advanced bonding solution for paper-to-aluminium lamination, ensuring strong adhesion across different substrates with stable and reliable performance.",
  },
  {
    id: "app-8",
    icon: "🏷️",
    color: "from-indigo-600 to-indigo-800",
    name: "Label",
    description:
      "Pressure-sensitive adhesive designed for labeling applications, providing high immediate tack, strong peel strength, and clean adhesion on various surfaces.",
  },
];

/**
 * Get localized products based on language
 * @param {object} productData - Translation data from locales (t("productData"))
 * @returns {array} Array of products with localized content
 */
export const getLocalizedProducts = (productData, locale = "id") => {
  if (!productData?.products) {
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
      // ↓ Resolve features berdasarkan locale
      features: resolveFeatures(translated.features, locale),
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
      id: base.id,
      name: base.name,
      description: base.description,
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
export const getLocalizedProductById = (id, productData, locale = "id") => {
  const products = getLocalizedProducts(productData, locale);
  return products.find((p) => p.id === id) || null;
};

/**
 * Get products by type with localized content
 * @param {string} type - Product type
 * @param {object} productData - Translation data from locales
 * @returns {array} Array of products matching the type
 */
export const getLocalizedProductsByType = (
  type,
  productData,
  locale = "id"
) => {
  const products = getLocalizedProducts(productData, locale);
  return products.filter((p) => p.type === type);
};

// ============================================
// LEGACY EXPORTS (for backward compatibility)
// These use Indonesian as default language
// ============================================

// Default Indonesian product data
const DEFAULT_PRODUCT_DATA = {
  products: {
    // ── ALL ACRYLIC ──────────────────────────────────────────────────────────
    "acr-001": {
      name: "EB 3038",
      title: "EB 3038",
      category: "All Acrylic",
      application: "Dry Lamination",
      performance: "Kekuatan Tinggi, Tahan Cuaca",
      features: {
        id: [
          "Kekuatan ikat tinggi untuk laminasi stabil",
          "Ketahanan cuaca yang sangat baik",
          "Tampilan film putih susu setelah kering",
          "Pengeringan cepat untuk efisiensi produksi",
          "Cocok untuk laminasi dry process skala industri",
        ],
        en: [
          "High bonding strength for stable lamination",
          "Excellent weather resistance",
          "Milky white film appearance after drying",
          "Fast drying for production efficiency",
          "Suitable for industrial-scale dry lamination",
        ],
      },
      description:
        "Lem akrilik premium untuk aplikasi laminasi kering dengan kekuatan tinggi dan tahan cuaca.",
    },
    "acr-002": {
      name: "EB 5037 MA",
      title: "EB 5037 MA",
      category: "All Acrylic",
      application: "Sablon / Screen Printing",
      performance: "Ketahanan Gosok, Hasil Glossy",
      features: {
        id: [
          "Dirancang khusus untuk aplikasi tekstil",
          "Ketahanan gosok yang sangat baik",
          "Hasil cetak glossy dan tajam",
          "Tahan air yang baik",
          "Viskositas stabil untuk proses sablon",
        ],
        en: [
          "Specially designed for textile applications",
          "Excellent rubbing fastness",
          "High gloss and sharp print results",
          "Good water resistance",
          "Stable viscosity for screen printing process",
        ],
      },
      description:
        "All acrylic emulsion untuk aplikasi tekstil, terutama sebagai printing binder.",
    },
    "acr-003": {
      name: "EB 727",
      title: "EB 727",
      category: "All Acrylic",
      application: "Waterproofing",
      performance: "Tahan Air, Film Jernih",
      features: {
        id: [
          "Ketahanan gosok yang sangat baik",
          "Hasil film glossy tinggi",
          "Ketahanan air yang baik",
          "Kandungan solid tinggi (50%)",
          "Film bening hingga transparan setelah kering",
        ],
        en: [
          "Excellent rubbing fastness",
          "High gloss film finish",
          "Good water resistance",
          "High solid content (50%)",
          "Blueish to transparent film after drying",
        ],
      },
      description:
        "Acrylic emulsion dengan ketahanan gosok tinggi, film glossy, dan tahan air.",
    },

    // ── EVA ─────────────────────────────────────────────────────────────────
    "eva-001": {
      name: "EB 8102",
      title: "EB 8102",
      category: "EVA",
      application: "Wet Lamination",
      performance: "Adhesi Baik, Packaging & Binding",
      features: {
        id: [
          "Adhesi baik untuk kemasan dan penjilidan",
          "Cocok untuk bonding plastik dan kertas berlapis",
          "Emulsi kopolimer etilen vinil asetat",
          "Viskositas rendah untuk wet lamination",
          "Kandungan solid hampir 50% untuk efisiensi",
        ],
        en: [
          "Good adhesion for packaging and bookbinding",
          "Suitable for bonding plastic and paper layers",
          "Ethylene vinyl acetate copolymer emulsion",
          "Low viscosity for wet lamination",
          "Nearly 50% solid content for efficiency",
        ],
      },
      description:
        "Emulsi kopolimer EVA untuk dasar adhesif, kemasan, dan penjilidan.",
    },
    "eva-002": {
      name: "EB 956",
      title: "EB 956",
      category: "EVA",
      application: "Joint Flap",
      performance: "Adhesi Kuat, Solid Tinggi",
      features: {
        id: [
          "Adhesi kuat untuk joint flap",
          "Kandungan solid tinggi (54%)",
          "Cocok untuk kertas laminasi dan coating",
          "Produk EVA dengan ikatan yang stabil",
          "Tampilan putih susu yang konsisten",
        ],
        en: [
          "Strong adhesion for joint flap",
          "High solid content (54%)",
          "Suitable for laminated and coated paper",
          "EVA product with stable bonding",
          "Consistent milky white appearance",
        ],
      },
      description:
        "Produk EVA dengan adhesi kuat untuk joint flap pada kertas laminasi.",
    },
    "eva-003": {
      name: "EB 957",
      title: "EB 957",
      category: "EVA",
      application: "Joint Flap",
      performance: "Aplikasi Nozzle, Solid Tertinggi",
      features: {
        id: [
          "Viskositas sangat rendah untuk aplikasi nozzle",
          "Mudah diaplikasikan secara otomatis",
          "Adhesi kuat pada permukaan halus",
          "Kandungan solid tertinggi di lini EVA (55%)",
          "Cocok untuk bonding kertas ke material halus",
        ],
        en: [
          "Very low viscosity for nozzle application",
          "Easy automatic machine application",
          "Strong adhesion on smooth surfaces",
          "Highest solid content in EVA line (55%)",
          "Suitable for bonding paper to smooth materials",
        ],
      },
      description:
        "Produk EVA dengan viskositas rendah untuk aplikasi nozzle pada permukaan halus.",
    },
    "eva-004": {
      name: "EB 8104",
      title: "EB 8104",
      category: "EVA",
      application: "Paper - Aluminium Lamination",
      performance: "Adhesi ke Aluminium, Multi-Substrat",
      features: {
        id: [
          "Adhesi baik pada aluminium foil",
          "Cocok untuk laminasi kertas-aluminium",
          "Kompatibel dengan lembaran PVC dan kayu",
          "Emulsi kopolimer vinil etilen berkualitas",
          "Viskositas menengah untuk proses roll coating",
        ],
        en: [
          "Good adhesion on aluminium foil",
          "Suitable for paper-aluminium lamination",
          "Compatible with PVC sheets and wood",
          "Quality vinyl ethylene copolymer emulsion",
          "Medium viscosity for roll coating process",
        ],
      },
      description:
        "Emulsi kopolimer EVA untuk laminasi kertas-aluminium, kayu, dan PVC.",
    },

    // ── PSA ──────────────────────────────────────────────────────────────────
    "psa-001": {
      name: "EB 660",
      title: "EB 660",
      category: "PSA",
      application: "Label",
      performance: "Immediate Tack Tinggi, Peel Strength Kuat",
      features: {
        id: [
          "Tack awal (immediate tack) yang sangat tinggi",
          "Kekuatan kupas (peel strength) yang tinggi",
          "Kandungan solid tertinggi di lini PSA (62%)",
          "Cocok untuk label dan stiker",
          "Merekatkan kertas pada permukaan halus",
        ],
        en: [
          "Very high immediate tack",
          "High peel strength",
          "Highest solid content in PSA line (62%)",
          "Suitable for labels and stickers",
          "Bonds paper to smooth surfaces",
        ],
      },
      description:
        "PSA dengan immediate tack dan peel strength tinggi untuk label dan stiker.",
    },
    "psa-002": {
      name: "EB 9334",
      title: "EB 9334",
      category: "PSA",
      application: "Joint Flap Paper - Plastic",
      performance: "Roll Coating, Cohesi Baik",
      features: {
        id: [
          "Tack awal yang tinggi untuk joint flap",
          "Kekuatan kupas tinggi dan kohesi yang baik",
          "Cocok untuk proses roll coating",
          "Merekatkan kertas ke plastik dengan kuat",
          "Kandungan solid tinggi (62%) untuk efisiensi",
        ],
        en: [
          "High immediate tack for joint flap",
          "High peel strength with good cohesion",
          "Suitable for roll coating process",
          "Strongly bonds paper to plastic",
          "High solid content (62%) for efficiency",
        ],
      },
      description:
        "PSA untuk joint flap kertas-plastik dengan proses roll coating.",
    },

    // ── PVAC ─────────────────────────────────────────────────────────────────
    "pvac-001": {
      name: "EB 140",
      title: "EB 140",
      category: "PVAC",
      application: "Middle to Hard Wood",
      performance: "Rekat Kayu Kuat, Multi Aplikasi",
      features: {
        id: [
          "Cocok untuk semua jenis kayu keras hingga menengah",
          "Ikatan kuat untuk joinery dan konstruksi",
          "Dapat merekatkan lembaran Formica",
          "Cocok untuk kayu laminasi dan bare-core",
          "Efisiensi tinggi dalam proses produksi",
        ],
        en: [
          "Suitable for all middle to hard wood types",
          "Strong bonding for joinery and construction",
          "Bonds Formica sheets effectively",
          "Suitable for laminated timber and bare-core",
          "High efficiency in production processes",
        ],
      },
      description:
        "PVAC untuk bonding kayu keras, joinery, lembaran Formica, dan bare-core.",
    },
    "pvac-002": {
      name: "EB 140 E",
      title: "EB 140 E",
      category: "PVAC",
      application: "Middle to Hard Wood",
      performance: "Viskositas Rendah, Mudah Aplikasi",
      features: {
        id: [
          "Kompatibel dengan berbagai jenis kayu",
          "Viskositas rendah untuk kemudahan aplikasi",
          "Performa joinery yang baik",
          "Ikatan yang stabil dan tahan lama",
          "Mudah diaplikasikan secara manual maupun mesin",
        ],
        en: [
          "Compatible with a wide range of wood types",
          "Low viscosity for easy application",
          "Good joinery performance",
          "Stable and durable bonding",
          "Easy manual and machine application",
        ],
      },
      description:
        "PVAC viskositas rendah untuk kemudahan aplikasi pada kayu keras.",
    },
    "pvac-003": {
      name: "EB 230 PP",
      title: "EB 230 PP",
      category: "PVAC",
      application: "Soft to Middle Wood",
      performance: "Viskositas Ultra-Tinggi, Furnitur",
      features: {
        id: [
          "Viskositas sangat tinggi untuk aplikasi tebal",
          "Cocok untuk industri furnitur",
          "Adhesi yang baik pada kayu lunak",
          "Formulasi PVAc homopolimer stabil",
          "Hasil lem putih susu yang bersih",
        ],
        en: [
          "Very high viscosity for thick application",
          "Suitable for furniture industry",
          "Good adhesion on soft wood",
          "Stable PVAc homopolymer formulation",
          "Clean milky white adhesive result",
        ],
      },
      description:
        "PVAC viskositas sangat tinggi untuk furnitur dan kayu lunak hingga menengah.",
    },
    "pvac-004": {
      name: "EB 435 E",
      title: "EB 435 E",
      category: "PVAC",
      application: "Soft to Middle Wood",
      performance: "Fleksibel, Fingerjoint & Barecore",
      features: {
        id: [
          "Fleksibilitas film yang baik",
          "Cocok untuk fingerjoint dan lumber core",
          "Digunakan untuk konstruksi barecore",
          "Emulsi homopolimer PVAc berkualitas",
          "Viskositas menengah, mudah diproses",
        ],
        en: [
          "Good film flexibility",
          "Suitable for fingerjoint and lumber core",
          "Used for barecore construction",
          "Quality PVAc homopolymer emulsion",
          "Medium viscosity, easy to process",
        ],
      },
      description:
        "PVAC fleksibel untuk fingerjoint, lumber core, dan barecore.",
    },
    "pvac-005": {
      name: "EB 460",
      title: "EB 460",
      category: "PVAC",
      application: "Middle to Hard Wood",
      performance: "Solid Tertinggi, Kering Cepat",
      features: {
        id: [
          "Kandungan solid sangat tinggi (59%)",
          "Kecepatan pengeringan relatif cepat",
          "Adhesi kuat pada kayu menengah hingga keras",
          "Efisien untuk produksi skala besar",
          "Tampilan putih susu yang konsisten",
        ],
        en: [
          "Very high solid content (59%)",
          "Relatively fast drying speed",
          "Strong adhesion on medium to hard wood",
          "Efficient for large-scale production",
          "Consistent milky white appearance",
        ],
      },
      description:
        "PVAC solid tinggi dengan pengeringan cepat untuk kayu keras.",
    },

    // ── STYRENE ──────────────────────────────────────────────────────────────
    "sty-001": {
      name: "EB 2250",
      title: "EB 2250",
      category: "Styrene",
      application: "Flexo Ink",
      performance: "Diluent Tinta Flexo, Solid Tinggi",
      features: {
        id: [
          "Emulsi styrene-acrylic performa tinggi",
          "Digunakan sebagai pengencer tinta flexo berbasis air",
          "Cocok untuk substrat kertas dan karton",
          "Kandungan solid tinggi (50%)",
          "Formulasi stabil untuk proses cetak flexo",
        ],
        en: [
          "High-performance styrene-acrylic emulsion",
          "Used as diluent in water-based flexo inks",
          "Suitable for paper and paperboard substrates",
          "High solid content (50%)",
          "Stable formulation for flexo printing",
        ],
      },
      description:
        "Styrene-acrylic emulsion sebagai pengencer tinta flexo berbasis air.",
    },
    "sty-002": {
      name: "EB 2251",
      title: "EB 2251",
      category: "Styrene",
      application: "Flexo Ink",
      performance: "Tg Tinggi, Film Jernih",
      features: {
        id: [
          "Nilai Tg tinggi untuk ketahanan yang lebih baik",
          "Tampilan film yang jernih setelah kering",
          "Pengencer tinta flexo berbasis air",
          "Untuk substrat kertas dan karton",
          "Kandungan solid tinggi (50%)",
        ],
        en: [
          "High Tg value for better resistance",
          "Clear film appearance after drying",
          "Diluent for water-based flexo inks",
          "For paper and paperboard substrates",
          "High solid content (50%)",
        ],
      },
      description:
        "Styrene-acrylic emulsion Tg tinggi dengan film jernih untuk tinta flexo.",
    },
    "sty-003": {
      name: "EB 3042 TP",
      title: "EB 3042 TP",
      category: "Styrene",
      application: "Sablon / Screen Printing",
      performance: "Ketahanan Gosok, Glossy",
      features: {
        id: [
          "Dirancang khusus untuk sablon tekstil",
          "Ketahanan gosok yang sangat baik",
          "Hasil cetak glossy tinggi",
          "Tahan air yang baik",
          "Formulasi styrene-acrylic untuk ketahanan warna",
        ],
        en: [
          "Specially designed for textile screen printing",
          "Excellent rubbing fastness",
          "High gloss print results",
          "Good water resistance",
          "Styrene-acrylic formulation for color durability",
        ],
      },
      description:
        "Styrene-acrylic emulsion untuk sablon tekstil dengan hasil glossy dan tahan gosok.",
    },
    "sty-004": {
      name: "EB 5506 B",
      title: "EB 5506 B",
      category: "Styrene",
      application: "Metal Roof",
      performance: "Brushability Baik, Adhesi Metal",
      features: {
        id: [
          "Kemudahan pengolesan (brushability) yang baik",
          "Pembentukan film yang jernih",
          "Adhesi kuat pada permukaan metal",
          "Cocok untuk genteng metal",
          "Ketahanan cuaca dan UV yang baik",
        ],
        en: [
          "Good brushability for easy application",
          "Clear film formation",
          "Strong adhesion on metal surfaces",
          "Suitable for metal roof tiles",
          "Good weather and UV resistance",
        ],
      },
      description:
        "Styrene-acrylic dengan brushability baik dan adhesi kuat untuk atap metal.",
    },
    "sty-005": {
      name: "EB 5502",
      title: "EB 5502",
      category: "Styrene",
      application: "Foam Laminated",
      performance: "Fleksibel, Laminasi Busa",
      features: {
        id: [
          "Fleksibilitas film yang sangat baik",
          "Adhesi kuat untuk laminasi busa",
          "Formulasi styrene-acrylic yang stabil",
          "Cocok untuk industri foam lamination",
          "Tampilan putih kebiruan yang konsisten",
        ],
        en: [
          "Excellent film flexibility",
          "Strong adhesion for foam lamination",
          "Stable styrene-acrylic formulation",
          "Suitable for foam lamination industry",
          "Consistent white bluish appearance",
        ],
      },
      description:
        "Styrene-acrylic fleksibel dengan adhesi kuat untuk laminasi busa.",
    },

    // ── VINYL ─────────────────────────────────────────────────────────────────
    "vnl-001": {
      name: "EB 1101 VA",
      title: "EB 1101 VA",
      category: "Vinyl",
      application: "Coating",
      performance: "Adhesi Baik, Solid Tinggi, Cat",
      features: {
        id: [
          "Adhesi yang baik pada berbagai substrat",
          "Ketahanan air yang baik",
          "Kandungan solid tinggi (57%)",
          "Penerimaan warna yang baik untuk industri cat",
          "Emulsi vinil-akrilik berkualitas tinggi",
        ],
        en: [
          "Good adhesion on various substrates",
          "Good water resistance",
          "High solid content (57%)",
          "Good color acceptance for paint industry",
          "High quality vinyl-acrylic emulsion",
        ],
      },
      description:
        "Emulsi vinil-akrilik dengan adhesi dan tahan air baik untuk industri cat.",
    },
    "vnl-002": {
      name: "EB 1103 VA",
      title: "EB 1103 VA",
      category: "Vinyl",
      application: "Coating",
      performance: "Elastis, Penerimaan Warna Baik",
      features: {
        id: [
          "Elastisitas film yang baik",
          "Adhesi dan ketahanan air yang baik",
          "Penerimaan warna yang baik untuk cat",
          "Viskositas lebih tinggi dari EB 1101 VA",
          "Cocok untuk coating yang membutuhkan fleksibilitas",
        ],
        en: [
          "Good film elasticity",
          "Good adhesion and water resistance",
          "Good color acceptance for paint",
          "Higher viscosity than EB 1101 VA",
          "Suitable for coatings requiring flexibility",
        ],
      },
      description:
        "Emulsi vinil-akrilik dengan elastisitas baik untuk coating fleksibel.",
    },
  },

  applications: {
    "app-1": {
      name: "Dry Lamination",
      description:
        "High-performance adhesive solution for dry lamination processes, delivering strong bonding strength, fast drying, and consistent film quality for industrial-scale production.",
    },
    "app-2": {
      name: "Screen Printing",
      description:
        "Specialized adhesive formulation for screen printing applications, ensuring excellent print clarity, durability, and resistance to water and abrasion.",
    },
    "app-3": {
      name: "Waterproofing",
      description:
        "Reliable adhesive system designed for waterproofing applications, providing strong film formation, water resistance, and long-term protection.",
    },
    "app-4": {
      name: "Wet Lamination",
      description:
        "Efficient adhesive solution for wet lamination processes, offering excellent substrate compatibility, smooth application, and stable bonding performance.",
    },
    "app-5": {
      name: "Joint Flap",
      description: "Material bonding untuk proyek konstruksi skala besar",
    },
    "app-6": {
      name: "Wood",
      description:
        "Adhesive system developed for medium to hard wood applications, offering strong bonding, durability, and reliability for structural and joinery use.",
    },
    "app-7": {
      name: "Paper – Aluminium Lamination",
      description:
        "Advanced bonding solution for paper-to-aluminium lamination, ensuring strong adhesion across different substrates with stable and reliable performance.",
    },
    "app-8": {
      name: "Label",
      description:
        "Pressure-sensitive adhesive designed for labeling applications, providing high immediate tack, strong peel strength, and clean adhesion on various surfaces.",
    },
  },
};

function resolveFeatures(features, locale = "id") {
  if (!features) return [];
  // Format baru: objek bilingual
  if (typeof features === "object" && !Array.isArray(features)) {
    return features[locale] ?? features["id"] ?? [];
  }
  // Format lama: flat array (selalu dikembalikan apa adanya)
  return features;
}

// Legacy: ALL_PRODUCTS using default Indonesian
export const ALL_PRODUCTS = getLocalizedProducts(DEFAULT_PRODUCT_DATA);

// Legacy: Get product by ID (uses default Indonesian)
export const getProductById = (id) =>
  ALL_PRODUCTS.find((p) => p.id === id) || null;

// Legacy: Get products by type (uses default Indonesian)
export const getProductsByType = (type) =>
  ALL_PRODUCTS.filter((p) => p.type === type);

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
].filter(Boolean);
export { DEFAULT_PRODUCT_DATA };
