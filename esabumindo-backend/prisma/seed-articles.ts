// prisma/seed-articles.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding articles...');

  const articles = [
    {
      title: 'Keunggulan Adhesive Berkualitas untuk Aplikasi Industri',
      slug: 'keunggulan-adhesive-berkualitas',
      contentBlocks: [
        {
          type: 'heading',
          content: 'Mengapa Memilih Adhesive Berkualitas?',
        },
        {
          type: 'paragraph',
          content:
            'Adhesive berkualitas tinggi menjadi kunci dalam berbagai aplikasi industri modern. Dalam artikel ini, kami akan membahas mengapa pemilihan adhesive yang tepat sangat penting untuk kesuksesan proyek Anda.',
        },
        {
          type: 'heading',
          content: 'Daya Rekat Superior',
        },
        {
          type: 'paragraph',
          content:
            'Adhesive berkualitas menawarkan daya rekat yang konsisten dan tahan lama, bahkan dalam kondisi ekstrem seperti suhu tinggi atau kelembaban tinggi.',
        },
        {
          type: 'heading',
          content: 'Efisiensi Produksi',
        },
        {
          type: 'paragraph',
          content:
            'Dengan menggunakan adhesive yang tepat, proses produksi menjadi lebih cepat dan efisien, mengurangi downtime dan meningkatkan output.',
        },
        {
          type: 'heading',
          content: 'Aplikasi yang Beragam',
        },
        {
          type: 'paragraph',
          content:
            'Dari industri otomotif hingga elektronik, adhesive berkualitas dapat diaplikasikan pada berbagai material dan kondisi kerja.',
        },
      ],
      excerpt:
        'Pelajari mengapa adhesive berkualitas tinggi sangat penting untuk kesuksesan aplikasi industri Anda.',
      author: 'PT Esabumindo',
      status: 'published',
      publishedAt: new Date('2025-01-15'),
    },

    {
      title: 'Panduan Memilih Adhesive yang Tepat untuk Proyek Anda',
      slug: 'panduan-memilih-adhesive',
      contentBlocks: [
        {
          type: 'heading',
          content: 'Faktor-Faktor Penting dalam Pemilihan Adhesive',
        },
        {
          type: 'paragraph',
          content:
            'Memilih adhesive yang tepat memerlukan pertimbangan berbagai faktor untuk memastikan hasil optimal.',
        },
        {
          type: 'heading',
          content: 'Material yang Akan Direkatkan',
        },
        {
          type: 'paragraph',
          content:
            'Jenis material sangat mempengaruhi pemilihan adhesive. Setiap material memerlukan formula adhesive yang berbeda.',
        },
        {
          type: 'heading',
          content: 'Kondisi Lingkungan',
        },
        {
          type: 'paragraph',
          content:
            'Pertimbangkan suhu, kelembaban, dan paparan bahan kimia di lingkungan aplikasi.',
        },
      ],
      excerpt:
        'Tips praktis untuk memilih adhesive yang sesuai dengan kebutuhan spesifik proyek industri Anda.',
      author: 'Tim Teknis Esabumindo',
      status: 'published',
      publishedAt: new Date('2025-01-10'),
    },

    {
      title: 'Inovasi Terbaru dalam Teknologi Adhesive',
      slug: 'inovasi-teknologi-adhesive',
      contentBlocks: [
        {
          type: 'heading',
          content: 'Perkembangan Terkini di Industri Adhesive',
        },
        {
          type: 'paragraph',
          content:
            'Industri adhesive terus berinovasi untuk memenuhi tuntutan aplikasi modern yang semakin kompleks.',
        },
        {
          type: 'heading',
          content: 'Adhesive Ramah Lingkungan',
        },
        {
          type: 'paragraph',
          content:
            'Formula baru yang mengurangi VOC tanpa mengorbankan performa.',
        },
        {
          type: 'heading',
          content: 'Adhesive Struktural Berteknologi Tinggi',
        },
        {
          type: 'paragraph',
          content:
            'Pengembangan adhesive yang mampu menggantikan metode penyambungan tradisional.',
        },
      ],
      excerpt:
        'Temukan inovasi terbaru dalam teknologi adhesive yang mengubah cara industri bekerja.',
      author: 'R&D Team',
      status: 'draft',
    },
  ];

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
