"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Send, Phone, Mail, AlertCircle } from "lucide-react";
import MainLayout from "../layouts/main-layout";
import { BEST_SELLER_PRODUCTS, NEW_PRODUCTS } from "@/data/products";

// Lazy load components
const PreOrderFormSkeleton = dynamic(
  () => import("@/components/product/pre-order-form-skeleton"),
  { loading: () => <div className="h-screen bg-gray-100 animate-pulse" /> }
);

const ContactMethodSelector = dynamic(
  () => import("@/components/product/contact-method-selector"),
  { loading: () => <div className="h-32 bg-gray-100 animate-pulse" /> }
);

export default function PreOrderPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [contactMethod, setContactMethod] = useState("email");
  const [imageError, setImageError] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    industri: "",
    quantity: "1",
    packaging: "tong50kg",
    message: "",
  });

  // Find product by ID
  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(() => {
      const foundProduct = [...BEST_SELLER_PRODUCTS, ...NEW_PRODUCTS].find(
        (p) => p.id === id
      );
      setProduct(foundProduct || null);
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [id]);

  // Handle form input change
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus(null);

      try {
        // Validate form
        if (
          !formData.fullName ||
          !formData.email ||
          !formData.phone ||
          !formData.company
        ) {
          setSubmitStatus({
            type: "error",
            message: "Mohon isi semua field yang diperlukan",
          });
          setIsSubmitting(false);
          return;
        }

        // Send to API
        const response = await fetch("/api/pre-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product: product?.name,
            productId: product?.id,
            customerName: formData.fullName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            company: formData.company,
            industri: formData.industri,
            quantity: formData.quantity,
            packaging: formData.packaging,
            message: formData.message,
            contactMethod,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) throw new Error("Failed to submit");

        setSubmitStatus({
          type: "success",
          message:
            "Pre-order berhasil dikirim! Tim kami akan menghubungi Anda segera.",
        });

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          company: "",
          industri: "",
          quantity: "1",
          packaging: "tong50kg",
          message: "",
        });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/product");
        }, 2000);
      } catch (error) {
        console.error("Submit error:", error);
        setSubmitStatus({
          type: "error",
          message: "Gagal mengirim pre-order. Silakan coba lagi.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, product, contactMethod, router]
  );

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (isLoading) return <PreOrderFormSkeleton />;

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Produk Tidak Ditemukan
            </h1>
            <Link
              href="/product"
              className="inline-block px-6 py-3 bg-[#0c439a] text-white rounded-lg hover:bg-[#0a3478] transition-colors"
            >
              Kembali ke Produk
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#0c439a] hover:text-[#0a3478] font-semibold transition-colors"
            >
              <ChevronLeft size={20} />
              Kembali
            </button>
          </div>
        </div>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Form Pre-Order
            </h1>
            <p className="text-gray-600">
              Pesan produk pilihan Anda dan dapatkan penawaran khusus
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-lg shadow-md p-8"
              >
                {/* Status Messages */}
                {submitStatus && (
                  <div
                    className={`mb-6 p-4 rounded-lg flex items-start gap-3 ${
                      submitStatus.type === "success"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <AlertCircle
                      size={20}
                      className={
                        submitStatus.type === "success"
                          ? "text-green-600 shrink-0 mt-0.5"
                          : "text-red-600 shrink-0 mt-0.5"
                      }
                    />
                    <p
                      className={
                        submitStatus.type === "success"
                          ? "text-green-800"
                          : "text-red-800"
                      }
                    >
                      {submitStatus.message}
                    </p>
                  </div>
                )}

                {/* Form Section 1: Personal Info */}
                <fieldset className="mb-8 pb-8 border-b border-gray-200">
                  <legend className="text-lg font-bold text-gray-900 mb-4">
                    Informasi Pribadi
                  </legend>

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Masukkan nama lengkap Anda"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="email@example.com"
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Nomor WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="+62 xxx xxxx xxxx"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* Form Section 2: Company Info */}
                <fieldset className="mb-8 pb-8 border-b border-gray-200">
                  <legend className="text-lg font-bold text-gray-900 mb-4">
                    Informasi Perusahaan
                  </legend>

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Nama Perusahaan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="PT. Nama Perusahaan"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="industri"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Industri / Sektor
                      </label>
                      <input
                        type="text"
                        id="industri"
                        name="industri"
                        value={formData.industri}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Contoh: Otomotif, Elektronik, Konstruksi"
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Form Section 3: Order Details */}
                <fieldset className="mb-8 pb-8 border-b border-gray-200">
                  <legend className="text-lg font-bold text-gray-900 mb-4">
                    Detail Pre-Order
                  </legend>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="quantity"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Jumlah (Unit/Karton)
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          min="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="1"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="packaging"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Pilihan Kemasan
                        </label>
                        <select
                          id="packaging"
                          name="packaging"
                          value={formData.packaging}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
                        >
                          <option value="tong50kg">Tong Dus 50 kg</option>
                          <option value="tong40kg">Tong Dus 40 kg</option>
                          <option value="drumPolos200kg">
                            Drum Polos 200 kg
                          </option>
                          <option value="drumTulang200kg">
                            Drum Tulang 200 kg
                          </option>
                          <option value="drumPlastik200kg">
                            Drum Plastik 200 kg
                          </option>
                          <option value="bulltank1ton">Bulltank 1 Ton</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Catatan / Permintaan Khusus
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="Tambahkan catatan khusus atau pertanyaan..."
                      />
                    </div>

                    {/* Packaging Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        <strong>ℹ️ Info Kemasan:</strong>
                        <ul className="mt-2 ml-4 space-y-1 text-xs">
                          <li>
                            • <strong>Tong Dus:</strong> 50 kg dan 40 kg - untuk
                            volume kecil hingga menengah
                          </li>
                          <li>
                            • <strong>Drum:</strong> 200 kg - tersedia dalam
                            berbagai jenis (polos, tulang, plastik)
                          </li>
                          <li>
                            • <strong>Bulltank:</strong> 1 Ton - untuk volume
                            besar dan penggunaan industrial
                          </li>
                        </ul>
                      </p>
                    </div>
                  </div>
                </fieldset>

                {/* Contact Method */}
                <div className="mb-8">
                  <ContactMethodSelector
                    contactMethod={contactMethod}
                    onMethodChange={setContactMethod}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#0c439a] to-[#ca161e] text-white py-4 px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                >
                  <Send size={20} />
                  {isSubmitting ? "Mengirim..." : "Kirim Pre-Order"}
                </button>
              </form>
            </div>

            {/* Sidebar: Product Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 space-y-6">
                {/* Product Image */}
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative flex items-center justify-center">
                  {!imageError ? (
                    <Image
                      src={`/images/products/${product.id}.png`}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                      onError={handleImageError}
                      unoptimized={false}
                    />
                  ) : (
                    <svg
                      className="w-24 h-24 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 200 200"
                    >
                      <rect width="200" height="200" fill="#f3f4f6" />
                      <text
                        x="50%"
                        y="50%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        className="text-gray-400"
                        fontSize="12"
                      >
                        {product.name}
                      </text>
                      <path
                        d="M60 80 L140 80 L140 160 L60 160 Z"
                        fill="none"
                        stroke="#d1d5db"
                        strokeWidth="2"
                      />
                      <circle cx="100" cy="110" r="8" fill="#d1d5db" />
                    </svg>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  <h3 className="text-sm text-gray-600 mb-1">PRODUK</h3>
                  <h2 className="text-xl font-bold text-gray-900">
                    {product.name}
                  </h2>
                </div>

                {/* Product Details */}
                <div className="space-y-3 py-4 border-t border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Kategori</span>
                    <span className="font-semibold text-gray-900">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tipe</span>
                    <span className="font-semibold text-gray-900">
                      {product.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Aplikasi</span>
                    <span className="font-semibold text-gray-900">
                      {product.application}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Keunggulan
                  </h4>
                  <ul className="space-y-2">
                    {product.features?.slice(0, 3).map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-700"
                      >
                        <span className="text-[#ca161e] font-bold mt-0.5">
                          ✓
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact Info Box */}
                <div className="bg-linear-to-br from-[#0c439a]/10 to-[#ca161e]/10 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    Butuh Bantuan?
                  </h4>
                  <div className="space-y-2 text-sm">
                    <a
                      href="mailto:info@esabond.com"
                      className="flex items-center gap-2 text-[#0c439a] hover:text-[#0a3478] transition-colors"
                    >
                      <Mail size={16} />
                      <span>info@esabond.com</span>
                    </a>
                    <a
                      href="https://wa.me/62xxxx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#0c439a] hover:text-[#0a3478] transition-colors"
                    >
                      <Phone size={16} />
                      <span>+62 xxx xxxx xxxx</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );
}
