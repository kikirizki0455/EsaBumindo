// pages/admin/sales-wa/index.jsx
// Manajemen sales WhatsApp: daftar sales, strategi rotasi, statistik klik.
import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast-context";
import {
  Plus,
  Edit,
  Trash2,
  Users,
  UserCheck,
  MousePointerClick,
  Repeat,
  Save,
  X,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import api from "@/lib/axios";

const STRATEGIES = [
  {
    value: "ROUND_ROBIN",
    label: "Round Robin (giliran)",
    desc: "Bergiliran satu per satu. Sales yang paling lama tidak dapat klik, dapat duluan. Paling sederhana dan paling mudah diaudit. Direkomendasikan jika semua sales setara.",
  },
  {
    value: "WEIGHTED_ROUND_ROBIN",
    label: "Weighted Round Robin (giliran berbobot)",
    desc: "Sama seperti giliran, tapi porsi mengikuti bobot. Bobot 2 = dapat 2x lebih banyak dari bobot 1. Cocok jika ada sales senior / junior atau part-time.",
  },
  {
    value: "LEAST_ASSIGNED",
    label: "Least Assigned (paling sedikit 30 hari)",
    desc: "Selalu ke sales dengan klik paling sedikit dalam 30 hari terakhir. Otomatis menyeimbangkan jika ada sales yang sempat nonaktif / cuti.",
  },
  {
    value: "RANDOM",
    label: "Random berbobot",
    desc: "Acak, peluang sebanding bobot. Adil dalam jangka panjang, tapi jangka pendek bisa timpang. Tidak bisa ditebak pola gilirannya.",
  },
];

const emptyForm = { name: "", phone: "", weight: 1, isActive: true };

function formatDateTime(d) {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SalesWaPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [setting, setSetting] = useState(null);
  const [settingDraft, setSettingDraft] = useState(null);
  const [savingSetting, setSavingSetting] = useState(false);
  const [clicks, setClicks] = useState([]);
  const [days, setDays] = useState(30);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // agent object or null
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [s, st, c] = await Promise.all([
        api.get("/wa/stats", { params: { days } }),
        api.get("/wa/settings"),
        api.get("/wa/clicks", { params: { limit: 30 } }),
      ]);
      setStats(s.data);
      setSetting(st.data);
      setSettingDraft(st.data);
      setClicks(c.data);
    } catch (err) {
      console.error(err);
      addToast("Gagal memuat data sales WhatsApp", "error");
    } finally {
      setLoading(false);
    }
  }, [days, addToast]);

  useEffect(() => {
    load();
  }, [load]);

  // ---------- agent CRUD ----------
  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };
  const openEdit = (a) => {
    setEditing(a);
    setForm({ name: a.name, phone: a.phone, weight: a.weight, isActive: a.isActive });
    setModalOpen(true);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      addToast("Nama dan nomor wajib diisi", "warning");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        weight: Number(form.weight) || 1,
        isActive: !!form.isActive,
      };
      if (editing) {
        await api.patch(`/wa/sales/${editing.id}`, payload);
        addToast("Sales diperbarui", "success");
      } else {
        await api.post("/wa/sales", payload);
        addToast("Sales ditambahkan", "success");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      const msg = err.response?.data?.message;
      addToast(Array.isArray(msg) ? msg.join(", ") : msg || "Gagal menyimpan", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (a) => {
    try {
      await api.patch(`/wa/sales/${a.id}`, { isActive: !a.isActive });
      load();
    } catch {
      addToast("Gagal mengubah status", "error");
    }
  };

  const removeAgent = async (a) => {
    if (!window.confirm(`Hapus sales "${a.name}"? Riwayat kliknya ikut terhapus.`)) return;
    try {
      await api.delete(`/wa/sales/${a.id}`);
      addToast("Sales dihapus", "success");
      load();
    } catch {
      addToast("Gagal menghapus", "error");
    }
  };

  // ---------- settings ----------
  const saveSetting = async () => {
    try {
      setSavingSetting(true);
      const res = await api.patch("/wa/settings", {
        strategy: settingDraft.strategy,
        stickyDays: Number(settingDraft.stickyDays) || 0,
        greeting: settingDraft.greeting || "",
        fallbackPhone: settingDraft.fallbackPhone || "",
      });
      setSetting(res.data);
      setSettingDraft(res.data);
      addToast("Pengaturan rotasi disimpan", "success");
    } catch (err) {
      const msg = err.response?.data?.message;
      addToast(Array.isArray(msg) ? msg.join(", ") : msg || "Gagal menyimpan", "error");
    } finally {
      setSavingSetting(false);
    }
  };

  const settingDirty =
    setting &&
    settingDraft &&
    (setting.strategy !== settingDraft.strategy ||
      String(setting.stickyDays) !== String(settingDraft.stickyDays) ||
      (setting.greeting || "") !== (settingDraft.greeting || "") ||
      (setting.fallbackPhone || "") !== (settingDraft.fallbackPhone || ""));

  const currentStrategy = STRATEGIES.find((s) => s.value === settingDraft?.strategy);
  const agents = stats?.agents || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Sales WhatsApp</h1>
            <p className="text-sm text-gray-500 mt-1">
              Daftar sales penerima chat dari tombol WhatsApp di website dan aturan rotasinya
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={load} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Muat ulang
            </Button>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Sales
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} color="blue" label="Total Sales" value={stats?.totalAgents ?? "-"} />
          <StatCard icon={UserCheck} color="green" label="Sales Aktif" value={stats?.activeAgents ?? "-"} />
          <StatCard
            icon={MousePointerClick}
            color="emerald"
            label={`Klik ${days} hari`}
            value={stats?.totalClicks ?? "-"}
          />
          <StatCard
            icon={Repeat}
            color="violet"
            label="Pengunjung kembali"
            value={stats?.stickyClicks ?? "-"}
            hint="klik yang diarahkan ke sales yang sama"
          />
        </div>

        {/* Settings */}
        {settingDraft && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Aturan Rotasi</h2>
              <Button onClick={saveSetting} disabled={!settingDirty || savingSetting} size="sm">
                <Save className="h-4 w-4 mr-2" />
                {savingSetting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Metode pembagian</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                  value={settingDraft.strategy}
                  onChange={(e) => setSettingDraft({ ...settingDraft, strategy: e.target.value })}
                >
                  {STRATEGIES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {currentStrategy && (
                  <p className="text-xs text-gray-500 mt-1">{currentStrategy.desc}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Pengunjung kembali ke sales yang sama selama (hari)
                </label>
                <input
                  type="number"
                  min={0}
                  max={365}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={settingDraft.stickyDays}
                  onChange={(e) => setSettingDraft({ ...settingDraft, stickyDays: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  0 = nonaktif. Pengunjung yang klik lagi dalam rentang ini diarahkan ke sales yang
                  sama, supaya percakapan tidak terpecah ke dua sales.
                </p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Pesan pembuka otomatis</label>
                <textarea
                  rows={2}
                  maxLength={500}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={settingDraft.greeting || ""}
                  onChange={(e) => setSettingDraft({ ...settingDraft, greeting: e.target.value })}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">
                  Nomor fallback (dipakai jika tidak ada sales aktif)
                </label>
                <input
                  type="text"
                  placeholder="08xxxxxxxxxx"
                  className="w-full md:w-72 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={settingDraft.fallbackPhone || ""}
                  onChange={(e) => setSettingDraft({ ...settingDraft, fallbackPhone: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {/* Agents table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Daftar Sales</h2>
            <select
              className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={7}>7 hari</option>
              <option value={30}>30 hari</option>
              <option value={90}>90 hari</option>
            </select>
          </div>
          {loading && !stats ? (
            <div className="p-8 text-center text-gray-500">Memuat...</div>
          ) : agents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Belum ada sales. Klik "Tambah Sales" untuk mendaftarkan nomor WhatsApp sales.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Nama</th>
                    <th className="text-left px-4 py-3 font-medium">Nomor WA</th>
                    <th className="text-center px-4 py-3 font-medium">Bobot</th>
                    <th className="text-right px-4 py-3 font-medium">Klik {days}h</th>
                    <th className="text-left px-4 py-3 font-medium w-48">Porsi (aktual / ideal)</th>
                    <th className="text-left px-4 py-3 font-medium">Terakhir</th>
                    <th className="text-center px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {agents.map((a) => (
                    <tr key={a.id} className={!a.isActive ? "opacity-60" : ""}>
                      <td className="px-4 py-3 font-medium text-gray-900">{a.name}</td>
                      <td className="px-4 py-3 text-gray-700 font-mono">
                        <a
                          href={`https://wa.me/${a.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          +{a.phone}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center">{a.weight}</td>
                      <td className="px-4 py-3 text-right font-semibold">{a.clicksInWindow}</td>
                      <td className="px-4 py-3">
                        <ShareBar actual={a.sharePct} expected={a.expectedSharePct} />
                      </td>
                      <td className="px-4 py-3 text-gray-600">{formatDateTime(a.lastAssignedAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleActive(a)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            a.isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title="Klik untuk ubah status"
                        >
                          {a.isActive ? "Aktif" : "Nonaktif"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="outline" size="sm" onClick={() => openEdit(a)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeAgent(a)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent clicks */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Klik Terakhir</h2>
          </div>
          {clicks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada klik.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Waktu</th>
                    <th className="text-left px-4 py-2 font-medium">Sales</th>
                    <th className="text-left px-4 py-2 font-medium">Halaman</th>
                    <th className="text-left px-4 py-2 font-medium">Pengunjung</th>
                    <th className="text-left px-4 py-2 font-medium">Jenis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clicks.map((c) => (
                    <tr key={c.id}>
                      <td className="px-4 py-2 text-gray-600 whitespace-nowrap">
                        {formatDateTime(c.createdAt)}
                      </td>
                      <td className="px-4 py-2 font-medium">{c.sales?.name || "-"}</td>
                      <td className="px-4 py-2 text-gray-600 truncate max-w-[200px]">{c.page || "-"}</td>
                      <td className="px-4 py-2 text-gray-500 font-mono text-xs">
                        {c.visitorId ? c.visitorId.slice(0, 8) : "-"}
                      </td>
                      <td className="px-4 py-2">
                        {c.sticky ? (
                          <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs">
                            kembali
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                            rotasi
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal add/edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={submitForm}
            className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
                {editing ? "Edit Sales" : "Tambah Sales"}
              </h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nama</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nomor WhatsApp</label>
              <input
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="08xxxxxxxxxx atau 628xxxxxxxxx"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <p className="text-xs text-gray-500">Disimpan otomatis dalam format 62xxxx.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Bobot</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                />
                <p className="text-xs text-gray-500">Dipakai di metode berbobot / random.</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <label className="flex items-center gap-2 mt-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  Aktif menerima chat
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, color, label, value, hint }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    emerald: "bg-emerald-100 text-emerald-600",
    violet: "bg-violet-100 text-violet-600",
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function ShareBar({ actual, expected }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-600">
        <span>{actual}%</span>
        <span className="text-gray-400">ideal {expected}%</span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-[#25D366] rounded-full"
          style={{ width: `${Math.min(actual, 100)}%` }}
        />
        <div
          className="absolute inset-y-0 w-0.5 bg-gray-700"
          style={{ left: `${Math.min(expected, 100)}%` }}
          title={`Porsi ideal ${expected}%`}
        />
      </div>
    </div>
  );
}
