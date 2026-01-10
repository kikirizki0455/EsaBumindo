import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import MainLayout from "./layouts/main-layout";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Pesan Anda telah dikirim!");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header/Navigation
      <nav className="bg    -white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">EB</span>
              </div>
              <span className="font-semibold text-lg">Esa Busindo</span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Beranda
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Tentang Kami
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Layanan
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Galeri
              </a>
              <a href="#" className="text-blue-600 font-semibold">
                Kontak
              </a>
            </div>
          </div>
        </div>
      </nav> */}

        {/* Hero Section with Image */}
        <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-blue-900/80 to-blue-700/80 z-10"></div>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 400'%3E%3Crect fill='%23334155' width='1200' height='400'/%3E%3Ctext x='50%25' y='50%25' font-size='24' fill='%23fff' text-anchor='middle' dominant-baseline='middle' opacity='0.3'%3ESeminar/Meeting Room Image%3C/text%3E%3C/svg%3E\")",
            }}
          ></div>
          <div className="relative z-20 container mx-auto px-4 h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Hubungi Kami
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Kami siap membantu kebutuhan Anda
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Contact Form */}
              <Card className="shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                    Kirim Pesan
                  </h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama Lengkap *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Masukkan nama lengkap Anda"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">No. Telepon</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="08xx xxxx xxxx"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Pesan *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tulis pesan Anda di sini..."
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleSubmit}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold"
                    >
                      Kirim Pesan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="shadow-lg">
                  <CardContent className="p-6 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
                      Esa Bumindo
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Melayani kebutuhan Anda dengan bahan berkualitas dan
                      pelayanan profesional.
                    </p>

                    <div className="space-y-6">
                      {/* Address */}
                      <div className="flex items-start space-x-4">
                        <div className="shrink w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Alamat
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            Jl. Contoh No. 123, Kelurahan XYZ
                            <br />
                            Jakarta Selatan, DKI Jakarta 12345
                            <br />
                            Indonesia
                          </p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-start space-x-4">
                        <div className="shrink w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Telepon
                          </h3>
                          <p className="text-gray-600">+62 21 1234 5678</p>
                          <p className="text-gray-600">+62 812 3456 7890</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-start space-x-4">
                        <div className="shrink w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <Mail className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Email
                          </h3>
                          <p className="text-gray-600">info@esabumindo.com</p>
                          <p className="text-gray-600">cs@esabumindo.com</p>
                        </div>
                      </div>

                      {/* Working Hours */}
                      <div className="flex items-start space-x-4">
                        <div className="shrink w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">
                            Jam Operasional
                          </h3>
                          <p className="text-gray-600">
                            Senin - Jumat: 08.00 - 17.00 WIB
                          </p>
                          <p className="text-gray-600">
                            Sabtu: 08.00 - 14.00 WIB
                          </p>
                          <p className="text-gray-600">Minggu & Libur: Tutup</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Map Placeholder */}
                <Card className="shadow-lg overflow-hidden">
                  <div className="h-64 md:h-80 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-4">
                        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Google Maps Location</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Integrate with Google Maps API
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Footer
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">ESA BUSINDO</h3>
              <p className="text-blue-200 text-sm leading-relaxed">
                Perusahaan penyedia layanan  terpercaya dengan
                armada berkualitas dan pelayanan profesional.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Menu</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-blue-200 hover:text-white transition"
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-blue-200 hover:text-white transition"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-blue-200 hover:text-white transition"
                  >
                    Layanan
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-blue-200 hover:text-white transition"
                  >
                    Kontak
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Hubungi Kami</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>Email: info@esabumindo.com</li>
                <li>Phone: +62 21 1234 5678</li>
                <li>Jakarta, Indonesia</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-200">
            <p>&copy; 2024 Esa Busindo. All rights reserved.</p>
          </div>
        </div>
      </footer> */}
      </div>
    </MainLayout>
  );
}
