"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Head from "next/head";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  Loader2,
  Shield,
} from "lucide-react";
import MainLayout from "./layouts/main-layout";
import { useTranslation } from "@/hooks/use-translation";
import {
  generatePageMeta,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo-utils";

// ✅ SEO Meta Data untuk Contact Page
const seoMeta = generatePageMeta({
  title: "Hubungi Kami - Esabumindo Chemical Adhesive",
  description:
    "Hubungi tim Esabumindo untuk konsultasi produk adhesive. Kami siap membantu kebutuhan adhesive Anda dengan layanan pelanggan terbaik.",
  keywords:
    "hubungi esabumindo, kontak adhesive, customer service, konsultasi produk",
  image: "https://esabumindo.com/og-contact.png",
  url: "https://esabumindo.com/contact",
  type: "website",
});

// ✅ Breadcrumb Schema
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Contact", url: "https://esabumindo.com/contact" },
]);

// Skeleton Loading Component
const SkeletonLoader = ({ className = "" }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export default function ContactUsPage() {
  const { t, isHydrated } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setSubmitStatus(null);

      try {
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
          }/email/contact`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setSubmitStatus({
            type: "success",
            message: t("contact.contactForm.statusMessages.success.message"),
          });
          setFormData({ name: "", email: "", phone: "", message: "" });
        } else if (response.status === 429) {
          setSubmitStatus({
            type: "ratelimit",
            message:
              result.message ||
              t("contact.contactForm.statusMessages.rateLimit.message"),
          });
        } else if (response.status === 400) {
          setSubmitStatus({
            type: "warning",
            message:
              result.message ||
              t("contact.contactForm.statusMessages.spam.message"),
          });
        } else {
          setSubmitStatus({
            type: "error",
            message:
              result.message ||
              t("contact.contactForm.statusMessages.error.message"),
          });
        }
      } catch (error) {
        setSubmitStatus({
          type: "error",
          message: t(
            "contact.contactForm.statusMessages.connectionError.message"
          ),
        });
      } finally {
        setIsLoading(false);
      }
    },
    [formData, t]
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "ratelimit":
        return "⏱️";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const getStatusColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-800 border-green-200";
      case "ratelimit":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "warning":
        return "bg-orange-50 text-orange-800 border-orange-200";
      case "error":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  if (!isHydrated) {
    return <SkeletonLoader className="w-full h-screen" />;
  }

  // Get FAQ items from translations
  const faqData = t("contact.faq.items") || [];

  // ✅ Generate FAQ Schema
  const faqSchema = generateFAQSchema(
    Array.isArray(faqData)
      ? faqData.map((faq) => ({
          question: faq.question,
          answer: faq.answer,
        }))
      : []
  );

  return (
    <>
      <Head>
        <title>{seoMeta.title}</title>
        <meta name="description" content={seoMeta.description} />
        <meta name="keywords" content={seoMeta.keywords} />
        <meta name="author" content={seoMeta.author} />
        <meta name="viewport" content={seoMeta.viewport} />
        <meta name="robots" content={seoMeta.robots} />

        {/* Open Graph */}
        <meta property="og:title" content={seoMeta.openGraph.title} />
        <meta
          property="og:description"
          content={seoMeta.openGraph.description}
        />
        <meta property="og:type" content={seoMeta.openGraph.type} />
        <meta property="og:url" content={seoMeta.openGraph.url} />
        <meta property="og:image" content={seoMeta.openGraph.images[0].url} />
        <meta property="og:site_name" content={seoMeta.openGraph.siteName} />

        {/* Twitter */}
        <meta name="twitter:card" content={seoMeta.twitter.card} />
        <meta name="twitter:title" content={seoMeta.twitter.title} />
        <meta
          name="twitter:description"
          content={seoMeta.twitter.description}
        />

        {/* Canonical */}
        <link rel="canonical" href={seoMeta.canonical} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <MainLayout>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          {/* Hero Section dengan Image */}
          <section className="relative h-64 md:h-96 lg:h-[450px] overflow-hidden bg-gradient-to-r from-blue-900 to-blue-700">
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            {!isImageLoaded && <SkeletonLoader className="absolute inset-0" />}
            <Image
              src="/asset/contact-hero.jpg"
              alt={t("contact.heroSection.title")}
              fill
              className="object-cover"
              priority
              onLoadingComplete={() => setIsImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
            <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                  {t("contact.heroSection.title")}
                </h1>
                <p className="text-lg md:text-xl opacity-90 animate-fade-in-delay">
                  {t("contact.heroSection.description")}
                </p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="py-12 md:py-20 lg:py-24">
            <div className="container mx-auto px-4">
              {/* Anti-Spam Notice */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>{t("contact.antiSpamNotice.title")}</strong>{" "}
                    {t("contact.antiSpamNotice.message")}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Contact Form */}
                <Card className="shadow-2xl hover:shadow-3xl transition-shadow duration-300 border-0">
                  <CardContent className="p-6 md:p-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 flex items-center">
                      <span className="text-3xl mr-3">✉️</span>
                      {t("contact.contactForm.title")}
                    </h2>

                    {submitStatus && (
                      <div
                        className={`mb-6 p-4 rounded-lg text-sm font-medium transition-all duration-300 border flex items-start gap-3 ${getStatusColor(
                          submitStatus.type
                        )}`}
                      >
                        <span className="text-xl flex-shrink-0">
                          {getStatusIcon(submitStatus.type)}
                        </span>
                        <div className="flex-1">
                          {submitStatus.message}
                          {submitStatus.type === "ratelimit" && (
                            <div className="mt-2 text-xs opacity-75">
                              {t(
                                "contact.contactForm.statusMessages.rateLimit.tip"
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-semibold">
                          {t("contact.contactForm.fields.name.label")}
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder={t(
                            "contact.contactForm.fields.name.placeholder"
                          )}
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="font-semibold">
                            {t("contact.contactForm.fields.email.label")}
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t(
                              "contact.contactForm.fields.email.placeholder"
                            )}
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="font-semibold">
                            {t("contact.contactForm.fields.phone.label")}
                          </Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder={t(
                              "contact.contactForm.fields.phone.placeholder"
                            )}
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className="font-semibold">
                          {t("contact.contactForm.fields.message.label")}
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder={t(
                            "contact.contactForm.fields.message.placeholder"
                          )}
                          value={formData.message}
                          onChange={handleChange}
                          minLength={10}
                          required
                          rows={6}
                          className="w-full resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {t("contact.contactForm.fields.message.hint")}
                        </p>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            {t("contact.contactForm.submittingButton")}
                          </>
                        ) : (
                          t("contact.contactForm.submitButton")
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-6">
                  <Card className="shadow-2xl border-0">
                    <CardContent className="p-6 md:p-10">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 flex items-center">
                        <span className="text-3xl mr-3">🏢</span>
                        {t("contact.contactInfo.company.title")}
                      </h2>
                      <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
                        {t("contact.contactInfo.company.description")}
                      </p>

                      <div className="space-y-6">
                        {/* Address */}
                        <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                          <div className="shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {t("contact.contactInfo.address.title")}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {t("contact.contactInfo.address.line1")}
                              <br />
                              {t("contact.contactInfo.address.line2")}
                              <br />
                              {t("contact.contactInfo.address.line3")}
                            </p>
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                          <div className="shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Phone className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {t("contact.contactInfo.phone.title")}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              <a
                                href="tel:+622112345678"
                                className="hover:text-green-600 transition"
                              >
                                {t("contact.contactInfo.phone.number1")}
                              </a>
                            </p>
                            <p className="text-gray-600 text-sm">
                              <a
                                href="tel:+6281234567890"
                                className="hover:text-green-600 transition"
                              >
                                {t("contact.contactInfo.phone.number2")}
                              </a>
                            </p>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
                          <div className="shrink-0 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Mail className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {t("contact.contactInfo.email.title")}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              <a
                                href="mailto:info@esabumindo.com"
                                className="hover:text-red-600 transition"
                              >
                                {t("contact.contactInfo.email.address1")}
                              </a>
                            </p>
                            <p className="text-gray-600 text-sm">
                              <a
                                href="mailto:cs@esabumindo.com"
                                className="hover:text-red-600 transition"
                              >
                                {t("contact.contactInfo.email.address2")}
                              </a>
                            </p>
                          </div>
                        </div>

                        {/* Working Hours */}
                        <div className="flex items-start space-x-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                          <div className="shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {t("contact.contactInfo.hours.title")}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {t("contact.contactInfo.hours.weekday")}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {t("contact.contactInfo.hours.saturday")}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {t("contact.contactInfo.hours.closed")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Map Card */}
                  <Card className="shadow-2xl border-0 overflow-hidden">
                    <div className="h-64 md:h-80 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                      {!isImageLoaded && (
                        <SkeletonLoader className="absolute inset-0" />
                      )}
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen=""
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322259!2d106.8227!3d-6.2088!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34a9d%3A0x5b45e834860066e0!2sJakarta%20Selatan!5e0!3m2!1sid!2sid!4v1234567890"
                        onLoad={() => setIsImageLoaded(true)}
                      ></iframe>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12 md:py-20 lg:py-24 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    {t("contact.faq.title")}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {t("contact.faq.description")}
                  </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-3">
                  {Array.isArray(faqData) &&
                    faqData.map((faq) => (
                      <div
                        key={faq.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors duration-200"
                      >
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-left"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base md:text-lg">
                              {faq.question}
                            </h3>
                            <span className="text-xs font-medium text-blue-600 mt-1 inline-block">
                              {faq.category}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 flex-shrink-0 ml-4 ${
                              expandedFaq === faq.id
                                ? "transform rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                        {expandedFaq === faq.id && (
                          <div className="px-6 py-4 bg-white border-t border-gray-200 animate-in fade-in duration-300">
                            <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {/* CTA After FAQ */}
                <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t("contact.faq.cta.title")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t("contact.faq.cta.description")}
                  </p>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    {t("contact.faq.cta.button")}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </MainLayout>
    </>
  );
}
