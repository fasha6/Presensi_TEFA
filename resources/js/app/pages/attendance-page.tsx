import { useState } from "react";
import { Header } from "../components/layout/header";
import { Card, CardContent } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { CheckCircle, Clock, XCircle, FileText, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

type AttendanceStatus = "present" | "late" | "absent" | "permission";

interface Student {
  id: number;
  name: string;
  nis: string;
  status: AttendanceStatus | null;
  notes: string;
}

const mockStudents: Student[] = [
  { id: 1, name: "Ahmad Rizki Maulana", nis: "20240001", status: null, notes: "" },
  { id: 2, name: "Siti Nurhaliza", nis: "20240002", status: null, notes: "" },
  { id: 3, name: "Budi Santoso", nis: "20240003", status: null, notes: "" },
  { id: 4, name: "Devi Anggraini", nis: "20240004", status: null, notes: "" },
  { id: 5, name: "Eko Prasetyo", nis: "20240005", status: null, notes: "" },
  { id: 6, name: "Fatimah Zahra", nis: "20240006", status: null, notes: "" },
  { id: 7, name: "Gilang Ramadhan", nis: "20240007", status: null, notes: "" },
  { id: 8, name: "Hani Safitri", nis: "20240008", status: null, notes: "" },
  { id: 9, name: "Irfan Hakim", nis: "20240009", status: null, notes: "" },
  { id: 10, name: "Jihan Aulia", nis: "20240010", status: null, notes: "" },
  { id: 11, name: "Kurnia Aji", nis: "20240011", status: null, notes: "" },
  { id: 12, name: "Lina Marlina", nis: "20240012", status: null, notes: "" },
  { id: 13, name: "Muhammad Farhan", nis: "20240013", status: null, notes: "" },
  { id: 14, name: "Nadia Putri", nis: "20240014", status: null, notes: "" },
  { id: 15, name: "Omar Abdullah", nis: "20240015", status: null, notes: "" },
];

export function AttendancePage() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const updateStatus = (studentId: number, status: AttendanceStatus) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, status } : s
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setLastSaved(new Date());
    toast.success("Presensi berhasil disimpan!", {
      description: `Data presensi untuk ${selectedClass} telah tersimpan.`,
    });
  };

  const stats = {
    present: students.filter(s => s.status === "present").length,
    late: students.filter(s => s.status === "late").length,
    absent: students.filter(s => s.status === "absent").length,
    permission: students.filter(s => s.status === "permission").length,
    notSet: students.filter(s => s.status === null).length,
  };

  return (
    <div>
      <Header title="Input Presensi" breadcrumbs={["Presensi", "Input Presensi"]} />
      
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1280px]">
        {/* Configuration Section */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-foreground">
                  Kelas
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xii-rpl-1">XII RPL 1</SelectItem>
                    <SelectItem value="xii-rpl-2">XII RPL 2</SelectItem>
                    <SelectItem value="xi-rpl-1">XI RPL 1</SelectItem>
                    <SelectItem value="xi-rpl-2">XI RPL 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-foreground">
                  Mata Pelajaran
                </label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Mapel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pwpb">PWPB</SelectItem>
                    <SelectItem value="pbo">PBO</SelectItem>
                    <SelectItem value="basdat">Basis Data</SelectItem>
                    <SelectItem value="pjok">PJOK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-foreground">
                  Jam Ke-
                </label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jam" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Jam 1 (07:30-08:15)</SelectItem>
                    <SelectItem value="2">Jam 2 (08:15-09:00)</SelectItem>
                    <SelectItem value="3">Jam 3 (09:15-10:00)</SelectItem>
                    <SelectItem value="4">Jam 4 (10:00-10:45)</SelectItem>
                    <SelectItem value="5">Jam 5 (11:00-11:45)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block dark:text-foreground">
                  Tanggal
                </label>
                <div className="h-10 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center text-sm dark:bg-input dark:border-border dark:text-foreground">
                  {new Date().toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Quick View */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <StatPill label="Hadir" value={stats.present} color="bg-green-100 text-green-700" />
          <StatPill label="Terlambat" value={stats.late} color="bg-amber-100 text-amber-700" />
          <StatPill label="Tidak Hadir" value={stats.absent} color="bg-red-100 text-red-700" />
          <StatPill label="Izin" value={stats.permission} color="bg-blue-100 text-blue-700" />
          <StatPill label="Belum Diisi" value={stats.notSet} color="bg-gray-100 text-gray-700" />
        </div>

        {/* Attendance Table */}
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-20 dark:text-foreground">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-border">
                  {students.map((student, index) => (
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
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <StatusButton
                            label="Hadir"
                            icon={CheckCircle}
                            status="present"
                            isActive={student.status === "present"}
                            onClick={() => updateStatus(student.id, "present")}
                          />
                          <StatusButton
                            label="Terlambat"
                            icon={Clock}
                            status="late"
                            isActive={student.status === "late"}
                            onClick={() => updateStatus(student.id, "late")}
                          />
                          <StatusButton
                            label="Tidak Hadir"
                            icon={XCircle}
                            status="absent"
                            isActive={student.status === "absent"}
                            onClick={() => updateStatus(student.id, "absent")}
                          />
                          <StatusButton
                            label="Izin"
                            icon={FileText}
                            status="permission"
                            isActive={student.status === "permission"}
                            onClick={() => updateStatus(student.id, "permission")}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="md:hidden space-y-3 pb-28">
          {students.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:bg-card dark:border-border"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 dark:text-muted-foreground">#{index + 1} • {student.nis}</p>
                  <p className="mt-1 truncate text-base font-semibold text-gray-900 dark:text-foreground">{student.name}</p>
                </div>
                <Button variant="ghost" size="sm" className="shrink-0">
                  <FileText className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <StatusButton
                  label="Hadir"
                  icon={CheckCircle}
                  status="present"
                  isActive={student.status === "present"}
                  onClick={() => updateStatus(student.id, "present")}
                  className="justify-center"
                />
                <StatusButton
                  label="Terlambat"
                  icon={Clock}
                  status="late"
                  isActive={student.status === "late"}
                  onClick={() => updateStatus(student.id, "late")}
                  className="justify-center"
                />
                <StatusButton
                  label="Tidak Hadir"
                  icon={XCircle}
                  status="absent"
                  isActive={student.status === "absent"}
                  onClick={() => updateStatus(student.id, "absent")}
                  className="justify-center"
                />
                <StatusButton
                  label="Izin"
                  icon={FileText}
                  status="permission"
                  isActive={student.status === "permission"}
                  onClick={() => updateStatus(student.id, "permission")}
                  className="justify-center"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sticky Save Button */}
        <motion.div 
          className="fixed inset-x-0 bottom-0 z-50 p-4 sm:inset-x-auto sm:bottom-8 sm:right-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 sm:p-4 dark:bg-card dark:border-border">
            {lastSaved && (
              <p className="text-xs text-gray-500 mb-2 text-center dark:text-muted-foreground">
                Terakhir disimpan: {lastSaved.toLocaleTimeString('id-ID')}
              </p>
            )}
            <Button
              onClick={handleSave}
              disabled={isSaving || stats.notSet === students.length}
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
  icon: any;
  status: AttendanceStatus;
  isActive: boolean;
  onClick: () => void;
  className?: string;
}

function StatusButton({ label, icon: Icon, status, isActive, onClick, className }: StatusButtonProps) {
  const colors = {
    present: "bg-green-600 hover:bg-green-700 border-green-600",
    late: "bg-amber-600 hover:bg-amber-700 border-amber-600",
    absent: "bg-red-600 hover:bg-red-700 border-red-600",
    permission: "bg-blue-600 hover:bg-blue-700 border-blue-600",
  };

  const inactiveColors = {
    present: "border-green-200 text-green-700 hover:bg-green-50 dark:border-emerald-300/50 dark:text-emerald-200 dark:hover:bg-emerald-300/10",
    late: "border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-400/50 dark:text-amber-300 dark:hover:bg-amber-400/10",
    absent: "border-red-200 text-red-700 hover:bg-red-50 dark:border-red-400/50 dark:text-red-300 dark:hover:bg-red-400/10",
    permission: "border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-sky-400/50 dark:text-sky-300 dark:hover:bg-sky-400/10",
  };

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`
        px-3 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2 text-sm font-medium
        ${isActive 
          ? `${colors[status]} text-white shadow-sm` 
          : `${inactiveColors[status]} bg-white`
        }
        ${className ?? ""}
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </motion.button>
  );
}
