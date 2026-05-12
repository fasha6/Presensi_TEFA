import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../components/layout/header";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, Filter, Eye, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "../lib/auth";
import { getAllowedClassesForRole, isClassAllowedForRole, secretaryAssignment } from "../lib/role-scope";

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
  const isSecretary = role === "secretary";
  const isTeacher = role === "teacher";
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterJurusan, setFilterJurusan] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudents() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/students", {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data siswa.");
        }

        const data = (await response.json()) as Student[];
        setStudents(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data siswa.");
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();

    return () => controller.abort();
  }, []);

  const roleScopedStudents = students.filter((student) => isClassAllowedForRole(student.class, role));

  const filteredStudents = roleScopedStudents.filter(student => {
    if (searchQuery && !student.name.toLowerCase().includes(searchQuery.toLowerCase()) && !student.nis.includes(searchQuery)) return false;
    if (!isSecretary && filterClass !== "all" && !student.class.includes(filterClass)) return false;
    if (!isSecretary && filterJurusan !== "all" && student.jurusan !== filterJurusan) return false;
    if (filterRisk !== "all" && student.riskLevel !== filterRisk) return false;
    return true;
  });

  const stats = {
    total: roleScopedStudents.length,
    high: roleScopedStudents.filter(s => s.attendancePercentage >= 90).length,
    medium: roleScopedStudents.filter(s => s.attendancePercentage >= 75 && s.attendancePercentage < 90).length,
    low: roleScopedStudents.filter(s => s.attendancePercentage < 75).length,
  };
  const allowedClasses = getAllowedClassesForRole(role);

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
                <p className="text-xs text-gray-500">&lt;75%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari nama atau NIS/USN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {!isSecretary && (
                <Select value={filterJurusan} onValueChange={setFilterJurusan}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Semua Jurusan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jurusan</SelectItem>
                    <SelectItem value="RPL">RPL</SelectItem>
                    <SelectItem value="TKJ">TKJ</SelectItem>
                    <SelectItem value="MM">MM</SelectItem>
                    <SelectItem value="OTKP">OTKP</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {!isSecretary && (
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={isTeacher ? "Kelas yang diajar" : "Semua Kelas"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{isTeacher ? "Semua Kelas Jadwal" : "Semua Kelas"}</SelectItem>
                    {(allowedClasses ?? ["XII", "XI", "X"]).map((className) => (
                      <SelectItem key={className} value={className}>
                        {allowedClasses ? className : `Kelas ${className}`}
                      </SelectItem>
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
                <Badge className="bg-blue-100 text-blue-700">
                  Kelas terkunci: {secretaryAssignment.className}
                </Badge>
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
                                student.attendancePercentage >= 90 ? "bg-green-600" :
                                student.attendancePercentage >= 75 ? "bg-amber-600" :
                                "bg-red-600"
                              }`}
                              style={{ width: `${student.attendancePercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{student.attendancePercentage}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          student.violations === 0 ? "bg-green-100 text-green-700" :
                          student.violations <= 3 ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }>
                          {student.violations}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          student.sp === 0 ? "bg-gray-100 text-gray-700 dark:bg-slate-600 dark:text-white" :
                          student.sp === 1 ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }>
                          {student.sp}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          student.riskLevel === "low" ? "bg-green-100 text-green-700 border-green-200" :
                          student.riskLevel === "medium" ? "bg-amber-100 text-amber-700 border-amber-200" :
                          "bg-red-100 text-red-700 border-red-200"
                        }>
                          {student.riskLevel === "low" ? "Rendah" :
                           student.riskLevel === "medium" ? "Sedang" : "Tinggi"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/siswa/${student.id}`)}
                        >
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
                  <p>
                    {isLoading
                      ? "Memuat data siswa..."
                      : error || "Tidak ada siswa yang sesuai filter"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
