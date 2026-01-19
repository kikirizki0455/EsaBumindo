// prisma/seed-articles.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding articles...');

  // Sample articles
  const articles = [
    {
      title: 'Keunggulan Adhesive Berkualitas untuk Aplikasi Industri',
      slug: 'keunggulan-adhesive-berkualitas',
      content: `
        <h2>Mengapa Memilih Adhesive Berkualitas?</h2>
        <p>Adhesive berkualitas tinggi menjadi kunci dalam berbagai aplikasi industri modern. Dalam artikel ini, kami akan membahas mengapa pemilihan adhesive yang tepat sangat penting untuk kesuksesan proyek Anda.</p>
        
        <h3>1. Daya Rekat Superior</h3>
        <p>Adhesive berkualitas menawarkan daya rekat yang konsisten dan tahan lama, bahkan dalam kondisi ekstrem seperti suhu tinggi atau kelembaban tinggi.</p>
        
        <h3>2. Efisiensi Produksi</h3>
        <p>Dengan menggunakan adhesive yang tepat, proses produksi menjadi lebih cepat dan efisien, mengurangi downtime dan meningkatkan output.</p>
        
        <h3>3. Aplikasi yang Beragam</h3>
        <p>Dari industri otomotif hingga elektronik, adhesive berkualitas dapat diaplikasikan pada berbagai material dan kondisi kerja.</p>
      `,
      excerpt:
        'Pelajari mengapa adhesive berkualitas tinggi sangat penting untuk kesuksesan aplikasi industri Anda.',
      author: 'PT Esabumindo',
      status: 'published',
      publishedAt: new Date('2025-01-15'),
    },
    {
      title: 'Panduan Memilih Adhesive yang Tepat untuk Proyek Anda',
      slug: 'panduan-memilih-adhesive',
      content: `
        <h2>Faktor-Faktor Penting dalam Pemilihan Adhesive</h2>
        <p>Memilih adhesive yang tepat memerlukan pertimbangan berbagai faktor untuk memastikan hasil optimal.</p>
        
        <h3>Material yang Akan Direkatkan</h3>
        <p>Jenis material sangat mempengaruhi pemilihan adhesive. Material logam, plastik, kayu, atau kaca masing-masing memerlukan formula adhesive yang berbeda.</p>
        
        <h3>Kondisi Lingkungan</h3>
        <p>Pertimbangkan suhu, kelembaban, dan paparan bahan kimia di lingkungan aplikasi.</p>
        
        <h3>Kekuatan yang Dibutuhkan</h3>
        <p>Tentukan beban dan tekanan yang akan ditanggung oleh sambungan adhesive.</p>
      `,
      excerpt:
        'Tips praktis untuk memilih adhesive yang sesuai dengan kebutuhan spesifik proyek industri Anda.',
      author: 'Tim Teknis Esabumindo',
      status: 'published',
      publishedAt: new Date('2025-01-10'),
    },
    {
      title: 'Inovasi Terbaru dalam Teknologi Adhesive',
      slug: 'inovasi-teknologi-adhesive',
      content: `
        <h2>Perkembangan Terkini di Industri Adhesive</h2>
        <p>Industri adhesive terus berinovasi untuk memenuhi tuntutan aplikasi modern yang semakin kompleks.</p>
        
        <h3>Adhesive Ramah Lingkungan</h3>
        <p>Formula baru yang mengurangi VOC (Volatile Organic Compounds) tanpa mengorbankan performa.</p>
        
        <h3>Adhesive Struktural Berteknologi Tinggi</h3>
        <p>Pengembangan adhesive yang mampu menggantikan metode penyambungan tradisional seperti welding dan riveting.</p>
      `,
      excerpt:
        'Temukan inovasi terbaru dalam teknologi adhesive yang mengubah cara industri bekerja.',
      author: 'R&D Team',
      status: 'draft',
    },
  ];

  // Insert articles
  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    });
  }

  console.log('✅ Articles seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding articles:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
