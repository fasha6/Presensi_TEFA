import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Search, Filter, Eye, TrendingUp, TrendingDown, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { getAllowedClassesForRole, getClassesForMajor, homeroomAssignment, isClassAllowedForRole, schoolClasses, schoolMajors, secretaryAssignment } from "../lib/role-scope";

interface Student {
  id: number;
  name: string;
  nis: string;
  class: string;
  jurusan: string;
  attendancePercentage: number;
  violations: number;
  sp: number;
  riskLevel: "low" | "medium" | "high";
}

export function StudentsPage() {
  const { user } = useAuth();
  const role = user?.role;
  const isOperator = role === "operator";
  const isSecretary = role === "secretary";
  const isHomeroom = role === "homeroom";
  const isTeacher = role === "teacher";
  const hasLockedClass = isSecretary || isHomeroom;
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterJurusan, setFilterJurusan] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formNis, setFormNis] = useState("");
  const [formName, setFormName] = useState("");
  const [formClass, setFormClass] = useState("");
  const [formJurusan, setFormJurusan] = useState("");
  const [formParentName, setFormParentName] = useState("");
  const [formParentPhone, setFormParentPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudents() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/students", {
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });

        if (!response.ok) throw new Error("Gagal mengambil data siswa.");
        const data = (await response.json()) as Student[];
        setStudents(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadStudents();
    return () => controller.abort();
  }, []);

  const roleScopedStudents = students.filter((s) => isClassAllowedForRole(s.class, role));
  const allowedClasses = getAllowedClassesForRole(role);
  const classOptions = getClassesForMajor(filterJurusan, allowedClasses ?? schoolClasses);

  const filteredStudents = roleScopedStudents.filter((s) => {
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.nis.includes(searchQuery)) return false;
    if (!hasLockedClass && filterClass !== "all" && s.class !== filterClass) return false;
    if (!hasLockedClass && filterJurusan !== "all" && s.jurusan !== filterJurusan) return false;
    if (filterRisk !== "all" && s.riskLevel !== filterRisk) return false;
    return true;
  });

  const stats = {
    total: roleScopedStudents.length,
    high: roleScopedStudents.filter((s) => s.attendancePercentage >= 90).length,
    medium: roleScopedStudents.filter((s) => s.attendancePercentage >= 75 && s.attendancePercentage < 90).length,
    low: roleScopedStudents.filter((s) => s.attendancePercentage < 75).length,
  };

  useEffect(() => {
    if (filterClass !== "all" && !classOptions.includes(filterClass)) setFilterClass("all");
  }, [classOptions, filterClass]);

  const resetForm = () => {
    setFormNis("");
    setFormName("");
    setFormClass("");
    setFormJurusan("");
    setFormParentName("");
    setFormParentPhone("");
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNis.trim() || !formName.trim() || !formClass || !formJurusan) {
      toast.error("NIS, Nama, Kelas, dan Jurusan wajib diisi.");
      return;
    }
    try {
      setIsSaving(true);
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          nis: formNis.trim(),
          name: formName.trim(),
          class_name: formClass,
          major: formJurusan,
          attendance_percentage: 100,
          violations_count: 0,
          warning_letters_count: 0,
          risk_level: "low",
          parent_name: formParentName.trim() || null,
          parent_phone: formParentPhone.trim() || null,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Gagal menambah siswa.");
      }
      const newStudent = (await res.json()) as Student;
      setStudents((prev) => [...prev, newStudent]);
      toast.success(`Siswa ${formName.trim()} berhasil ditambahkan.`);
      resetForm();
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Header title="Data Siswa" breadcrumbs={["Siswa"]} />

      <div className="w-full p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Siswa</p>
                <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kehadiran Tinggi</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-semibold text-green-600">{stats.high}</p>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-gray-500">≥90%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kehadiran Sedang</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-semibold text-amber-600">{stats.medium}</p>
                </div>
                <p className="text-xs text-gray-500">75-89%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kehadiran Rendah</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-semibold text-red-600">{stats.low}</p>
                  <TrendingDown className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-xs text-gray-500">{'<75%'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters + Add Button */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter:</span>
                </div>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama atau NIS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {!hasLockedClass && (
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
                )}
                {!hasLockedClass && (
                  <Select value={filterClass} onValueChange={setFilterClass}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder={isTeacher ? "Kelas yang diajar" : "Semua Kelas"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{isTeacher ? "Semua Kelas Jadwal" : "Semua Kelas"}</SelectItem>
                      {classOptions.map((cn) => (
                        <SelectItem key={cn} value={cn}>{cn}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Semua Risiko" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Risiko</SelectItem>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                  </SelectContent>
                </Select>
                {isSecretary && (
                  <Badge className="bg-blue-100 text-blue-700">Kelas terkunci: {secretaryAssignment.className}</Badge>
                )}
                {isHomeroom && (
                  <Badge className="bg-blue-100 text-blue-700">Kelas wali terkunci: {homeroomAssignment.className}</Badge>
                )}
              </div>

              {isOperator && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 shrink-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah Siswa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Tambah Siswa Baru</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddStudent} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nis">NIS *</Label>
                          <Input id="nis" value={formNis} onChange={(e) => setFormNis(e.target.value)} placeholder="2024xxxx" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Lengkap *</Label>
                          <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nama siswa" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="class">Kelas *</Label>
                          <Select value={formClass} onValueChange={(val) => { setFormClass(val); setFormJurusan(val.split(" ")[1] ?? ""); }} required>
                            <SelectTrigger id="class">
                              <SelectValue placeholder="Pilih kelas" />
                            </SelectTrigger>
                            <SelectContent>
                              {schoolClasses.map((cn) => (
                                <SelectItem key={cn} value={cn}>{cn}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="major">Jurusan</Label>
                          <Input id="major" value={formJurusan} disabled className="bg-gray-50 text-gray-600" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="parentName">Nama Orang Tua</Label>
                          <Input id="parentName" value={formParentName} onChange={(e) => setFormParentName(e.target.value)} placeholder="Opsional" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="parentPhone">No. HP Orang Tua</Label>
                          <Input id="parentPhone" value={formParentPhone} onChange={(e) => setFormParentPhone(e.target.value)} placeholder="08xxxxxxxxxx" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button type="submit" disabled={isSaving} className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                          {isSaving ? (
                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                          ) : "Simpan Siswa"}
                        </Button>
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                          Batal
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">NIS</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Siswa</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kelas</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jurusan</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kehadiran</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Pelanggaran</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">SP</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Risiko</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{student.nis}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.class}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{student.jurusan}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[100px] h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                student.attendancePercentage >= 90 ? "bg-green-600"
                                : student.attendancePercentage >= 75 ? "bg-amber-600"
                                : "bg-red-600"
                              }`}
                              style={{ width: `${student.attendancePercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{student.attendancePercentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          student.violations === 0 ? "bg-green-100 text-green-700"
                          : student.violations <= 3 ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                        }>
                          {student.violations}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          student.sp === 0 ? "bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-white"
                          : student.sp === 1 ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                        }>
                          {student.sp}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          student.riskLevel === "low" ? "bg-green-100 text-green-700 border-green-200"
                          : student.riskLevel === "medium" ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-red-100 text-red-700 border-red-200"
                        }>
                          {student.riskLevel === "low" ? "Rendah" : student.riskLevel === "medium" ? "Sedang" : "Tinggi"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/siswa/${student.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>{isLoading ? "Memuat data siswa..." : error || "Tidak ada siswa yang sesuai filter"}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
