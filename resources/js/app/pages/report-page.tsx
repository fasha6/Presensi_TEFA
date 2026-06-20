import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Download, Filter, FileText, Search } from "lucide-react";
import { useAuth } from "../lib/auth";
import { getAllowedClassesForRole, getClassesForMajor, isClassAllowedForRole, schoolClasses, schoolMajors } from "../lib/role-scope";

interface AttendanceRecord {
  id: number;
  student_id: number;
  student: { id: number; name: string; nis: string; class: string; jurusan: string } | null;
  date: string;
  lesson_hour: number;
  subject: string;
  status: "hadir" | "telat" | "alpha" | "izin" | "sakit";
  note: string | null;
  created_by: string | null;
  created_at: string;
}

const statusLabels: Record<string, string> = {
  hadir: "Hadir",
  telat: "Terlambat",
  alpha: "Alpha",
  izin: "Izin",
  sakit: "Sakit",
};

const statusColors: Record<string, string> = {
  hadir: "bg-green-100 text-green-700",
  telat: "bg-amber-100 text-amber-700",
  alpha: "bg-red-100 text-red-700",
  izin: "bg-blue-100 text-blue-700",
  sakit: "bg-purple-100 text-purple-700",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function oneWeekAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function ReportPage() {
  const { user } = useAuth();
  const role = user?.role;
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateStart, setDateStart] = useState(oneWeekAgo());
  const [dateEnd, setDateEnd] = useState(todayString());
  const [filterClass, setFilterClass] = useState("all");
  const [filterJurusan, setFilterJurusan] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isOperator = role === "operator";

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch("/api/attendances", {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Gagal mengambil data presensi.");
        const data = (await res.json()) as AttendanceRecord[];
        setRecords(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const classOptions = getClassesForMajor(filterJurusan, schoolClasses);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Date range
      if (r.date < dateStart || r.date > dateEnd) return false;
      // Student data
      const studentClass = r.student?.class ?? "";
      const studentName = r.student?.name ?? "";
      const studentNis = r.student?.nis ?? "";
      // Role scope
      if (!isClassAllowedForRole(studentClass, role)) return false;
      // Class filter
      if (filterClass !== "all" && studentClass !== filterClass) return false;
      // Jurusan filter
      if (filterJurusan !== "all" && (r.student?.jurusan ?? "") !== filterJurusan) return false;
      // Status filter
      if (filterStatus !== "all" && r.status !== filterStatus) return false;
      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!studentName.toLowerCase().includes(q) && !studentNis.includes(q)) return false;
      }
      return true;
    });
  }, [records, dateStart, dateEnd, filterClass, filterJurusan, filterStatus, searchQuery, role]);

  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      hadir: filteredRecords.filter((r) => r.status === "hadir").length,
      telat: filteredRecords.filter((r) => r.status === "telat").length,
      alpha: filteredRecords.filter((r) => r.status === "alpha").length,
      izin: filteredRecords.filter((r) => r.status === "izin").length,
      sakit: filteredRecords.filter((r) => r.status === "sakit").length,
    };
  }, [filteredRecords]);

  useEffect(() => {
    if (filterClass !== "all" && !classOptions.includes(filterClass)) setFilterClass("all");
  }, [classOptions, filterClass]);

  return (
    <div>
      <Header title="Laporan Presensi" breadcrumbs={["Presensi", "Laporan Presensi"]} />

      <div className="w-full p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
          <StatCard label="Total" value={stats.total} color="bg-gray-100 text-gray-700" />
          <StatCard label="Hadir" value={stats.hadir} color="bg-green-100 text-green-700" />
          <StatCard label="Terlambat" value={stats.telat} color="bg-amber-100 text-amber-700" />
          <StatCard label="Alpha" value={stats.alpha} color="bg-red-100 text-red-700" />
          <StatCard label="Izin" value={stats.izin} color="bg-blue-100 text-blue-700" />
          <StatCard label="Sakit" value={stats.sakit} color="bg-purple-100 text-purple-700" />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Dari</label>
                <Input type="date" value={dateStart} onChange={(e) => setDateStart(e.target.value)} className="w-40" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Sampai</label>
                <Input type="date" value={dateEnd} onChange={(e) => setDateEnd(e.target.value)} className="w-40" />
              </div>
              {!isOperator && (
                <>
                  <Select value={filterJurusan} onValueChange={setFilterJurusan}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Semua Jurusan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jurusan</SelectItem>
                      {schoolMajors.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterClass} onValueChange={setFilterClass}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Semua Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {classOptions.map((cn) => (
                        <SelectItem key={cn} value={cn}>{cn}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="hadir">Hadir</SelectItem>
                  <SelectItem value="telat">Terlambat</SelectItem>
                  <SelectItem value="alpha">Alpha</SelectItem>
                  <SelectItem value="izin">Izin</SelectItem>
                  <SelectItem value="sakit">Sakit</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari siswa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 text-sm text-red-700">{error}</CardContent>
          </Card>
        )}

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">NIS</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Nama</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Kelas</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Mapel</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Jam</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Catatan</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Oleh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{formatDate(r.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.student?.nis ?? "-"}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.student?.name ?? "Siswa dihapus"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.student?.class ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{r.lesson_hour}</td>
                      <td className="px-4 py-3">
                        <Badge className={statusColors[r.status]}>{statusLabels[r.status]}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate">{r.note ?? "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{r.created_by ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!isLoading && filteredRecords.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>{error || "Belum ada data presensi untuk filter yang dipilih."}</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12 text-gray-500">
                  <p>Memuat data presensi...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`${color} rounded-lg px-3 py-3 text-center`}>
      <p className="text-xl sm:text-2xl font-semibold">{value}</p>
      <p className="text-xs sm:text-sm">{label}</p>
    </div>
  );
}
