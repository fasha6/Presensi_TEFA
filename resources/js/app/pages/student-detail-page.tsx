import { Header } from "../components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Phone, Mail, MapPin, CheckCircle, XCircle, Clock, FileText, AlertTriangle, MessageSquare } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const attendanceTrendData = [
  { week: "Minggu 1", percentage: 100 },
  { week: "Minggu 2", percentage: 95 },
  { week: "Minggu 3", percentage: 90 },
  { week: "Minggu 4", percentage: 85 },
];

const attendanceHistory = [
  { date: "2026-04-14", subject: "PWPB", status: "present", teacher: "Pak Budi" },
  { date: "2026-04-14", subject: "PBO", status: "late", teacher: "Bu Siti" },
  { date: "2026-04-13", subject: "Basis Data", status: "present", teacher: "Pak Ahmad" },
  { date: "2026-04-13", subject: "PJOK", status: "permission", teacher: "Pak Dedi" },
  { date: "2026-04-12", subject: "PWPB", status: "absent", teacher: "Pak Budi" },
  { date: "2026-04-12", subject: "Matematika", status: "present", teacher: "Bu Rina" },
  { date: "2026-04-11", subject: "Bahasa Inggris", status: "present", teacher: "Bu Lina" },
  { date: "2026-04-11", subject: "PBO", status: "present", teacher: "Bu Siti" },
];

const violationHistory = [
  { date: "2026-04-10", type: "Terlambat", description: "Datang terlambat 15 menit", severity: "Ringan", points: 5 },
  { date: "2026-04-05", type: "Tidak Hadir", description: "Tidak hadir tanpa keterangan", severity: "Sedang", points: 10 },
  { date: "2026-03-28", type: "Seragam", description: "Tidak memakai seragam lengkap", severity: "Ringan", points: 3 },
  { date: "2026-03-20", type: "Terlambat", description: "Datang terlambat 30 menit", severity: "Sedang", points: 8 },
];

const spHistory = [
  { 
    number: "SP-001/2026", 
    date: "2026-04-01", 
    type: "SP 1", 
    reason: "Akumulasi keterlambatan 5x dalam 1 bulan",
    status: "active",
    followUp: "Sudah melakukan pembinaan"
  },
];

const counselingNotes = [
  {
    date: "2026-04-08",
    counselor: "Bu Hani (Guru BK)",
    topic: "Pembinaan Kedisiplinan",
    notes: "Siswa mengakui sering terlambat karena jarak rumah jauh. Disarankan untuk berangkat lebih pagi. Orang tua sudah dihubungi.",
    followUp: "Monitoring selama 2 minggu"
  },
  {
    date: "2026-03-15",
    counselor: "Bu Hani (Guru BK)",
    topic: "Konseling Akademik",
    notes: "Membahas penurunan prestasi akademik. Siswa mengalami kesulitan di mata pelajaran matematika.",
    followUp: "Diberikan tutor sebaya"
  },
];

export function StudentDetailPage() {
  const student = {
    id: 1,
    name: "Ahmad Rizki Maulana",
    nis: "20240001",
    class: "X PPL 1",
    photo: null,
    attendancePercentage: 85,
    riskLevel: "medium" as const,
    totalViolations: 4,
    totalSP: 1,
    parent: {
      name: "Bapak Maulana",
      phone: "081234567890",
      email: "maulana@email.com",
      address: "Jl. Merdeka No. 123, Garut"
    }
  };

  return (
    <div>
      <Header 
        title="Detail Siswa" 
        breadcrumbs={["Siswa", student.class, student.name]} 
      />
      
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Student Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  {/* Student Photo */}
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Name & Class */}
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{student.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">NIS: {student.nis}</p>
                  <Badge className="mb-4">{student.class}</Badge>

                  {/* Attendance Percentage */}
                  <div className="my-6">
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#E2E8F0"
                          strokeWidth="8"
                          fill="none"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke={student.attendancePercentage >= 90 ? "#16A34A" : student.attendancePercentage >= 75 ? "#F59E0B" : "#DC2626"}
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - student.attendancePercentage / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{student.attendancePercentage}%</p>
                          <p className="text-xs text-gray-600">Kehadiran</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Tingkat Risiko</p>
                    <Badge 
                      className={
                        student.riskLevel === "high" 
                          ? "bg-red-100 text-red-700 border-red-200" 
                          : student.riskLevel === "medium"
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-green-100 text-green-700 border-green-200"
                      }
                    >
                      {student.riskLevel === "high" ? "Tinggi" : student.riskLevel === "medium" ? "Sedang" : "Rendah"}
                    </Badge>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-semibold text-gray-900">{student.totalViolations}</p>
                      <p className="text-xs text-gray-600">Pelanggaran</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-semibold text-gray-900">{student.totalSP}</p>
                      <p className="text-xs text-gray-600">SP Aktif</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Parent Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Kontak Orang Tua</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{student.parent.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{student.parent.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{student.parent.email}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{student.parent.address}</span>
                </div>
                <Button className="w-full mt-4 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                  Hubungi Orang Tua
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="attendance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="attendance">Kehadiran</TabsTrigger>
                <TabsTrigger value="violations">Pelanggaran</TabsTrigger>
                <TabsTrigger value="sp">SP</TabsTrigger>
                <TabsTrigger value="counseling">Konseling</TabsTrigger>
              </TabsList>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tren Kehadiran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={attendanceTrendData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                        <XAxis dataKey="week" stroke="#64748B" />
                        <YAxis stroke="#64748B" />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="percentage" 
                          stroke="var(--chart-1)" 
                          strokeWidth={3}
                          dot={{ fill: 'var(--chart-1)', r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Riwayat Kehadiran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {attendanceHistory.map((record, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            {record.status === "present" && <CheckCircle className="w-5 h-5 text-green-600" />}
                            {record.status === "late" && <Clock className="w-5 h-5 text-amber-600" />}
                            {record.status === "absent" && <XCircle className="w-5 h-5 text-red-600" />}
                            {record.status === "permission" && <FileText className="w-5 h-5 text-blue-600" />}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{record.subject}</p>
                              <p className="text-xs text-gray-600">{record.teacher} • {new Date(record.date).toLocaleDateString('id-ID')}</p>
                            </div>
                          </div>
                          <Badge
                            className={
                              record.status === "present" ? "bg-green-100 text-green-700" :
                              record.status === "late" ? "bg-amber-100 text-amber-700" :
                              record.status === "absent" ? "bg-red-100 text-red-700" :
                              "bg-blue-100 text-blue-700"
                            }
                          >
                            {record.status === "present" ? "Hadir" :
                             record.status === "late" ? "Terlambat" :
                             record.status === "absent" ? "Tidak Hadir" :
                             "Izin"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Violations Tab */}
              <TabsContent value="violations" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Riwayat Pelanggaran</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {violationHistory.map((violation, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className={`w-5 h-5 ${
                                violation.severity === "Berat" ? "text-red-600" :
                                violation.severity === "Sedang" ? "text-amber-600" :
                                "text-yellow-600"
                              }`} />
                              <div>
                                <p className="font-medium text-gray-900">{violation.type}</p>
                                <p className="text-sm text-gray-600">{new Date(violation.date).toLocaleDateString('id-ID')}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className={
                                violation.severity === "Berat" ? "bg-red-100 text-red-700" :
                                violation.severity === "Sedang" ? "bg-amber-100 text-amber-700" :
                                "bg-yellow-100 text-yellow-700"
                              }>
                                {violation.severity}
                              </Badge>
                              <p className="text-sm text-gray-600 mt-1">{violation.points} poin</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700">{violation.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SP Tab */}
              <TabsContent value="sp" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Riwayat Surat Peringatan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {spHistory.map((sp, index) => (
                        <div key={index} className="p-4 border-2 border-red-200 bg-red-50 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-semibold text-gray-900">{sp.number}</p>
                              <p className="text-sm text-gray-600">{new Date(sp.date).toLocaleDateString('id-ID')}</p>
                            </div>
                            <Badge className={sp.status === "active" ? "bg-red-600 text-white" : "bg-gray-400 text-white"}>
                              {sp.status === "active" ? "Aktif" : "Selesai"}
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <Badge className="bg-red-700 text-white mb-2">{sp.type}</Badge>
                            <p className="text-sm text-gray-900">{sp.reason}</p>
                          </div>

                          <div className="bg-white rounded p-3 mt-3">
                            <p className="text-xs font-medium text-gray-700 mb-1">Tindak Lanjut:</p>
                            <p className="text-sm text-gray-900">{sp.followUp}</p>
                          </div>

                          {/* Timeline Visualization */}
                          <div className="mt-4 flex items-center gap-2">
                            <div className="flex-1 h-2 bg-red-300 rounded-full">
                              <div className="h-2 bg-red-600 rounded-full" style={{ width: "60%" }}></div>
                            </div>
                            <span className="text-xs text-gray-600">60% periode berlalu</span>
                          </div>
                        </div>
                      ))}

                      {spHistory.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 opacity-20" />
                          <p>Tidak ada riwayat SP</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Counseling Tab */}
              <TabsContent value="counseling" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Catatan Konseling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {counselingNotes.map((note, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start gap-3 mb-3">
                            <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="font-medium text-gray-900">{note.topic}</p>
                                  <p className="text-sm text-gray-600">{note.counselor}</p>
                                </div>
                                <p className="text-sm text-gray-500">{new Date(note.date).toLocaleDateString('id-ID')}</p>
                              </div>
                              <p className="text-sm text-gray-700 mb-2">{note.notes}</p>
                              <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-2">
                                <p className="text-xs font-medium text-blue-900">Tindak Lanjut:</p>
                                <p className="text-sm text-blue-800">{note.followUp}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
