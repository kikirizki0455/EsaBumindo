// utils/product-features-map.js
// Dynamic feature generation based on product category and application

export const PRODUCT_FEATURES_MAP = {
  // ─── ALL ACRYLIC ───────────────────────────────────────────────
  "All Acrylic": {
    base: [
      {
        icon: "🌦️",
        label: "Weather Resistant",
        desc: "Maintains bonding strength under UV, rain, and temperature changes",
      },
      {
        icon: "💧",
        label: "Water Resistant",
        desc: "Excellent resistance to moisture and humidity",
      },
      {
        icon: "✨",
        label: "High Gloss Film",
        desc: "Forms a clear, glossy film after drying",
      },
    ],
    byApplication: {
      "Dry Lamination": [
        {
          icon: "🔗",
          label: "High Bonding Strength",
          desc: "Strong and durable bond between laminated layers",
        },
        {
          icon: "⚡",
          label: "Consistent Performance",
          desc: "Stable viscosity for reliable coating processes",
        },
        {
          icon: "🏭",
          label: "Production Efficiency",
          desc: "Supports high-speed lamination lines",
        },
      ],
      Sablon: [
        {
          icon: "🎨",
          label: "Excellent Rub Fastness",
          desc: "Color and pattern durability after washing",
        },
        {
          icon: "🧵",
          label: "Textile Compatibility",
          desc: "Bonds well with various fabric types",
        },
        {
          icon: "💪",
          label: "Flexibility After Cure",
          desc: "Maintains soft hand-feel on fabric",
        },
      ],
      Waterproofing: [
        {
          icon: "🛡️",
          label: "Full Waterproof Barrier",
          desc: "Creates a continuous waterproof membrane",
        },
        {
          icon: "🔵",
          label: "Transparent Film",
          desc: "Dries to a clear, blueish-transparent finish",
        },
        {
          icon: "🧱",
          label: "Surface Adhesion",
          desc: "Strong adhesion to concrete, mortar, and masonry",
        },
      ],
    },
  },

  // ─── PVAC ──────────────────────────────────────────────────────
  PVAC: {
    base: [
      {
        icon: "🪵",
        label: "Proven Wood Adhesive",
        desc: "Trusted formulation for woodworking applications",
      },
      {
        icon: "⏱️",
        label: "Fast Setting",
        desc: "Reduces assembly time and increases production throughput",
      },
      {
        icon: "💧",
        label: "Water-Based & Safe",
        desc: "Low VOC, safe for indoor woodworking environments",
      },
    ],
    byApplication: {
      "Middle to Hard Wood": [
        {
          icon: "💪",
          label: "High Shear Strength",
          desc: "Handles stress in hardwood joints and furniture frames",
        },
        {
          icon: "🔗",
          label: "Formica & Laminate Ready",
          desc: "Bonds decorative laminates to wood substrates",
        },
        {
          icon: "🏗️",
          label: "Structural Bonding",
          desc: "Suitable for laminated timber construction",
        },
      ],
      "Soft to Middle Wood": [
        {
          icon: "🤸",
          label: "Good Flexibility",
          desc: "Accommodates slight wood movement without cracking",
        },
        {
          icon: "🛋️",
          label: "Furniture Grade",
          desc: "Ideal for furniture assembly and joinery",
        },
        {
          icon: "⚡",
          label: "Easy Application",
          desc: "Smooth spreading even on porous soft wood surfaces",
        },
      ],
      "Paper Core": [
        {
          icon: "📦",
          label: "Strong Initial Tack",
          desc: "Grips immediately for fast winding and forming",
        },
        {
          icon: "🔄",
          label: "Low Viscosity Flow",
          desc: "Easy application through rollers and nozzles",
        },
        {
          icon: "📄",
          label: "Paper-to-Paper Bonding",
          desc: "Reliable adhesion for tube and core manufacturing",
        },
      ],
      "Paper Overlay": [
        {
          icon: "🎭",
          label: "Foam-to-Fabric Ready",
          desc: "Versatile bonding for composite material applications",
        },
        {
          icon: "✂️",
          label: "Clean Lamination",
          desc: "Smooth, bubble-free overlay bonding",
        },
        {
          icon: "🤸",
          label: "Flexible Film",
          desc: "Remains pliable after bonding to avoid delamination",
        },
      ],
      Furniture: [
        {
          icon: "🛋️",
          label: "Foam & Fabric Bonding",
          desc: "Strong adhesion between foam cushions and upholstery",
        },
        {
          icon: "🏠",
          label: "Interior Grade",
          desc: "Suitable for closed indoor environments",
        },
        {
          icon: "📐",
          label: "High Viscosity Control",
          desc: "Stays in place for vertical surface applications",
        },
      ],
      "Paper Corrugated": [
        {
          icon: "📦",
          label: "Carton Lamination",
          desc: "Reliable bonding for corrugated box manufacturing",
        },
        {
          icon: "🔄",
          label: "Continuous Line Ready",
          desc: "Stable performance on corrugator machines",
        },
        {
          icon: "🌿",
          label: "Recyclable Compatible",
          desc: "Water-based formula supports eco-friendly packaging",
        },
      ],
      Efflute: [
        {
          icon: "🏗️",
          label: "Honeycomb & Pallet Ready",
          desc: "Bonds paper honeycomb, pallets, and cardboard structures",
        },
        {
          icon: "⚡",
          label: "Low Viscosity Flow",
          desc: "Easy rollcoat or spray application on flat surfaces",
        },
        {
          icon: "📐",
          label: "Structural Paper Bonding",
          desc: "Maintains integrity under compressive loads",
        },
      ],
      "Joint Flap Paper - Paper": [
        {
          icon: "🔗",
          label: "Paper-to-Paper Sealing",
          desc: "Secure bonding for box flaps and paper seams",
        },
        {
          icon: "⏱️",
          label: "Fast Tack",
          desc: "Quick grab reduces holding time on assembly lines",
        },
        {
          icon: "📋",
          label: "General Industrial Use",
          desc: "Versatile formula for various paper lamination needs",
        },
      ],
    },
  },

  // ─── STYRENA ───────────────────────────────────────────────────
  Styrena: {
    base: [
      {
        icon: "🎨",
        label: "Excellent Pigment Compatibility",
        desc: "Binds well with a wide range of colorants and extenders",
      },
      {
        icon: "✨",
        label: "High Gloss Finish",
        desc: "Produces a bright, glossy surface after drying",
      },
      {
        icon: "🌦️",
        label: "Weather & UV Resistant",
        desc: "Stable performance under outdoor exposure",
      },
    ],
    byApplication: {
      "Flexo Ink": [
        {
          icon: "🖨️",
          label: "Flexographic Ink Diluent",
          desc: "Optimizes ink viscosity for precise print control",
        },
        {
          icon: "📄",
          label: "Paper & Paperboard Ready",
          desc: "Excellent adhesion on coated and uncoated substrates",
        },
        {
          icon: "🔵",
          label: "High Tg Formula",
          desc: "Prevents ink smearing and blocking during stacking",
        },
      ],
      Sablon: [
        {
          icon: "💪",
          label: "Excellent Rub Fastness",
          desc: "Withstands repeated washing without color loss",
        },
        {
          icon: "🧵",
          label: "Textile Printing Binder",
          desc: "Designed specifically for screen printing on fabric",
        },
        {
          icon: "💧",
          label: "Water Resistant Print",
          desc: "Durable print even after wet exposure",
        },
      ],
      "Metal Roof": [
        {
          icon: "🏠",
          label: "Metal Adhesion",
          desc: "Strong bond to metal surfaces, resists peeling",
        },
        {
          icon: "🌧️",
          label: "Rain & Corrosion Barrier",
          desc: "Protects metal roofing from moisture and rust",
        },
        {
          icon: "🖌️",
          label: "Easy Brushability",
          desc: "Smooth application by brush, roller, or spray",
        },
      ],
      "Foam Laminated": [
        {
          icon: "🤸",
          label: "Superior Film Flexibility",
          desc: "Film stays pliable and won't crack under foam flexing",
        },
        {
          icon: "🔗",
          label: "Strong Foam-to-Material Bond",
          desc: "Reliable adhesion between foam and fabric/film layers",
        },
        {
          icon: "⚡",
          label: "Process Compatible",
          desc: "Suitable for roll lamination and press bonding",
        },
      ],
      Waterproofing: [
        {
          icon: "🛡️",
          label: "High Binding Power",
          desc: "Locks pigments and extenders for a dense waterproof coat",
        },
        {
          icon: "🧽",
          label: "Scrub Resistant",
          desc: "Maintains surface integrity under repeated cleaning",
        },
        {
          icon: "🎨",
          label: "Pigment Compatibility",
          desc: "Compatible with cement-based and polymer-modified systems",
        },
      ],
      Coating: [
        {
          icon: "🏗️",
          label: "Industrial Coating Binder",
          desc: "High solid content for durable protective coatings",
        },
        {
          icon: "💪",
          label: "Strong Adhesion",
          desc: "Adheres firmly to metal, concrete, and board surfaces",
        },
        {
          icon: "🌊",
          label: "Water Resistance",
          desc: "Creates a water-resistant protective layer",
        },
      ],
    },
  },

  // ─── EVA ───────────────────────────────────────────────────────
  EVA: {
    base: [
      {
        icon: "🔗",
        label: "Versatile Adhesion",
        desc: "Bonds paper, plastic, wood, and PVC substrates",
      },
      {
        icon: "💪",
        label: "Strong Initial Tack",
        desc: "Fast grab on contact, reducing clamp time",
      },
      {
        icon: "💧",
        label: "Water-Based Formula",
        desc: "Safe, low-odor adhesive suitable for enclosed spaces",
      },
    ],
    byApplication: {
      "Wet Lamination": [
        {
          icon: "📦",
          label: "Packaging Lamination",
          desc: "Ideal for multi-layer packaging and bookbinding",
        },
        {
          icon: "🏗️",
          label: "Plastic-to-Paper Ready",
          desc: "Bonds plastic film to paper reliably",
        },
        {
          icon: "⚡",
          label: "Good Flow Properties",
          desc: "Easy application by roller or curtain coater",
        },
      ],
      "Joint Flap": [
        {
          icon: "🔗",
          label: "High Peel Strength",
          desc: "Resists delamination on coated and laminated surfaces",
        },
        {
          icon: "🎯",
          label: "Nozzle Application Ready",
          desc: "Low-viscosity option for precise nozzle application",
        },
        {
          icon: "📄",
          label: "Smooth Surface Bonding",
          desc: "Reliable bond to PE-coated and glossy paper surfaces",
        },
      ],
      "Paper - Aluminium Lamination": [
        {
          icon: "🥇",
          label: "Aluminium Foil Bonding",
          desc: "Strong adhesion between paper and aluminium substrates",
        },
        {
          icon: "🌊",
          label: "Moisture Barrier Support",
          desc: "Helps maintain laminate integrity in humid conditions",
        },
        {
          icon: "🏭",
          label: "Industrial Line Compatible",
          desc: "Suitable for high-speed lamination processes",
        },
      ],
    },
  },

  // ─── PSA ───────────────────────────────────────────────────────
  PSA: {
    base: [
      {
        icon: "👆",
        label: "Pressure Sensitive",
        desc: "Bonds on contact without heat or solvent activation",
      },
      {
        icon: "🔵",
        label: "High Immediate Tack",
        desc: "Sticks instantly to smooth and semi-porous surfaces",
      },
      {
        icon: "💪",
        label: "High Peel Strength",
        desc: "Maintains bond integrity even under peel stress",
      },
    ],
    byApplication: {
      Label: [
        {
          icon: "🏷️",
          label: "Label-Grade Adhesion",
          desc: "Stays firmly on bottles, boxes, and general surfaces",
        },
        {
          icon: "🔄",
          label: "Roll Coat Compatible",
          desc: "Smooth application in high-speed label coating lines",
        },
        {
          icon: "📐",
          label: "Good Cohesion",
          desc: "No adhesive transfer or residue when label is removed",
        },
      ],
      "Joint Flap Paper - Plastic": [
        {
          icon: "🔗",
          label: "Paper-to-Plastic Sealing",
          desc: "Strong bond on coated, laminated, and plastic surfaces",
        },
        {
          icon: "⚡",
          label: "Fast Roll Application",
          desc: "Optimized for roller-coating on packaging lines",
        },
        {
          icon: "💪",
          label: "High Cohesive Strength",
          desc: "Maintains flap closure integrity during shipping",
        },
      ],
    },
  },

  // ─── VINYL ─────────────────────────────────────────────────────
  Vinyl: {
    base: [
      {
        icon: "🎨",
        label: "Excellent Color Acceptance",
        desc: "Works with a wide range of pigments for paint industry",
      },
      {
        icon: "💧",
        label: "Water & Moisture Resistant",
        desc: "Provides durable water resistance after film formation",
      },
      {
        icon: "🔗",
        label: "Strong Surface Adhesion",
        desc: "Bonds well to a variety of substrates",
      },
    ],
    byApplication: {
      Coating: [
        {
          icon: "🏗️",
          label: "Paint Industry Ready",
          desc: "High solid content for efficient paint formulation",
        },
        {
          icon: "🤸",
          label: "Good Elasticity",
          desc: "Accommodates surface expansion without cracking",
        },
        {
          icon: "✨",
          label: "Smooth Film Formation",
          desc: "Creates a uniform, aesthetically clean coating layer",
        },
      ],
    },
  },
};

/**
 * Get feature points for a product based on its category and application
 * Returns a merged list of base (category-level) + application-specific features
 */
export function getProductFeatures(category, application) {
  const categoryData = PRODUCT_FEATURES_MAP[category];
  if (!categoryData) return [];

  const baseFeatures = categoryData.base || [];
  const appFeatures = categoryData.byApplication?.[application] || [];

  // Merge: prefer app-specific, fill remaining from base
  // Total max 5 points for readability
  const combined = [...appFeatures, ...baseFeatures];
  const seen = new Set();
  const unique = combined.filter((f) => {
    if (seen.has(f.label)) return false;
    seen.add(f.label);
    return true;
  });

  return unique.slice(0, 5);
}
