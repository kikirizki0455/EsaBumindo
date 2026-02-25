"use client";

import { memo } from "react";

const ApplicationsSection = memo(function ApplicationsSection({
  applications,
}) {
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
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Aplikasi Kami
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Solusi adhesive dan sealant berkualitas tinggi untuk berbagai sektor
            industri
          </p>
          <div
            className="w-20 h-1 bg-gradient-to-r from-[#0c439a] to-[#ca161e] mx-auto mt-6 rounded-full"
            aria-hidden="true"
          />
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:border-[#0c439a]/20"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                aria-hidden="true"
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 text-2xl group-hover:from-[#0c439a]/10 group-hover:to-[#ca161e]/10 transition-colors duration-300">
                  {app.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {app.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {app.description}
                </p>

                {/* Bottom Border Accent */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${app.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                  aria-hidden="true"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Industri", value: "6+" },
            { label: "Produk", value: "50+" },
            { label: "Klien", value: "500+" },
            { label: "Tahun Pengalaman", value: "20+" },
          ].map((stat, index) => (
            <div key={index} className="text-center p-4">
              <div className="text-2xl md:text-3xl font-bold text-[#0c439a] mb-2">
                {stat.value}
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ApplicationsSection.displayName = "ApplicationsSection";

export default ApplicationsSection;
