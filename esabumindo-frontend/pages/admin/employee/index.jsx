// pages/admin/karyawan/index.jsx

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  ClipboardList,
  DollarSign,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useRouter } from "next/router";
import axios from "axios";
import api from "@/lib/axios";

export default function Employee() {
  const router = useRouter();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.log("error fetching Employee", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data karyawan ini?"))
      return;

    try {
      await api.delete(`/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Gagal menghapus data karyawan");
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === "active").length,
    inactive: employees.filter((e) => e.status === "inactive").length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Management Karyawan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola data karyawan dan sistem absensi
            </p>
          </div>
          <Button
            onClick={() => router.push("/admin/employee/add-employee")}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Karyawan
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Karyawan</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Aktif</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.active}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tidak Aktif</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {stats.inactive}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari karyawan berdasarkan nama atau kode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery || statusFilter !== "all"
                  ? "Tidak ada karyawan yang sesuai dengan pencarian"
                  : "Belum ada data karyawan. Mulai dengan menambahkan karyawan baru!"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Karyawan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posisi
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shift
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gaji/Jam
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {emp.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {emp.employeeCode}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm text-gray-900">
                              {emp.position}
                            </p>
                            <p className="text-xs text-gray-500">
                              {emp.department}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                            {emp.shiftType === "shift" ? "Shift" : "Non-Shift"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(emp.hourlyRate)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              emp.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {emp.status === "active" ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/karyawan/absensi/${emp.id}`)
                            }
                          >
                            <ClipboardList className="h-4 w-4 mr-1" />
                            Absensi
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/admin/karyawan/edit/${emp.id}`)
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(emp.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <div key={emp.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {emp.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {emp.employeeCode}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          emp.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {emp.status === "active" ? "Aktif" : "Tidak Aktif"}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Posisi:</span>
                        <span className="font-medium">{emp.position}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Departemen:</span>
                        <span className="font-medium">{emp.department}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shift:</span>
                        <span className="font-medium">
                          {emp.shiftType === "shift" ? "Shift" : "Non-Shift"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Gaji/Jam:</span>
                        <span className="font-medium text-primary">
                          {formatCurrency(emp.hourlyRate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/karyawan/absensi/${emp.id}`)
                        }
                        className="flex-1"
                      >
                        <ClipboardList className="h-4 w-4 mr-1" />
                        Absensi
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/admin/karyawan/edit/${emp.id}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(emp.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
