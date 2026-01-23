"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/use-translation";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const { t, isHydrated } = useTranslation();
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      // TODO: Connect to backend newsletter endpoint
      setSubscribeStatus("success");
      setEmail("");
      setTimeout(() => setSubscribeStatus(null), 3000);
    } catch (error) {
      setSubscribeStatus("error");
      setTimeout(() => setSubscribeStatus(null), 3000);
    }
  };

  if (!isHydrated) return null;

  const footerData = {
    company: t("footer.company") || {},
    quickLinks: t("footer.quickLinks") || {},
    products: t("footer.products") || {},
    company_info: t("footer.company_info") || {},
    support: t("footer.support") || {},
    contact: t("footer.contact") || {},
    social: t("footer.social") || {},
    newsletter: t("footer.newsletter") || {},
    legal: t("footer.legal") || {},
    copyright: t("footer.copyright"),
  };

  const socialIcons = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Newsletter Section */}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded-full" />
              {footerData.company.title}
            </h4>
            <p className="text-slate-300 text-sm leading-relaxed">
              {footerData.company.description}
            </p>

            {/* Social Media - Mobile Visible */}
            <div className="mt-6 lg:mt-8 flex gap-3">
              {(footerData.social.links || []).map((social, index) => {
                const IconComponent = socialIcons[social.icon];
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-300"
                    aria-label={social.label}
                  >
                    {IconComponent && <IconComponent size={20} />}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-red-500 rounded" />
              {footerData.quickLinks.title}
            </h4>
            <ul className="space-y-3">
              {(footerData.quickLinks.links || []).map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-red-500 rounded" />
              {footerData.products.title}
            </h4>
            <ul className="space-y-3">
              {(footerData.products.links || []).map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-red-500 rounded" />
              {footerData.support.title}
            </h4>
            <ul className="space-y-3">
              {(footerData.support.links || []).map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-red-500 rounded" />
              {footerData.contact.title}
            </h4>
            <div className="space-y-4">
              <a
                href={`https://maps.google.com`}
                className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors duration-300"
              >
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span className="text-sm">{footerData.contact.address}</span>
              </a>
              <a
                href={`tel:${footerData.contact.phone}`}
                className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors duration-300"
              >
                <Phone size={18} className="flex-shrink-0 mt-1" />
                <span className="text-sm">{footerData.contact.phone}</span>
              </a>
              <a
                href={`mailto:${footerData.contact.email}`}
                className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors duration-300"
              >
                <Mail size={18} className="flex-shrink-0 mt-1" />
                <span className="text-sm break-all">
                  {footerData.contact.email}
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8 md:pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {/* Legal Links */}
            <div>
              <h5 className="text-sm font-semibold mb-4">
                {footerData.legal.title}
              </h5>
              <div className="flex flex-wrap gap-4">
                {(footerData.legal.links || []).map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-slate-400 hover:text-white text-xs md:text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center sm:text-right">
              <p className="text-slate-400 text-xs md:text-sm">
                {footerData.copyright}
              </p>
            </div>
          </div>

          {/* Credits */}
          <div className="text-center text-slate-500 text-xs">
            <p>{t("footer.credits")}</p>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/5 to-transparent pointer-events-none hidden lg:block" />
    </footer>
  );
}
