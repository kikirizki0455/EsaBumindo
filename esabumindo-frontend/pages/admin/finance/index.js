// pages/admin/keuangan/index.jsx

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Calculator,
  TrendingUp,
  Users,
  Eye,
  CheckCircle,
  Clock,
  Download,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/router";
import axios from "axios";
import api from "@/lib/axios";

export default function FinancePage() {
  const router = useRouter();
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchSalaries();
  }, [selectedMonth, selectedYear]);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const response = await api.get("/salaries", {
        // ← GANTI
        params: { month: selectedMonth, year: selectedYear },
      });
      setSalaries(response.data);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateSalaries = async () => {
    if (
      !confirm(
        `Hitung gaji untuk semua karyawan bulan ${getMonthName(
          selectedMonth
        )} ${selectedYear}?`
      )
    )
      return;

    try {
      setCalculating(true);
      await api.post("/salaries/calculate", {
        // ← GANTI
        month: selectedMonth,
        year: selectedYear,
      });
      alert("Gaji berhasil dihitung!");
      fetchSalaries();
    } catch (error) {
      console.error("Error calculating salaries:", error);
      alert(error.response?.data?.message || "Gagal menghitung gaji");
    } finally {
      setCalculating(false);
    }
  };

  const handleMarkAsPaid = async (salaryId) => {
    if (!confirm("Tandai gaji ini sebagai sudah dibayar?")) return;

    try {
      await api.patch(`/salaries/${salaryId}/pay`); // ← GANTI
      fetchSalaries();
    } catch (error) {
      console.error("Error marking as paid:", error);
      alert("Gagal mengupdate status pembayaran");
    }
  };

  const getMonthName = (month) => {
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    return months[month - 1];
  };

  const stats = {
    totalSalaries: salaries.reduce(
      (sum, s) => sum + parseFloat(s.totalSalary || 0),
      0
    ),
    totalPaid: salaries
      .filter((s) => s.status === "paid")
      .reduce((sum, s) => sum + parseFloat(s.totalSalary || 0), 0),
    totalPending: salaries
      .filter((s) => s.status === "pending")
      .reduce((sum, s) => sum + parseFloat(s.totalSalary || 0), 0),
    totalEmployees: salaries.length,
    paidCount: salaries.filter((s) => s.status === "paid").length,
    pendingCount: salaries.filter((s) => s.status === "pending").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Management Keuangan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola perhitungan dan pembayaran gaji karyawan
            </p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Periode Gaji
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {getMonthName(month)}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Array.from(
                    { length: 5 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="sm:pt-6">
              <Button
                onClick={handleCalculateSalaries}
                disabled={calculating}
                className="w-full sm:w-auto"
              >
                <Calculator className="h-4 w-4 mr-2" />
                {calculating ? "Menghitung..." : "Hitung Gaji"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-gray-900 truncate">
              {formatCurrency(stats.totalSalaries)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Gaji</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-green-600 truncate">
              {formatCurrency(stats.totalPaid)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Sudah Dibayar ({stats.paidCount})
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-xl md:text-2xl font-bold text-orange-600 truncate">
              {formatCurrency(stats.totalPending)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Pending ({stats.pendingCount})
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalEmployees}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Karyawan</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">💡</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">
                Cara Kerja Sistem Gaji
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>
                  • <strong>Jam Kerja Normal:</strong> 8 jam per hari (gaji
                  normal)
                </li>
                <li>
                  • <strong>Jam Lembur:</strong> Lebih dari 8 jam (dikalikan
                  1.5x gaji normal)
                </li>
                <li>
                  • <strong>Non-Shift:</strong> 08:00 - 16:00 |{" "}
                  <strong>Shift 1:</strong> 06:00 - 14:00 |{" "}
                  <strong>Shift 2:</strong> 14:00 - 22:00
                </li>
                <li>
                  • Klik "Hitung Gaji" untuk otomatis menghitung gaji semua
                  karyawan berdasarkan absensi bulan ini
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Salaries List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">
              Daftar Gaji - {getMonthName(selectedMonth)} {selectedYear}
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : salaries.length === 0 ? (
            <div className="p-8 text-center">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">
                Belum ada data gaji untuk periode ini
              </p>
              <p className="text-sm text-gray-400">
                Klik tombol "Hitung Gaji" untuk menghitung gaji semua karyawan
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Karyawan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Jam Kerja
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Gaji Pokok
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Lembur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Gaji
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {salaries.map((salary) => (
                      <tr key={salary.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {salary.employee?.name || "Unknown"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {salary.employee?.employeeCode || "-"}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {salary.totalWorkHours} jam
                          </p>
                          <p className="text-xs text-gray-500">
                            {salary.totalDays} hari hadir
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(salary.basicSalary)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {formatCurrency(salary.overtimePay)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {salary.totalOvertimeHours} jam
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-primary">
                            {formatCurrency(salary.totalSalary)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              salary.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {salary.status === "paid" ? "Dibayar" : "Pending"}
                          </span>
                          {salary.paidAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(salary.paidAt)}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/keuangan/detail/${salary.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {salary.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkAsPaid(salary.id)}
                              className="text-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Bayar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {salaries.map((salary) => (
                  <div key={salary.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {salary.employee?.name || "Unknown"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {salary.employee?.employeeCode || "-"}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          salary.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {salary.status === "paid" ? "Dibayar" : "Pending"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Jam Kerja:</span>
                        <span className="font-medium">
                          {salary.totalWorkHours} jam ({salary.totalDays} hari)
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Gaji Pokok:</span>
                        <span className="font-medium">
                          {formatCurrency(salary.basicSalary)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Lembur:</span>
                        <span className="font-medium">
                          {formatCurrency(salary.overtimePay)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                        <span className="text-gray-700 font-semibold">
                          Total:
                        </span>
                        <span className="font-bold text-primary">
                          {formatCurrency(salary.totalSalary)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/keuangan/detail/${salary.id}`)
                        }
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                      {salary.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsPaid(salary.id)}
                          className="flex-1 text-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Bayar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
