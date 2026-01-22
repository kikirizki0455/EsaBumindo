// prisma/seed-articles.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding articles...');

  const articles = [
    {
      title: 'Keunggulan Adhesive Berkualitas untuk Aplikasi Industri',
      slug: 'keunggulan-adhesive-berkualitas',
      coverImage: '/uploads/articles/adhesive-quality-cover.jpg',
      contentBlocks: [
        {
          id: 'block-1',
          type: 'heading',
          level: 2,
          content: 'Mengapa Memilih Adhesive Berkualitas?',
        },
        {
          id: 'block-2',
          type: 'paragraph',
          content:
            'Adhesive berkualitas tinggi menjadi kunci dalam berbagai aplikasi industri modern. Dalam artikel ini, kami akan membahas mengapa pemilihan adhesive yang tepat sangat penting untuk kesuksesan proyek Anda.',
        },
        {
          id: 'block-3',
          type: 'image',
          layout: 'single',
          images: [
            {
              url: '/uploads/articles/adhesive-application-1.jpg',
              alt: 'Aplikasi adhesive pada material industri',
              caption:
                'Gambar 1: Aplikasi adhesive pada berbagai material industri',
            },
          ],
        },
        {
          id: 'block-4',
          type: 'heading',
          level: 2,
          content: 'Daya Rekat Superior',
        },
        {
          id: 'block-5',
          type: 'paragraph',
          content:
            'Adhesive berkualitas menawarkan daya rekat yang konsisten dan tahan lama, bahkan dalam kondisi ekstrem seperti suhu tinggi atau kelembaban tinggi.',
        },
        {
          id: 'block-6',
          type: 'heading',
          level: 2,
          content: 'Efisiensi Produksi',
        },
        {
          id: 'block-7',
          type: 'paragraph',
          content:
            'Dengan menggunakan adhesive yang tepat, proses produksi menjadi lebih cepat dan efisien, mengurangi downtime dan meningkatkan output.',
        },
        {
          id: 'block-8',
          type: 'image',
          layout: 'single',
          images: [
            {
              url: '/uploads/articles/production-efficiency.jpg',
              alt: 'Efisiensi proses produksi dengan adhesive berkualitas',
              caption: 'Gambar 2: Peningkatan efisiensi produksi hingga 40%',
            },
          ],
        },
        {
          id: 'block-9',
          type: 'heading',
          level: 2,
          content: 'Aplikasi yang Beragam',
        },
        {
          id: 'block-10',
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
      coverImage: '/uploads/articles/adhesive-guide-cover.jpg',
      contentBlocks: [
        {
          id: 'block-1',
          type: 'heading',
          level: 2,
          content: 'Faktor-Faktor Penting dalam Pemilihan Adhesive',
        },
        {
          id: 'block-2',
          type: 'paragraph',
          content:
            'Memilih adhesive yang tepat memerlukan pertimbangan berbagai faktor untuk memastikan hasil optimal.',
        },
        {
          id: 'block-3',
          type: 'image',
          layout: 'single',
          images: [
            {
              url: '/uploads/articles/adhesive-selection-guide.jpg',
              alt: 'Panduan pemilihan adhesive',
              caption: 'Gambar 1: Flowchart pemilihan adhesive yang tepat',
            },
          ],
        },
        {
          id: 'block-4',
          type: 'heading',
          level: 2,
          content: 'Material yang Akan Direkatkan',
        },
        {
          id: 'block-5',
          type: 'paragraph',
          content:
            'Jenis material sangat mempengaruhi pemilihan adhesive. Setiap material memerlukan formula adhesive yang berbeda. Misalnya, adhesive untuk logam berbeda dengan adhesive untuk plastik atau keramik.',
        },
        {
          id: 'block-6',
          type: 'heading',
          level: 2,
          content: 'Kondisi Lingkungan',
        },
        {
          id: 'block-7',
          type: 'paragraph',
          content:
            'Pertimbangkan suhu, kelembaban, dan paparan bahan kimia di lingkungan aplikasi. Adhesive yang dirancang untuk suhu rendah mungkin tidak cocok untuk aplikasi suhu tinggi.',
        },
        {
          id: 'block-8',
          type: 'image',
          layout: 'double',
          images: [
            {
              url: '/uploads/articles/temperature-resistance.jpg',
              alt: 'Ketahanan suhu adhesive',
              caption: 'Ketahanan suhu berbagai jenis adhesive',
            },
            {
              url: '/uploads/articles/humidity-resistance.jpg',
              alt: 'Ketahanan kelembaban adhesive',
              caption: 'Ketahanan kelembaban berbagai jenis adhesive',
            },
          ],
        },
        {
          id: 'block-9',
          type: 'heading',
          level: 2,
          content: 'Waktu Pengeringan dan Curing',
        },
        {
          id: 'block-10',
          type: 'paragraph',
          content:
            'Waktu yang diperlukan untuk pengeringan dan curing harus sesuai dengan jadwal produksi Anda.',
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
      coverImage: '/uploads/articles/innovation-cover.jpg',
      contentBlocks: [
        {
          id: 'block-1',
          type: 'heading',
          level: 2,
          content: 'Perkembangan Terkini di Industri Adhesive',
        },
        {
          id: 'block-2',
          type: 'paragraph',
          content:
            'Industri adhesive terus berinovasi untuk memenuhi tuntutan aplikasi modern yang semakin kompleks. Teknologi baru terus dikembangkan untuk meningkatkan performa dan sustainability.',
        },
        {
          id: 'block-3',
          type: 'heading',
          level: 2,
          content: 'Adhesive Ramah Lingkungan',
        },
        {
          id: 'block-4',
          type: 'paragraph',
          content:
            'Formula baru yang mengurangi VOC (Volatile Organic Compounds) tanpa mengorbankan performa. Adhesive ramah lingkungan ini memenuhi standar internasional dan regulasi lingkungan yang semakin ketat.',
        },
        {
          id: 'block-5',
          type: 'image',
          layout: 'single',
          images: [
            {
              url: '/uploads/articles/eco-friendly-adhesive.jpg',
              alt: 'Adhesive ramah lingkungan',
              caption: 'Gambar 1: Produk adhesive ramah lingkungan terbaru',
            },
          ],
        },
        {
          id: 'block-6',
          type: 'heading',
          level: 2,
          content: 'Adhesive Struktural Berteknologi Tinggi',
        },
        {
          id: 'block-7',
          type: 'paragraph',
          content:
            'Pengembangan adhesive yang mampu menggantikan metode penyambungan tradisional seperti welding dan riveting. Adhesive struktural ini menawarkan kekuatan yang setara atau lebih baik dengan keuntungan biaya yang lebih rendah.',
        },
        {
          id: 'block-8',
          type: 'image',
          layout: 'grid',
          images: [
            {
              url: '/uploads/articles/structural-adhesive-1.jpg',
              alt: 'Aplikasi structural adhesive pada otomotif',
              caption: 'Otomotif',
            },
            {
              url: '/uploads/articles/structural-adhesive-2.jpg',
              alt: 'Aplikasi structural adhesive pada aerospace',
              caption: 'Aerospace',
            },
            {
              url: '/uploads/articles/structural-adhesive-3.jpg',
              alt: 'Aplikasi structural adhesive pada konstruksi',
              caption: 'Konstruksi',
            },
          ],
        },
        {
          id: 'block-9',
          type: 'heading',
          level: 2,
          content: 'Kesimpulan',
        },
        {
          id: 'block-10',
          type: 'paragraph',
          content:
            'Inovasi dalam teknologi adhesive terus berkembang untuk memenuhi kebutuhan industri modern. PT Esabumindo berkomitmen untuk menyediakan produk adhesive terbaik dengan teknologi terkini.',
        },
      ],
      excerpt:
        'Temukan inovasi terbaru dalam teknologi adhesive yang mengubah cara industri bekerja.',
      author: 'R&D Team',
      status: 'published',
      publishedAt: new Date('2025-01-05'),
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
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
