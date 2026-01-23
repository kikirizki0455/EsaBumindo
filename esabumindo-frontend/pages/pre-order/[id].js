"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Send,
  Phone,
  Mail,
  AlertCircle,
  Package,
  Beaker,
} from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useToast } from "@/components/ui/toast-context";
import { checkRateLimit, recordSubmission } from "@/lib/rate-limiter";
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
  const { t, isHydrated } = useTranslation();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [contactMethod, setContactMethod] = useState("email");
  const [imageError, setImageError] = useState(false);
  const [rateLimitWarning, setRateLimitWarning] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    orderType: "direct", // 'direct' or 'sample'
    fullName: "",
    email: "",
    phone: "",
    company: "",
    industri: "",
    quantityKg: "1", // Quantity in kg
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
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      // Always update form first
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validation for sample order quantity
      if (name === "quantityKg" && formData.orderType === "sample") {
        const numValue = parseFloat(value);
        if (numValue > 100) {
          setSubmitStatus({
            type: "warning",
            message:
              "Jumlah sample maksimal 100 kg. Untuk pesanan lebih besar, silakan pilih Direct Order.",
          });
          return;
        } else {
          // Clear warning if quantity is valid
          setSubmitStatus(null);
        }
      } else if (name === "quantityKg") {
        // Clear warning for direct orders
        setSubmitStatus(null);
      }

      // Check rate limit warning when email changes
      if (name === "email" && value) {
        const rateLimitStatus = checkRateLimit(value);
        if (!rateLimitStatus.allowed) {
          setRateLimitWarning(rateLimitStatus);
        } else if (rateLimitStatus.remaining < 2) {
          setRateLimitWarning(rateLimitStatus);
        } else {
          setRateLimitWarning(null);
        }
      }
    },
    [formData.orderType]
  );

  // Handle order type change
  const handleOrderTypeChange = useCallback((type) => {
    setFormData((prev) => ({
      ...prev,
      orderType: type,
      // Reset quantity when changing order type
      quantityKg: type === "sample" ? "1" : "1",
    }));
    setSubmitStatus(null);
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
          toast.error(t("products.preOrder.requiredFields"));
          setIsSubmitting(false);
          return;
        }

        // Check rate limit
        const rateLimitStatus = checkRateLimit(formData.email);
        if (!rateLimitStatus.allowed) {
          toast.error(rateLimitStatus.message);
          setIsSubmitting(false);
          return;
        }

        // Validate quantity for sample
        if (formData.orderType === "sample") {
          const qty = parseFloat(formData.quantityKg);
          if (isNaN(qty) || qty < 1 || qty > 100) {
            toast.error("Jumlah sample harus antara 1-100 kg");
            setIsSubmitting(false);
            return;
          }
        } else {
          const qty = parseFloat(formData.quantityKg);
          if (isNaN(qty) || qty < 1) {
            toast.error("Jumlah pesanan harus lebih dari 0 kg");
            setIsSubmitting(false);
            return;
          }
        }

        // Show loading toast
        const loadingToastId = toast.loading(
          "📤 Mengirim pesanan Anda, mohon tunggu..."
        );

        // Send to API
        const response = await fetch("/api/pre-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderType: formData.orderType,
            product: product?.name,
            productId: product?.id,
            customerName: formData.fullName,
            customerEmail: formData.email,
            customerPhone: formData.phone,
            company: formData.company,
            industri: formData.industri,
            quantityKg: parseFloat(formData.quantityKg),
            packaging: formData.packaging,
            message: formData.message,
            contactMethod,
            timestamp: new Date().toISOString(),
            rateLimitStatus,
          }),
        });

        let responseData = {};
        try {
          responseData = await response.json();
        } catch (parseError) {
          console.error("JSON parse error:", parseError);
          responseData = { message: "Invalid server response" };
        }

        if (!response.ok) {
          // Remove loading toast
          toast.removeToast(loadingToastId);

          // Handle rate limit error
          if (response.status === 429) {
            const retryAfter = responseData?.retryAfter || 5;
            toast.error(
              `⏱️ ${
                responseData?.message || "Terlalu banyak permintaan"
              } (Coba lagi dalam ${retryAfter} menit)`
            );
            setIsSubmitting(false);
            return;
          }

          const errorMessage =
            responseData?.message || `Server error: ${response.status}`;
          toast.error(`❌ Error: ${errorMessage}`);
          setSubmitStatus({
            type: "error",
            message: errorMessage,
          });
          setIsSubmitting(false);
          return;
        }

        // Record submission in localStorage
        recordSubmission(formData.email);

        // Remove loading toast and show success
        toast.removeToast(loadingToastId);
        toast.success(
          `✅ ${
            formData.orderType === "sample"
              ? "Permintaan sample"
              : "Pesanan langsung"
          } berhasil dikirim! Tim kami akan menghubungi Anda segera.`
        );

        setSubmitStatus({
          type: "success",
          message: t("products.preOrder.successMessage"),
        });

        // Reset form
        setFormData({
          orderType: "direct",
          fullName: "",
          email: "",
          phone: "",
          company: "",
          industri: "",
          quantityKg: "1",
          packaging: "tong50kg",
          message: "",
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/product");
        }, 3000);
      } catch (error) {
        console.error("Submit error:", error);
        toast.error(`❌ Error: ${error.message}`);
        setSubmitStatus({
          type: "error",
          message: error.message || t("products.preOrder.errorMessage"),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, product, contactMethod, router, t, toast]
  );

  // Handle image error
  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  if (isLoading || !isHydrated) return <PreOrderFormSkeleton />;

  if (!product) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t("products.preOrder.productNotFound")}
            </h1>
            <Link
              href="/product"
              className="inline-block px-6 py-3 bg-[#0c439a] text-white rounded-lg hover:bg-[#0a3478] transition-colors"
            >
              {t("products.productDetail.backToProducts")}
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
              {t("products.preOrder.backButton")}
            </button>
          </div>
        </div>

        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {t("products.preOrder.title")}
            </h1>
            <p className="text-gray-600">{t("products.preOrder.subtitle")}</p>
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
                        : submitStatus.type === "warning"
                        ? "bg-yellow-50 border border-yellow-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <AlertCircle
                      size={20}
                      className={
                        submitStatus.type === "success"
                          ? "text-green-600 shrink-0 mt-0.5"
                          : submitStatus.type === "warning"
                          ? "text-yellow-600 shrink-0 mt-0.5"
                          : "text-red-600 shrink-0 mt-0.5"
                      }
                    />
                    <p
                      className={
                        submitStatus.type === "success"
                          ? "text-green-800"
                          : submitStatus.type === "warning"
                          ? "text-yellow-800"
                          : "text-red-800"
                      }
                    >
                      {submitStatus.message}
                    </p>
                  </div>
                )}

                {/* Rate Limit Warning */}
                {rateLimitWarning && (
                  <div className="mb-6 p-4 rounded-lg flex items-start gap-3 bg-yellow-50 border border-yellow-200">
                    <AlertCircle
                      size={20}
                      className="text-yellow-600 shrink-0 mt-0.5"
                    />
                    <div className="text-yellow-800">
                      <p className="font-semibold mb-1">⚠️ Pemberitahuan</p>
                      <p className="text-sm">{rateLimitWarning.message}</p>
                    </div>
                  </div>
                )}

                {/* Form Section 0: Order Type Selection */}
                <fieldset className="mb-8 pb-8 border-b border-gray-200">
                  <legend className="text-lg font-bold text-gray-900 mb-4">
                    Tipe Pesanan *
                  </legend>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Direct Order Option */}
                    <button
                      type="button"
                      onClick={() => handleOrderTypeChange("direct")}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        formData.orderType === "direct"
                          ? "border-[#0c439a] bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    >
                      <div className="flex items-start gap-3">
                        <Package
                          size={24}
                          className={
                            formData.orderType === "direct"
                              ? "text-[#0c439a]"
                              : "text-gray-400"
                          }
                        />
                        <div className="text-left">
                          <h3
                            className={`font-semibold mb-1 ${
                              formData.orderType === "direct"
                                ? "text-[#0c439a]"
                                : "text-gray-900"
                            }`}
                          >
                            Pesanan Langsung
                          </h3>
                          <p className="text-sm text-gray-600">
                            Pesan produk dalam jumlah besar untuk kebutuhan
                            produksi Anda
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Sample Order Option */}
                    <button
                      type="button"
                      onClick={() => handleOrderTypeChange("sample")}
                      className={`p-6 rounded-lg border-2 transition-all ${
                        formData.orderType === "sample"
                          ? "border-[#ca161e] bg-red-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    >
                      <div className="flex items-start gap-3">
                        <Beaker
                          size={24}
                          className={
                            formData.orderType === "sample"
                              ? "text-[#ca161e]"
                              : "text-gray-400"
                          }
                        />
                        <div className="text-left">
                          <h3
                            className={`font-semibold mb-1 ${
                              formData.orderType === "sample"
                                ? "text-[#ca161e]"
                                : "text-gray-900"
                            }`}
                          >
                            Pengambilan Sample
                          </h3>
                          <p className="text-sm text-gray-600">
                            Coba produk kami terlebih dahulu (Max 100 kg)
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Order Type Info */}
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      formData.orderType === "sample"
                        ? "bg-red-50 border border-red-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    <p
                      className={`text-sm ${
                        formData.orderType === "sample"
                          ? "text-red-800"
                          : "text-blue-800"
                      }`}
                    >
                      {formData.orderType === "sample" ? (
                        <>
                          <strong>📌 Sample Test:</strong> Anda dapat mengambil
                          sample hingga 100 kg untuk memastikan produk kami
                          sesuai dengan kebutuhan Anda sebelum melakukan
                          pembelian dalam jumlah besar.
                        </>
                      ) : (
                        <>
                          <strong>📌 Direct Order:</strong> Pesan langsung dalam
                          jumlah yang Anda butuhkan. Harga akan disesuaikan
                          berdasarkan volume pesanan.
                        </>
                      )}
                    </p>
                  </div>
                </fieldset>

                {/* Form Section 1: Personal Info */}
                <fieldset className="mb-8 pb-8 border-b border-gray-200">
                  <legend className="text-lg font-bold text-gray-900 mb-4">
                    {t("products.preOrder.sections.personalInfo")}
                  </legend>

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        {t("products.preOrder.fields.fullName")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder={t(
                          "products.preOrder.placeholders.fullName"
                        )}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          {t("products.preOrder.fields.email")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder={t(
                            "products.preOrder.placeholders.email"
                          )}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          {t("products.preOrder.fields.phone")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder={t(
                            "products.preOrder.placeholders.phone"
                          )}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* Form Section 2: Company Info */}
                <fieldset className="mb-8 pb-8 border-b border-gray-200">
                  <legend className="text-lg font-bold text-gray-900 mb-4">
                    {t("products.preOrder.sections.companyInfo")}
                  </legend>

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        {t("products.preOrder.fields.company")}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder={t(
                          "products.preOrder.placeholders.company"
                        )}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="industri"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        {t("products.preOrder.fields.industry")}
                      </label>
                      <input
                        type="text"
                        id="industri"
                        name="industri"
                        value={formData.industri}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder={t(
                          "products.preOrder.placeholders.industry"
                        )}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Form Section 3: Order Details */}
                <fieldset className="mb-8 pb-8 border-b border-gray-200">
                  <legend className="text-lg font-bold text-gray-900 mb-4">
                    {t("products.preOrder.sections.orderDetails")}
                  </legend>

                  <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label
                          htmlFor="quantityKg"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          Jumlah (kg){" "}
                          {formData.orderType === "sample" && (
                            <span className="text-gray-500 text-xs">
                              (Max: 100 kg)
                            </span>
                          )}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="quantityKg"
                          name="quantityKg"
                          value={formData.quantityKg}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          min="1"
                          max={
                            formData.orderType === "sample" ? "100" : undefined
                          }
                          step="0.5"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder={
                            formData.orderType === "sample"
                              ? "Contoh: 50"
                              : "Contoh: 100"
                          }
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.orderType === "sample"
                            ? "Minimal 1 kg, maksimal 100 kg untuk pengambilan sample"
                            : "Masukkan jumlah dalam kilogram"}
                        </p>
                      </div>

                      <div>
                        <label
                          htmlFor="packaging"
                          className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                          {t("products.preOrder.fields.packaging")}
                        </label>
                        <select
                          id="packaging"
                          name="packaging"
                          value={formData.packaging}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
                        >
                          <option value="tong50kg">
                            {t("products.preOrder.packaging.tong50kg")}
                          </option>
                          <option value="tong40kg">
                            {t("products.preOrder.packaging.tong40kg")}
                          </option>
                          <option value="drumPolos200kg">
                            {t("products.preOrder.packaging.drumPolos200kg")}
                          </option>
                          <option value="drumTulang200kg">
                            {t("products.preOrder.packaging.drumTulang200kg")}
                          </option>
                          <option value="drumPlastik200kg">
                            {t("products.preOrder.packaging.drumPlastik200kg")}
                          </option>
                          <option value="bulltank1ton">
                            {t("products.preOrder.packaging.bulltank1ton")}
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        {t("products.preOrder.fields.notes")}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c439a] focus:border-transparent transition-all resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder={t("products.preOrder.placeholders.notes")}
                      />
                    </div>

                    {/* Packaging Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm text-blue-900">
                        <strong>
                          ℹ️ {t("products.preOrder.packaging.title")}:
                        </strong>
                        <ul className="mt-2 ml-4 space-y-1 text-xs">
                          <li>
                            • <strong>Tong Dus:</strong>{" "}
                            {t("products.preOrder.packaging.tong50kg")} dan{" "}
                            {t("products.preOrder.packaging.tong40kg")}
                          </li>
                          <li>
                            • <strong>Drum:</strong> 200 kg
                          </li>
                          <li>
                            • <strong>Bulltank:</strong> 1 Ton
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* Contact Method */}
                <div className="mb-8">
                  <ContactMethodSelector
                    contactMethod={contactMethod}
                    onMethodChange={setContactMethod}
                    disabled={isSubmitting}
                    t={t}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#0c439a] to-[#ca161e] text-white py-4 px-6 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:shadow-none"
                >
                  <Send size={20} />
                  {isSubmitting
                    ? t("products.preOrder.submitting")
                    : t("products.preOrder.submitButton")}
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
                  <h3 className="text-sm text-gray-600 mb-1">
                    {t("products.preOrder.product")}
                  </h3>
                  <h2 className="text-xl font-bold text-gray-900">
                    {product.name}
                  </h2>
                </div>

                {/* Product Details */}
                <div className="space-y-3 py-4 border-t border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("products.preOrder.category")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("products.preOrder.type")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {product.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {t("products.preOrder.application")}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {product.application}
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {t("products.preOrder.advantages")}
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
                    {t("products.preOrder.needHelp")}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <a
                      href={`mailto:${t(
                        "products.preOrder.helpSection.email"
                      )}`}
                      className="flex items-center gap-2 text-[#0c439a] hover:text-[#0a3478] transition-colors"
                    >
                      <Mail size={16} />
                      <span>{t("products.preOrder.helpSection.email")}</span>
                    </a>
                    <a
                      href={`https://wa.me/62${t(
                        "products.preOrder.helpSection.phone"
                      )
                        .replace(/\D/g, "")
                        .slice(-10)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#0c439a] hover:text-[#0a3478] transition-colors"
                    >
                      <Phone size={16} />
                      <span>{t("products.preOrder.helpSection.phone")}</span>
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
