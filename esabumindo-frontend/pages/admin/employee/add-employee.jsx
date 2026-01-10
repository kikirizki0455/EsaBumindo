// pages/admin/karyawan/tambah.jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, HelpCircle, DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import axios from "axios";

export default function AddEmployee() {
  const router = useRouter();
  const { id } = router.query;
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeCode: "",
    name: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    shiftType: "non-shift",
    hourlyRate: "",
    joinDate: new Date().toISOString().split("T")[0],
    status: "active",
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchEmployee();
    }
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`/api/employees/${id}`);
      const emp = response.data;
      setFormData({
        ...emp,
        joinDate: new Date(emp.joinDate).toISOString().split("T")[0],
        hourlyRate: emp.hourlyRate.toString(),
      });
    } catch (error) {
      console.error("Error fetching employee:", error);
      alert("Gagal memuat data karyawan");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Nama karyawan wajib diisi");
      return;
    }

    if (!formData.hourlyRate || parseFloat(formData.hourlyRate) <= 0) {
      alert("Gaji per jam harus lebih dari 0");
      return;
    }

    try {
      setLoading(true);
      const dataToSubmit = {
        ...formData,
        hourlyRate: parseFloat(formData.hourlyRate),
      };

      if (isEdit) {
        await axios.put(`/api/employees/${id}`, dataToSubmit);
        alert("Data karyawan berhasil diperbarui!");
      } else {
        await axios.post("/api/employees", dataToSubmit);
        alert("Karyawan berhasil ditambahkan!");
      }

      router.push("/admin/karyawan");
    } catch (error) {
      console.error("Error saving employee:", error);
      alert(error.response?.data?.message || "Gagal menyimpan data karyawan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {isEdit ? "Edit Data Karyawan" : "Tambah Karyawan Baru"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEdit
                ? "Perbarui informasi karyawan"
                : "Isi form di bawah untuk menambahkan karyawan baru"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data Pribadi */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Pribadi
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Employee Code */}
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Kode Karyawan <span className="text-red-500">*</span>
                    </label>
                    <div className="group relative">
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                      <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg z-10">
                        Kode unik untuk identifikasi karyawan. Contoh: EMP001,
                        KRY-001
                      </div>
                    </div>
                  </div>
                  <input
                    type="text"
                    name="employeeCode"
                    value={formData.employeeCode}
                    onChange={handleInputChange}
                    placeholder="Contoh: EMP001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nama lengkap karyawan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Data Pekerjaan */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Data Pekerjaan
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posisi/Jabatan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    placeholder="Contoh: Operator Produksi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departemen <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Contoh: Produksi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Join Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Bergabung <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Pengaturan Shift & Gaji */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Pengaturan Shift & Gaji
            </h2>

            <div className="space-y-4">
              {/* Shift Type */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tipe Shift <span className="text-red-500">*</span>
                  </label>
                  <div className="group relative">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="hidden group-hover:block absolute right-0 top-6 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg z-10">
                      <p className="font-semibold mb-1">Non-Shift:</p>
                      <p className="mb-2">Jam kerja: 08:00 - 16:00 (8 jam)</p>
                      <p className="font-semibold mb-1">Shift:</p>
                      <p className="mb-1">Shift 1: 06:00 - 14:00 (8 jam)</p>
                      <p>Shift 2: 14:00 - 22:00 (8 jam)</p>
                    </div>
                  </div>
                </div>
                <select
                  name="shiftType"
                  value={formData.shiftType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="non-shift">Non-Shift (08:00 - 16:00)</option>
                  <option value="shift">Shift (Shift 1 & 2)</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.shiftType === "non-shift"
                    ? "Karyawan non-shift bekerja 08:00 - 16:00. Lebih dari 8 jam dihitung lembur."
                    : "Karyawan shift akan dibagi antara Shift 1 (06:00-14:00) dan Shift 2 (14:00-22:00)."}
                </p>
              </div>

              {/* Hourly Rate */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gaji Per Jam <span className="text-red-500">*</span>
                  </label>
                  <div className="group relative">
                    <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg z-10">
                      Masukkan gaji per jam untuk karyawan ini. Gaji lembur akan
                      dikalikan 1.5x dari gaji normal.
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="80000"
                    min="0"
                    step="1000"
                    className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>
                {formData.hourlyRate && parseFloat(formData.hourlyRate) > 0 && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs font-medium text-blue-900 mb-2">
                      💡 Estimasi Gaji:
                    </p>
                    <div className="space-y-1 text-xs text-blue-700">
                      <p>
                        • Gaji normal (8 jam):{" "}
                        <span className="font-semibold">
                          {formatCurrency(parseFloat(formData.hourlyRate) * 8)}
                        </span>
                      </p>
                      <p>
                        • Gaji lembur per jam (1.5x):{" "}
                        <span className="font-semibold">
                          {formatCurrency(
                            parseFloat(formData.hourlyRate) * 1.5
                          )}
                        </span>
                      </p>
                      <p>
                        • Estimasi bulanan (22 hari kerja):{" "}
                        <span className="font-semibold">
                          {formatCurrency(
                            parseFloat(formData.hourlyRate) * 8 * 22
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              {loading
                ? "Menyimpan..."
                : isEdit
                ? "Simpan Perubahan"
                : "Tambah Karyawan"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
