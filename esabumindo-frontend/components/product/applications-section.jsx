"use client";

import { memo } from "react";
import { useTranslation } from "@/hooks/use-translation";

// ─── Proper SVG Icons per Application ─────────────────────────────────────────
// Setiap icon dirancang sesuai nama aplikasinya

const icons = {
  dryLamination: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <rect
        x="4"
        y="10"
        width="40"
        height="8"
        rx="2"
        fill="currentColor"
        opacity="0.9"
      />
      <rect
        x="4"
        y="22"
        width="40"
        height="8"
        rx="2"
        fill="currentColor"
        opacity="0.6"
      />
      <rect
        x="4"
        y="34"
        width="40"
        height="4"
        rx="2"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M20 6 L24 10 L28 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  screenPrinting: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <rect
        x="6"
        y="8"
        width="36"
        height="24"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      <rect
        x="12"
        y="14"
        width="24"
        height="12"
        rx="1"
        fill="currentColor"
        opacity="0.2"
      />
      <line
        x1="16"
        y1="17"
        x2="32"
        y2="17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="21"
        x2="28"
        y2="21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="16"
        y1="25"
        x2="30"
        y2="25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 32 L18 42 M30 32 L30 42"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="42"
        x2="34"
        y2="42"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  waterproofing: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <path
        d="M24 4 C24 4 8 20 8 30 C8 38.84 15.16 46 24 46 C32.84 46 40 38.84 40 30 C40 20 24 4 24 4Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M16 32 C16 36.42 19.58 40 24 40"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M32 16 C34 18 36 22 36 26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  ),
  wetLamination: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <rect
        x="4"
        y="12"
        width="40"
        height="7"
        rx="2"
        fill="currentColor"
        opacity="0.9"
      />
      <rect
        x="4"
        y="24"
        width="40"
        height="7"
        rx="2"
        fill="currentColor"
        opacity="0.5"
      />
      <path
        d="M10 19 Q14 22 18 19 Q22 16 26 19 Q30 22 34 19 Q38 16 42 19"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M10 31 Q14 34 18 31 Q22 28 26 31 Q30 34 34 31 Q38 28 42 31"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  ),
  jointFlap: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <path
        d="M6 18 L24 10 L42 18 L42 38 L6 38 Z"
        fill="currentColor"
        opacity="0.1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 18 L24 26 L42 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 26 L24 38"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M14 22 L14 10 L24 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
        strokeDasharray="3 2"
      />
    </svg>
  ),
  wood: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <ellipse
        cx="24"
        cy="28"
        rx="18"
        ry="12"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <ellipse
        cx="24"
        cy="28"
        rx="13"
        ry="8"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
        fill="none"
      />
      <ellipse
        cx="24"
        cy="28"
        rx="8"
        ry="5"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
        fill="none"
      />
      <ellipse
        cx="24"
        cy="28"
        rx="4"
        ry="2.5"
        fill="currentColor"
        opacity="0.6"
      />
      <path
        d="M24 16 L24 8 M20 12 L28 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  paperAluminium: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <rect
        x="6"
        y="8"
        width="36"
        height="10"
        rx="2"
        fill="currentColor"
        opacity="0.9"
      />
      <rect
        x="6"
        y="20"
        width="36"
        height="4"
        rx="1"
        fill="currentColor"
        opacity="0.4"
      />
      <rect
        x="6"
        y="26"
        width="36"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      <line
        x1="10"
        y1="31"
        x2="38"
        y2="31"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <line
        x1="10"
        y1="35"
        x2="32"
        y2="35"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <path d="M36 26 L42 20 L42 26" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  label: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-7 h-7"
    >
      <path
        d="M8 8 L30 8 L42 20 L42 40 L8 40 Z"
        fill="currentColor"
        opacity="0.1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M30 8 L30 20 L42 20"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <line
        x1="14"
        y1="24"
        x2="36"
        y2="24"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="30"
        x2="30"
        y2="30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="14"
        y1="36"
        x2="26"
        y2="36"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
};

// Mapping app.id ke icon dan accent color
const APP_CONFIG = {
  "app-1": { icon: icons.dryLamination, accent: "from-[#0c439a] to-[#1a5fc8]" },
  "app-2": {
    icon: icons.screenPrinting,
    accent: "from-[#7c3aed] to-[#9d56f7]",
  },
  "app-3": { icon: icons.waterproofing, accent: "from-[#0891b2] to-[#06b6d4]" },
  "app-4": { icon: icons.wetLamination, accent: "from-[#0c439a] to-[#3b82f6]" },
  "app-5": { icon: icons.jointFlap, accent: "from-[#ca161e] to-[#ef4444]" },
  "app-6": { icon: icons.wood, accent: "from-[#92400e] to-[#d97706]" },
  "app-7": {
    icon: icons.paperAluminium,
    accent: "from-[#475569] to-[#94a3b8]",
  },
  "app-8": { icon: icons.label, accent: "from-[#065f46] to-[#10b981]" },
};

// Stats — nilai statis, label dari translation
const STATS = [
  { key: "industries", value: "15+" },
  { key: "products", value: "50+" },
  { key: "clients", value: "200+" },
  { key: "experience", value: "10+" },
];

const ApplicationsSection = memo(function ApplicationsSection({
  applications,
}) {
  const { t } = useTranslation();

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background Decorations */}
      <div
        className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-[#0c439a] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-[#ca161e] rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("products.applicationsSection.title")}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            {t("products.applicationsSection.subtitle")}
          </p>
          <div
            className="w-20 h-1 bg-gradient-to-r from-[#0c439a] to-[#ca161e] mx-auto mt-6 rounded-full"
            aria-hidden="true"
          />
        </div>

        {/* ── Applications Grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {applications.map((app) => {
            const config = APP_CONFIG[app.id] ?? {
              icon: icons.label,
              accent: "from-[#0c439a] to-[#ca161e]",
            };

            return (
              <div
                key={app.id}
                className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Top accent bar */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${config.accent}`}
                  aria-hidden="true"
                />

                <div className="p-5">
                  {/* Icon container */}
                  <div
                    className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${config.accent} text-white shadow-md`}
                  >
                    {config.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                    {app.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {app.description}
                  </p>
                </div>

                {/* Bottom gradient on hover */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${config.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>

        {/* ── Stats ──────────────────────────────────────────────────────────── */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.key}
              className="text-center p-5 rounded-xl bg-white border border-gray-100 shadow-sm"
            >
              <div className="text-3xl md:text-4xl font-bold text-[#0c439a] mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {t(`products.applicationsSection.stats.${stat.key}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ApplicationsSection.displayName = "ApplicationsSection";
export default ApplicationsSection;
