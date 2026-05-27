import { useEffect, useMemo, useState } from "react";
import { Clock, Loader2, Save, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Header } from "../components/layout/header";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

interface ApiStudent {
  id: number;
  name: string;
  nis: string;
  class: string;
  jurusan: string;
}

interface GateAttendance {
  id: number;
  student_id: number;
  student: ApiStudent | null;
  date: string;
  subject: string;
  status: "telat";
  note: string | null;
  created_at: string;
}

const lateReasonOptions = [
  "Tidak ada keterangan",
  "Transportasi",
  "Hujan",
  "Bangun kesiangan",
  "Urusan keluarga",
  "Lainnya",
];

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatTime(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GateAttendancePage() {
  const [students, setStudents] = useState<ApiStudent[]>([]);
  const [gateAttendances, setGateAttendances] = useState<GateAttendance[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [lateReason, setLateReason] = useState("Tidak ada keterangan");
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const today = new Date();
  const todayForApi = formatDateForApi(today);

  async function loadData(signal?: AbortSignal) {
    const [studentsResponse, attendancesResponse] = await Promise.all([
      fetch("/api/students", { signal, headers: { Accept: "application/json" } }),
      fetch("/api/attendances", { signal, headers: { Accept: "application/json" } }),
    ]);

    if (!studentsResponse.ok) {
      throw new Error("Gagal mengambil data siswa.");
    }

    if (!attendancesResponse.ok) {
      throw new Error("Gagal mengambil data presensi terlambat.");
    }

    const loadedStudents = (await studentsResponse.json()) as ApiStudent[];
    const loadedAttendances = (await attendancesResponse.json()) as GateAttendance[];

    setStudents(loadedStudents);
    setGateAttendances(
      loadedAttendances.filter(
        (attendance) =>
          attendance.date === todayForApi &&
          attendance.status === "telat" &&
          attendance.subject === "Presensi Terlambat",
      ),
    );
  }

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        setIsLoading(true);
        setError("");
        await loadData(controller.signal);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    run();

    return () => controller.abort();
  }, []);

  const classOptions = useMemo(
    () => Array.from(new Set(students.map((student) => student.class))).sort(),
    [students],
  );

  const recordedStudentIds = useMemo(
    () => new Set(gateAttendances.map((attendance) => attendance.student_id)),
    [gateAttendances],
  );

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const matchesClass = selectedClass === "all" || student.class === selectedClass;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          student.name.toLowerCase().includes(query) ||
          student.nis.toLowerCase().includes(query);

        return matchesClass && matchesSearch;
      }),
    [searchQuery, selectedClass, students],
  );

  const selectedStudent = students.find((student) => String(student.id) === selectedStudentId);

  async function handleSaveLateAttendance() {
    if (!selectedStudent) {
      toast.error("Pilih siswa yang terlambat terlebih dahulu.");
      return;
    }

    if (recordedStudentIds.has(selectedStudent.id)) {
      toast.error("Siswa ini sudah tercatat terlambat hari ini.");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch("/api/attendances", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: selectedStudent.id,
          date: todayForApi,
          lesson_hour: 1,
          subject: "Presensi Terlambat",
          status: "telat",
          note: `Alasan: ${lateReason}${note.trim() ? `. Catatan PKS: ${note.trim()}` : ""}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? "Gagal mencatat keterlambatan siswa.");
      }

      const savedAttendance = (await response.json()) as GateAttendance;
      setGateAttendances((current) => [savedAttendance, ...current]);
      setSelectedStudentId("");
      setSearchQuery("");
      setLateReason("Tidak ada keterangan");
      setNote("");

      toast.success("Siswa terlambat berhasil dicatat.", {
        description: `${selectedStudent.name} masuk daftar terlambat hari ini.`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <Header title="Presensi Terlambat" breadcrumbs={["Presensi", "Terlambat"]} />

      <div className="w-full p-4 sm:p-6 lg:p-8">
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Terlambat Hari Ini</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">{gateAttendances.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Waktu Batas Telat</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">07:15</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Tanggal</p>
              <p className="mt-1 text-lg font-semibold text-gray-900">
                {today.toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
          <Card>
            <CardHeader>
              <CardTitle>Catat Siswa Terlambat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Cari nama atau NIS siswa..."
                    className="pl-10"
                  />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua kelas</SelectItem>
                    {classOptions.map((className) => (
                      <SelectItem key={className} value={className}>
                        {className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="max-h-[360px] overflow-auto rounded-lg border border-gray-200">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memuat siswa...
                  </div>
                ) : (
                  filteredStudents.map((student) => {
                    const isSelected = selectedStudentId === String(student.id);
                    const isRecorded = recordedStudentIds.has(student.id);

                    return (
                      <button
                        key={student.id}
                        type="button"
                        disabled={isRecorded}
                        onClick={() => setSelectedStudentId(String(student.id))}
                        className={`flex w-full items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 ${
                          isSelected ? "bg-blue-50" : "bg-white hover:bg-gray-50"
                        } ${isRecorded ? "cursor-not-allowed opacity-60" : ""}`}
                      >
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.nis} - {student.class}</p>
                        </div>
                        {isRecorded ? (
                          <Badge className="bg-amber-100 text-amber-700">Sudah tercatat</Badge>
                        ) : (
                          <Badge variant="outline">{student.jurusan}</Badge>
                        )}
                      </button>
                    );
                  })
                )}

                {!isLoading && filteredStudents.length === 0 && (
                  <div className="py-12 text-center text-sm text-gray-500">
                    Tidak ada siswa yang sesuai pencarian.
                  </div>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Alasan terlambat</label>
                  <Select value={lateReason} onValueChange={setLateReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih alasan" />
                    </SelectTrigger>
                    <SelectContent>
                      {lateReasonOptions.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Jam datang</label>
                  <div className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700">
                    <Clock className="h-4 w-4" />
                    Otomatis saat disimpan
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Catatan PKS</label>
                <Textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Contoh: datang pukul 07.45 tanpa surat izin."
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSaveLateAttendance}
                disabled={isSaving || !selectedStudent}
                className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Catat Terlambat
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daftar Terlambat Hari Ini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-blue-700" />
                  <p className="text-sm text-blue-800">
                    Data ini dapat dipantau wali kelas, guru mapel jam pertama, BK, dan kesiswaan.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {gateAttendances.map((attendance) => (
                  <div key={attendance.id} className="rounded-lg border border-gray-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{attendance.student?.name ?? "Siswa"}</p>
                        <p className="text-sm text-gray-500">
                          {attendance.student?.nis ?? "-"} - {attendance.student?.class ?? "-"}
                        </p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700">{formatTime(attendance.created_at)}</Badge>
                    </div>
                    {attendance.note && (
                      <p className="mt-2 text-sm text-gray-600">{attendance.note}</p>
                    )}
                  </div>
                ))}

                {gateAttendances.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center text-sm text-gray-500">
                    Belum ada siswa terlambat yang dicatat hari ini.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
