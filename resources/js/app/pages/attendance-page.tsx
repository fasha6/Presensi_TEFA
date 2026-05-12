import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/layout/header";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { CheckCircle, Clock, XCircle, FileText, Save, Loader2, HeartPulse } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { useAuth } from "../lib/auth";
import {
  getAllowedClassesForRole,
  getDefaultClassForRole,
  getTeacherScheduleByClass,
  isClassAllowedForRole,
  secretaryAssignment,
  teacherScheduleToday,
} from "../lib/role-scope";

type AttendanceStatus = "hadir" | "telat" | "alpha" | "izin" | "sakit";

interface ApiStudent {
  id: number;
  name: string;
  nis: string;
  class: string;
  jurusan: string;
}

interface Student extends ApiStudent {
  status: AttendanceStatus | null;
  notes: string;
}

const subjectOptions = ["PWPB", "PBO", "Basis Data", "PJOK"];

const sessionOptions = [
  { value: "1", label: "Jam 1 (07:30-08:15)" },
  { value: "2", label: "Jam 2 (08:15-09:00)" },
  { value: "3", label: "Jam 3 (09:15-10:00)" },
  { value: "4", label: "Jam 4 (10:00-10:45)" },
  { value: "5", label: "Jam 5 (11:00-11:45)" },
];

const statusOptions = [
  { label: "Hadir", status: "hadir", icon: CheckCircle },
  { label: "Terlambat", status: "telat", icon: Clock },
  { label: "Alpha", status: "alpha", icon: XCircle },
  { label: "Izin", status: "izin", icon: FileText },
  { label: "Sakit", status: "sakit", icon: HeartPulse },
] satisfies Array<{
  label: string;
  status: AttendanceStatus;
  icon: typeof CheckCircle;
}>;

function formatDateForApi(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function AttendancePage() {
  const { user } = useAuth();
  const role = user?.role;
  const isSecretary = role === "secretary";
  const isTeacher = role === "teacher";
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStudents() {
      try {
        setIsLoadingStudents(true);
        setLoadError("");

        const response = await fetch("/api/students", {
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data siswa.");
        }

        const data = (await response.json()) as ApiStudent[];
        const loadedStudents = data.map((student) => ({
          ...student,
          status: null,
          notes: "",
        }));

        setStudents(loadedStudents);

        const defaultClass = getDefaultClassForRole(role);
        const firstAllowedClass = loadedStudents.find((student) =>
          isClassAllowedForRole(student.class, role),
        )?.class;
        const firstClass = defaultClass || firstAllowedClass || loadedStudents.find((student) => student.class)?.class;

        if (firstClass) {
          setSelectedClass((currentClass) => currentClass || firstClass);
        }

        if (isSecretary) {
          setSelectedSubject("Presensi awal hari");
          setSelectedSession("1");
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setLoadError(err instanceof Error ? err.message : "Terjadi kesalahan saat mengambil data siswa.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingStudents(false);
        }
      }
    }

    loadStudents();

    return () => controller.abort();
  }, [isSecretary, role]);

  const classOptions = useMemo(() => {
    const availableClasses = Array.from(new Set(students.map((student) => student.class))).sort();
    const allowedClasses = getAllowedClassesForRole(role);

    if (!allowedClasses) {
      return availableClasses;
    }

    return allowedClasses.filter((className) => availableClasses.includes(className));
  }, [role, students]);

  const visibleStudents = useMemo(
    () => students.filter((student) => (!selectedClass || student.class === selectedClass) && isClassAllowedForRole(student.class, role)),
    [role, selectedClass, students],
  );

  const activeTeacherSchedule = isTeacher ? getTeacherScheduleByClass(selectedClass) : null;

  useEffect(() => {
    if (!activeTeacherSchedule) {
      return;
    }

    setSelectedSubject((currentSubject) => currentSubject || activeTeacherSchedule.subject);
    setSelectedSession((currentSession) => currentSession || activeTeacherSchedule.session);
  }, [activeTeacherSchedule]);

  const today = new Date();
  const todayForApi = formatDateForApi(today);

  const updateStatus = (studentId: number, status: AttendanceStatus) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId ? { ...student, status } : student,
      ),
    );
  };

  const updateNotes = (studentId: number, notes: string) => {
    setStudents((currentStudents) =>
      currentStudents.map((student) =>
        student.id === studentId ? { ...student, notes } : student,
      ),
    );
  };

  const handleSave = async () => {
    const subjectForPayload = isSecretary ? "Presensi awal hari" : selectedSubject;
    const sessionForPayload = isSecretary ? 1 : Number(selectedSession);

    if (!selectedClass || !subjectForPayload || !sessionForPayload) {
      toast.error("Lengkapi kelas, mata pelajaran, dan jam pelajaran terlebih dahulu.");
      return;
    }

    const attendanceRows = visibleStudents.filter((student) => student.status);

    if (attendanceRows.length === 0) {
      toast.error("Isi minimal satu status presensi siswa.");
      return;
    }

    try {
      setIsSaving(true);

      const responses = await Promise.all(
        attendanceRows.map((student) =>
          fetch("/api/attendances", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              student_id: student.id,
              date: todayForApi,
              lesson_hour: sessionForPayload,
              subject: subjectForPayload,
              status: student.status,
              note: student.notes.trim() || null,
              created_by: isSecretary
                ? `${user?.name ?? "Sekretaris"} - Sekretaris ${secretaryAssignment.className}`
                : `${user?.name ?? "Guru Mapel"} - Guru Mapel`,
            }),
          }),
        ),
      );

      const failedResponse = responses.find((response) => !response.ok);

      if (failedResponse) {
        let message = "Sebagian data presensi gagal disimpan.";

        try {
          const errorData = await failedResponse.json();
          message = errorData.message ?? message;
        } catch {
          // Keep the default message when the backend returns a non-JSON error.
        }

        throw new Error(message);
      }

      setLastSaved(new Date());
      toast.success("Presensi berhasil disimpan!", {
        description: isSecretary
          ? `${attendanceRows.length} data presensi awal hari ${selectedClass} tersimpan oleh ${user?.name}.`
          : `${attendanceRows.length} data presensi ${subjectForPayload} untuk ${selectedClass} telah tersimpan.`,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan presensi.");
    } finally {
      setIsSaving(false);
    }
  };

  const stats = {
    hadir: visibleStudents.filter((student) => student.status === "hadir").length,
    telat: visibleStudents.filter((student) => student.status === "telat").length,
    alpha: visibleStudents.filter((student) => student.status === "alpha").length,
    izin: visibleStudents.filter((student) => student.status === "izin").length,
    sakit: visibleStudents.filter((student) => student.status === "sakit").length,
    notSet: visibleStudents.filter((student) => student.status === null).length,
  };

  const canSave =
    !isSaving &&
    !isLoadingStudents &&
    visibleStudents.length > 0 &&
    visibleStudents.some((student) => student.status);

  return (
    <div>
      <Header title="Input Presensi" breadcrumbs={["Presensi", "Input Presensi"]} />

      <div className="w-full p-4 sm:p-6 lg:p-8">
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-foreground">
                  Kelas
                </label>
                {isSecretary ? (
                  <div className="h-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center text-sm dark:bg-input dark:border-border dark:text-foreground">
                    {secretaryAssignment.className}
                  </div>
                ) : (
                  <Select value={selectedClass} onValueChange={setSelectedClass} disabled={isLoadingStudents}>
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingStudents ? "Memuat kelas..." : "Pilih Kelas"} />
                    </SelectTrigger>
                    <SelectContent>
                      {classOptions.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {!isSecretary && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-foreground">
                    Mata Pelajaran
                  </label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder={activeTeacherSchedule ? activeTeacherSchedule.subject : "Pilih Mapel"} />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!isSecretary && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-foreground">
                    Jam Ke-
                  </label>
                  <Select value={selectedSession} onValueChange={setSelectedSession}>
                    <SelectTrigger>
                      <SelectValue placeholder={activeTeacherSchedule ? `Jam ${activeTeacherSchedule.session} (${activeTeacherSchedule.time})` : "Pilih Jam"} />
                    </SelectTrigger>
                    <SelectContent>
                      {sessionOptions.map((session) => (
                        <SelectItem key={session.value} value={session.value}>
                          {session.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-foreground">
                  Tanggal
                </label>
                <div className="h-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center text-sm dark:bg-input dark:border-border dark:text-foreground">
                  {today.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
            {isSecretary && (
              <p className="mt-4 text-sm text-gray-600 dark:text-muted-foreground">
                {secretaryAssignment.assignmentLabel}: {secretaryAssignment.assignedBy}. Presensi sekretaris hanya sekali untuk awal hari dan tercatat sebagai input kelas {secretaryAssignment.className}.
              </p>
            )}
            {isTeacher && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-400/40 dark:bg-blue-400/10 dark:text-blue-100">
                Jadwal hari ini: {teacherScheduleToday.map((item) => `${item.className} - ${item.subject} jam ${item.session}`).join(", ")}. Guru mapel boleh menambah catatan alpha jika siswa tidak ada saat pergantian mapel.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatPill label="Hadir" value={stats.hadir} color="bg-green-100 text-green-700" />
          <StatPill label="Terlambat" value={stats.telat} color="bg-amber-100 text-amber-700" />
          <StatPill label="Alpha" value={stats.alpha} color="bg-red-100 text-red-700" />
          <StatPill label="Izin" value={stats.izin} color="bg-blue-100 text-blue-700" />
          <StatPill label="Sakit" value={stats.sakit} color="bg-purple-100 text-purple-700" />
          <StatPill label="Belum Diisi" value={stats.notSet} color="bg-gray-100 text-gray-700" />
        </div>

        {loadError && (
          <Card className="mb-4 sm:mb-6 border-red-200 bg-red-50 dark:border-red-400/40 dark:bg-red-400/10">
            <CardContent className="p-4 text-sm text-red-700 dark:text-red-200">
              {loadError}
            </CardContent>
          </Card>
        )}

        <Card className="hidden md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 dark:bg-[#182229] dark:border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-16 dark:text-foreground">No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-32 dark:text-foreground">NIS</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-foreground">Nama Siswa</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-foreground">Status Kehadiran</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 min-w-56 dark:text-foreground">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-border">
                  {visibleStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-gray-50 transition-colors dark:hover:bg-[#233138]"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-foreground">{index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-muted-foreground">{student.nis}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-foreground">{student.name}</p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-muted-foreground">{student.class}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {statusOptions.map((option) => (
                            <StatusButton
                              key={option.status}
                              label={option.label}
                              icon={option.icon}
                              status={option.status}
                              isActive={student.status === option.status}
                              onClick={() => updateStatus(student.id, option.status)}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <input
                          value={student.notes}
                          onChange={(event) => updateNotes(student.id, event.target.value)}
                          placeholder="Opsional"
                          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#1E3A8A] dark:border-border dark:bg-input dark:text-foreground"
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {visibleStudents.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-muted-foreground">
                  <p>
                    {isLoadingStudents
                      ? "Memuat data siswa..."
                      : loadError || "Tidak ada siswa untuk kelas yang dipilih."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="md:hidden space-y-3 pb-28">
          {visibleStudents.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center text-sm text-gray-500 dark:text-muted-foreground">
                {isLoadingStudents
                  ? "Memuat data siswa..."
                  : loadError || "Tidak ada siswa untuk kelas yang dipilih."}
              </CardContent>
            </Card>
          )}

          {visibleStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:bg-card dark:border-border"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-muted-foreground">
                    #{index + 1} - {student.nis}
                  </p>
                  <p className="mt-1 truncate text-base font-semibold text-gray-900 dark:text-foreground">{student.name}</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-muted-foreground">{student.class}</p>
                </div>
                <FileText className="mt-1 h-4 w-4 shrink-0 text-gray-400" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {statusOptions.map((option) => (
                  <StatusButton
                    key={option.status}
                    label={option.label}
                    icon={option.icon}
                    status={option.status}
                    isActive={student.status === option.status}
                    onClick={() => updateStatus(student.id, option.status)}
                    className="justify-center"
                  />
                ))}
              </div>

              <input
                value={student.notes}
                onChange={(event) => updateNotes(student.id, event.target.value)}
                placeholder="Catatan opsional"
                className="mt-3 h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#1E3A8A] dark:border-border dark:bg-input dark:text-foreground"
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="fixed inset-x-0 bottom-0 z-50 p-4 sm:inset-x-auto sm:bottom-8 sm:right-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 sm:p-4 dark:bg-card dark:border-border">
            {lastSaved && (
              <p className="text-xs text-gray-500 mb-2 text-center dark:text-muted-foreground">
                Terakhir disimpan: {lastSaved.toLocaleTimeString("id-ID")}
              </p>
            )}
            <Button
              onClick={handleSave}
              disabled={!canSave}
              className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              size="lg"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Simpan Presensi
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`${color} rounded-lg px-3 py-3 text-center`}>
      <p className="text-xl sm:text-2xl font-semibold">{value}</p>
      <p className="text-xs sm:text-sm">{label}</p>
    </div>
  );
}

interface StatusButtonProps {
  label: string;
  icon: typeof CheckCircle;
  status: AttendanceStatus;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

function StatusButton({ label, icon: Icon, status, isActive, onClick, className }: StatusButtonProps) {
  const colors = {
    hadir: "bg-green-600 hover:bg-green-700 border-green-600",
    telat: "bg-amber-600 hover:bg-amber-700 border-amber-600",
    alpha: "bg-red-600 hover:bg-red-700 border-red-600",
    izin: "bg-blue-600 hover:bg-blue-700 border-blue-600",
    sakit: "bg-purple-600 hover:bg-purple-700 border-purple-600",
  };

  const inactiveColors = {
    hadir: "border-green-200 text-green-700 hover:bg-green-50 dark:border-emerald-300/50 dark:text-emerald-200 dark:hover:bg-emerald-300/10",
    telat: "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-400/50 dark:text-amber-300 dark:hover:bg-amber-400/10",
    alpha: "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-400/50 dark:text-red-300 dark:hover:bg-red-400/10",
    izin: "border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-sky-400/50 dark:text-sky-300 dark:hover:bg-sky-400/10",
    sakit: "border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-400/50 dark:text-purple-300 dark:hover:bg-purple-400/10",
  };

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`
        px-3 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 text-sm font-medium
        ${isActive
          ? `${colors[status]} text-white shadow-sm`
          : `${inactiveColors[status]} bg-white dark:bg-card`
        }
        ${className ?? ""}
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </motion.button>
  );
}
