// pages/admin/karyawan/absensi/[id].jsx

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  Calendar,
  Clock,
  TrendingUp,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  formatDate,
  formatTime,
  formatCurrency,
  calculateWorkHours,
  calculateOvertimeHours,
  getShiftInfo,
} from "@/lib/utils";
import axios from "axios";

export default function Attendance() {
  const router = useRouter();
  const { id } = router.query;

  const [employee, setEmployee] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    checkIn: "",
    checkOut: "",
    shiftType: "",
    status: "present",
    notes: "",
  });

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, attRes] = await Promise.all([
        axios.get(`/api/employees/${id}`),
        axios.get(`/api/attendances/employee/${id}`),
      ]);
      setEmployee(empRes.data);
      setAttendances(attRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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

    if (!formData.checkIn || !formData.checkOut) {
      alert("Jam masuk dan keluar wajib diisi");
      return;
    }

    const checkIn = new Date(`${formData.date}T${formData.checkIn}`);
    const checkOut = new Date(`${formData.date}T${formData.checkOut}`);

    if (checkOut <= checkIn) {
      alert("Jam keluar harus lebih besar dari jam masuk");
      return;
    }

    const workHours = calculateWorkHours(checkIn, checkOut);
    const overtimeHours = calculateOvertimeHours(workHours);
    const shiftInfo = getShiftInfo(checkIn);

    try {
      const dataToSubmit = {
        employeeId: id,
        date: formData.date,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        shiftType: formData.shiftType || shiftInfo.type,
        workHours,
        overtimeHours,
        status: formData.status,
        notes: formData.notes,
      };

      await axios.post("/api/attendances", dataToSubmit);
      alert("Absensi berhasil ditambahkan!");
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        checkIn: "",
        checkOut: "",
        shiftType: "",
        status: "present",
        notes: "",
      });
      fetchData();
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert(error.response?.data?.message || "Gagal menyimpan absensi");
    }
  };

  const handleDelete = async (attId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data absensi ini?")) return;

    try {
      await axios.delete(`/api/attendances/${attId}`);
      fetchData();
    } catch (error) {
      console.error("Error deleting attendance:", error);
      alert("Gagal menghapus data absensi");
    }
  };

  const stats =
    attendances.length > 0
      ? {
          totalDays: attendances.filter((a) => a.status === "present").length,
          totalHours: attendances.reduce(
            (sum, a) => sum + parseFloat(a.workHours || 0),
            0
          ),
          totalOvertime: attendances.reduce(
            (sum, a) => sum + parseFloat(a.overtimeHours || 0),
            0
          ),
          estimatedSalary: employee
            ? attendances.reduce((sum, a) => {
                const basic =
                  parseFloat(a.workHours || 0) *
                  parseFloat(employee.hourlyRate);
                const overtime =
                  parseFloat(a.overtimeHours || 0) *
                  parseFloat(employee.hourlyRate) *
                  1.5;
                return sum + basic + overtime;
              }, 0)
            : 0,
        }
      : { totalDays: 0, totalHours: 0, totalOvertime: 0, estimatedSalary: 0 };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!employee) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Data karyawan tidak ditemukan</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
              {employee.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
              <span>{employee.employeeCode}</span>
              <span>•</span>
              <span>{employee.position}</span>
              <span>•</span>
              <span className="font-medium text-primary">
                {formatCurrency(employee.hourlyRate)}/jam
              </span>
            </div>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex-shrink-0"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Tambah Absensi</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalDays}
            </p>
            <p className="text-xs text-gray-500 mt-1">Hari Hadir</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalHours.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Jam Kerja</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalOvertime.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Jam Lembur</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-5 h-5 bg-primary rounded flex items-center justify-center text-white text-xs font-bold">
                Rp
              </div>
            </div>
            <p className="text-lg md:text-2xl font-bold text-primary truncate">
              {formatCurrency(stats.estimatedSalary)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Est. Gaji</p>
          </div>
        </div>

        {/* Form Tambah Absensi */}
        {showForm && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tambah Data Absensi
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Masuk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jam Keluar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shift
                  </label>
                  <select
                    name="shiftType"
                    value={formData.shiftType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Otomatis berdasarkan jam masuk</option>
                    <option value="non-shift">Non-Shift (08:00 - 16:00)</option>
                    <option value="shift-1">Shift 1 (06:00 - 14:00)</option>
                    <option value="shift-2">Shift 2 (14:00 - 22:00)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="present">Hadir</option>
                    <option value="absent">Tidak Hadir</option>
                    <option value="leave">Cuti/Izin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Tambahkan catatan jika perlu..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1">
                  Simpan Absensi
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Attendance List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Riwayat Absensi</h2>
          </div>

          {attendances.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Belum ada data absensi untuk karyawan ini
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {attendances.map((att) => (
                <div key={att.id} className="p-4 hover:bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-medium text-gray-900">
                          {formatDate(att.date)}
                        </p>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            att.status === "present"
                              ? "bg-green-100 text-green-700"
                              : att.status === "absent"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {att.status === "present"
                            ? "Hadir"
                            : att.status === "absent"
                            ? "Tidak Hadir"
                            : "Cuti"}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Masuk</p>
                          <p className="font-medium">
                            {att.checkIn ? formatTime(att.checkIn) : "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Keluar</p>
                          <p className="font-medium">
                            {att.checkOut ? formatTime(att.checkOut) : "-"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Jam Kerja</p>
                          <p className="font-medium text-green-600">
                            {att.workHours || 0} jam
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Lembur</p>
                          <p className="font-medium text-orange-600">
                            {att.overtimeHours || 0} jam
                          </p>
                        </div>
                      </div>

                      {att.notes && (
                        <p className="text-xs text-gray-500 mt-2">
                          💬 {att.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(att.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
