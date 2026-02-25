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
import { memo, useMemo } from "react";

// Static social icons map
const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
};

// Memoized FooterSection component
const FooterSection = memo(function FooterSection({ title, links }) {
  if (!links?.length) return null;

  return (
    <div>
      <h4 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
        <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-red-500 rounded" />
        {title}
      </h4>
      <ul className="space-y-3">
        {links.map((link, index) => (
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
  );
});

// Memoized SocialLinks component
const SocialLinks = memo(function SocialLinks({ links }) {
  if (!links?.length) return null;

  return (
    <div className="mt-6 lg:mt-8 flex gap-3">
      {links.map((social, index) => {
        const IconComponent = socialIcons[social.icon];
        if (!IconComponent) return null;
        return (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors duration-300"
            aria-label={social.label}
          >
            <IconComponent size={20} />
          </a>
        );
      })}
    </div>
  );
});

// Memoized ContactInfo component
const ContactInfo = memo(function ContactInfo({ contact }) {
  if (!contact) return null;

  return (
    <div className="space-y-4">
      {contact.address && (
        <a
          href="https://maps.google.com"
          className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors duration-300"
        >
          <MapPin size={18} className="shrink-0 mt-1" />
          <span className="text-sm">{contact.address}</span>
        </a>
      )}
      {contact.phone && (
        <a
          href={`tel:${contact.phone}`}
          className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors duration-300"
        >
          <Phone size={18} className="shrink-0 mt-1" />
          <span className="text-sm">{contact.phone}</span>
        </a>
      )}
      {contact.email && (
        <a
          href={`mailto:${contact.email}`}
          className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors duration-300"
        >
          <Mail size={18} className="shrink-0 mt-1" />
          <span className="text-sm break-all">{contact.email}</span>
        </a>
      )}
    </div>
  );
});

function Footer() {
  const { t, isHydrated } = useTranslation();

  // Memoize footer data
  const footerData = useMemo(() => {
    if (!isHydrated) return null;
    return {
      company: t("footer.company") || {},
      quickLinks: t("footer.quickLinks") || {},
      products: t("footer.products") || {},
      support: t("footer.support") || {},
      contact: t("footer.contact") || {},
      social: t("footer.social") || {},
      legal: t("footer.legal") || {},
      copyright: t("footer.copyright"),
      credits: t("footer.credits"),
    };
  }, [t, isHydrated]);

  // Loading skeleton untuk mobile
  if (!isHydrated) {
    return (
      <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-6 bg-slate-700 rounded w-32" />
            <div className="h-4 bg-slate-800 rounded w-full max-w-xs" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 bg-slate-700 rounded w-24" />
                  <div className="h-3 bg-slate-800 rounded w-20" />
                  <div className="h-3 bg-slate-800 rounded w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
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
            <SocialLinks links={footerData.social.links} />
          </div>

          <FooterSection
            title={footerData.quickLinks.title}
            links={footerData.quickLinks.links}
          />
          <FooterSection
            title={footerData.products.title}
            links={footerData.products.links}
          />
          <FooterSection
            title={footerData.support.title}
            links={footerData.support.links}
          />

          {/* Contact Info */}
          <div>
            <h4 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-red-500 rounded" />
              {footerData.contact.title}
            </h4>
            <ContactInfo contact={footerData.contact} />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Legal Links */}
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
            {/* Copyright */}
            <p className="text-slate-400 text-xs md:text-sm">
              {footerData.copyright}
            </p>
          </div>
          {/* Credits */}
          <div className="text-center text-slate-500 text-xs mt-4">
            <p>{footerData.credits}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
