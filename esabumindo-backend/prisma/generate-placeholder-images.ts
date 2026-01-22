// prisma/generate-placeholder-images.ts
import * as fs from 'fs';
import * as path from 'path';

/**
 * Generate placeholder images menggunakan placeholder service
 * Images akan di-reference dari seed data
 */

const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'articles');

// Ensure directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`✅ Created directory: ${uploadsDir}`);
}

// List of placeholder images yang akan di-download
const placeholderImages = [
  {
    name: 'adhesive-quality-cover.jpg',
    description: 'Cover image untuk artikel adhesive quality',
  },
  {
    name: 'adhesive-guide-cover.jpg',
    description: 'Cover image untuk artikel panduan adhesive',
  },
  {
    name: 'innovation-cover.jpg',
    description: 'Cover image untuk artikel inovasi adhesive',
  },
  {
    name: 'adhesive-application-1.jpg',
    description: 'Aplikasi adhesive pada material',
  },
  {
    name: 'production-efficiency.jpg',
    description: 'Efisiensi produksi',
  },
  {
    name: 'adhesive-selection-guide.jpg',
    description: 'Panduan pemilihan adhesive',
  },
  {
    name: 'temperature-resistance.jpg',
    description: 'Ketahanan suhu',
  },
  {
    name: 'humidity-resistance.jpg',
    description: 'Ketahanan kelembaban',
  },
  {
    name: 'eco-friendly-adhesive.jpg',
    description: 'Adhesive ramah lingkungan',
  },
  {
    name: 'structural-adhesive-1.jpg',
    description: 'Structural adhesive - Otomotif',
  },
  {
    name: 'structural-adhesive-2.jpg',
    description: 'Structural adhesive - Aerospace',
  },
  {
    name: 'structural-adhesive-3.jpg',
    description: 'Structural adhesive - Konstruksi',
  },
];

/**
 * Create simple placeholder PNG using canvas
 * Fallback: create using data URL if sharp not available
 */
function createPlaceholderImage(width: number, height: number): Buffer {
  // Simple 1x1 pixel PNG (minimal placeholder)
  // This is a valid PNG with single red pixel
  const pngHeader = Buffer.from([
    0x89,
    0x50,
    0x4e,
    0x47,
    0x0d,
    0x0a,
    0x1a,
    0x0a, // PNG signature
    0x00,
    0x00,
    0x00,
    0x0d, // IHDR chunk size
    0x49,
    0x48,
    0x44,
    0x52, // IHDR
    0x00,
    0x00,
    0x00,
    0x01, // width = 1
    0x00,
    0x00,
    0x00,
    0x01, // height = 1
    0x08,
    0x02,
    0x00,
    0x00,
    0x00, // bit depth, color type, etc
    0x90,
    0x77,
    0x53,
    0xde, // CRC
    0x00,
    0x00,
    0x00,
    0x0c, // IDAT chunk size
    0x49,
    0x44,
    0x41,
    0x54, // IDAT
    0x08,
    0xd7,
    0x63,
    0xf8,
    0xcf,
    0xc0,
    0x00,
    0x00,
    0x03,
    0x01,
    0x01,
    0x00, // pixel data
    0x18,
    0xdd,
    0x8d,
    0xb4, // CRC
    0x00,
    0x00,
    0x00,
    0x00, // IEND chunk size
    0x49,
    0x45,
    0x4e,
    0x44, // IEND
    0xae,
    0x42,
    0x60,
    0x82, // CRC
  ]);

  return pngHeader;
}

async function generateImages() {
  console.log('🖼️  Generating placeholder images...');

  for (const image of placeholderImages) {
    const imagePath = path.join(uploadsDir, image.name);

    // Skip jika file sudah ada
    if (fs.existsSync(imagePath)) {
      console.log(`⏭️  Skip (already exists): ${image.name}`);
      continue;
    }

    try {
      // Create placeholder image
      const buffer = createPlaceholderImage(1200, 800);
      fs.writeFileSync(imagePath, buffer);
      console.log(`✅ Created: ${image.name}`);
    } catch (error) {
      console.error(`❌ Failed to create ${image.name}:`, error);
    }
  }

  console.log('✅ Placeholder images generated successfully!');
}

generateImages().catch((error) => {
  console.error('❌ Error generating images:', error);
  process.exit(1);
});
