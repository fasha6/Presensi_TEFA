import { Header } from "../components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Users, CheckCircle, Clock, XCircle, TrendingUp, AlertTriangle, FileText, CalendarDays, Bell as BellIcon, ClipboardCheck, ShieldCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Badge } from "../components/ui/badge";
import { DemoRole, useAuth } from "../lib/auth";

const attendanceTrendData = [
  { name: "Sen", hadir: 285, izin: 10, sakit: 5, alpha: 0 },
  { name: "Sel", hadir: 280, izin: 12, sakit: 6, alpha: 2 },
  { name: "Rab", hadir: 290, izin: 5, sakit: 3, alpha: 2 },
  { name: "Kam", hadir: 288, izin: 8, sakit: 2, alpha: 2 },
  { name: "Jum", hadir: 275, izin: 15, sakit: 5, alpha: 5 },
];

const jurusanData = [
  { name: "RPL", percentage: 95 },
  { name: "TKJ", percentage: 92 },
  { name: "MM", percentage: 88 },
  { name: "OTKP", percentage: 90 },
];

const statusDistribution = [
  { name: "Hadir", value: 285, color: "#16A34A" },
  { name: "Izin", value: 10, color: "#2563EB" },
  { name: "Sakit", value: 3, color: "#F59E0B" },
  { name: "Alpha", value: 2, color: "#DC2626" },
];

const chartTextColor = "var(--muted-foreground)";
const chartGridColor = "var(--border)";
const chartPrimaryColor = "var(--chart-1)";

export function DashboardPage() {
  const { user } = useAuth();
  const effectiveRole = user?.role ?? "teacher";

  return (
    <div>
      <Header title="Dashboard" breadcrumbs={["Dashboard"]} />
      
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <RoleDashboard role={effectiveRole} />
      </div>
    </div>
  );
}

function RoleDashboard({ role }: { role: DemoRole }) {
  if (role === "student") {
    return <StudentDashboard />;
  }

  if (role === "parent") {
    return <ParentDashboard />;
  }

  if (role === "teacher") {
    return <TeacherDashboard />;
  }

  if (role === "secretary") {
    return <SecretaryDashboard />;
  }

  if (role === "homeroom") {
    return <HomeroomDashboard />;
  }

  if (role === "bk" || role === "student_affairs") {
    return <BKDashboard />;
  }

  if (role === "major_head") {
    return <MajorHeadDashboard />;
  }

  if (role === "curriculum") {
    return <CurriculumDashboard />;
  }

  if (role === "operator") {
    return <OperatorDashboard />;
  }

  return <PrincipalDashboard />;
}

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Kehadiran Bulan Ini"
          value="85%"
          subtitle="Target minimal 90%"
          icon={TrendingUp}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Terlambat"
          value="2"
          subtitle="Bulan ini"
          icon={Clock}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="SP Aktif"
          value="1"
          icon={FileText}
          iconColor="bg-red-100 text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Saya</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Nama</span>
              <span className="font-medium">Ahmad Rizki Maulana</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Kelas</span>
              <span className="font-medium">XII RPL 1</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">NIS</span>
              <span className="font-medium">20240001</span>
            </div>
            <Button asChild className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 dark:bg-primary dark:text-primary-foreground">
              <a href="/siswa/1">Lihat Profil dan Riwayat</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Jadwal Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ScheduleItem time="07:30 - 09:00" class="XII RPL 1" subject="PWPB" status="completed" />
              <ScheduleItem time="09:15 - 10:45" class="XII RPL 1" subject="PBO" status="current" />
              <ScheduleItem time="11:00 - 12:30" class="XII RPL 1" subject="Basis Data" status="upcoming" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ParentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Kehadiran Anak"
          value="85%"
          subtitle="Bulan ini"
          icon={TrendingUp}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Terlambat"
          value="2"
          subtitle="Perlu perhatian"
          icon={Clock}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Notifikasi"
          value="3"
          subtitle="Terkirim ke WA"
          icon={BellIcon}
          iconColor="bg-blue-100 text-blue-600"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Anak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Nama</span>
            <span className="font-medium">Ahmad Rizki Maulana</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Kelas</span>
            <span className="font-medium">XII RPL 1</span>
          </div>
          <div className="flex justify-between border-b pb-3">
            <span className="text-gray-600">Status Terakhir</span>
            <Badge className="bg-green-100 text-green-700">Hadir</Badge>
          </div>
          <Button asChild className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 dark:bg-primary dark:text-primary-foreground">
            <a href="/siswa/1">Lihat Detail Anak</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TeacherDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Siswa Hari Ini"
          value="300"
          icon={Users}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Hadir"
          value="285"
          subtitle="95%"
          icon={CheckCircle}
          iconColor="bg-green-100 text-green-600"
        />
        <StatCard
          title="Terlambat"
          value="8"
          subtitle="2.7%"
          icon={Clock}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="Tidak Hadir"
          value="7"
          subtitle="2.3%"
          icon={XCircle}
          iconColor="bg-red-100 text-red-600"
        />
      </div>

      {/* Quick Action */}
      <Card>
        <CardHeader>
          <CardTitle>Mulai Presensi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xii-rpl-1">XII RPL 1</SelectItem>
                    <SelectItem value="xii-rpl-2">XII RPL 2</SelectItem>
                    <SelectItem value="xi-rpl-1">XI RPL 1</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Mata Pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pwpb">PWPB</SelectItem>
                    <SelectItem value="pbo">PBO</SelectItem>
                    <SelectItem value="basdat">Basis Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                Mulai Input Presensi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Jadwal Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ScheduleItem time="07:30 - 09:00" class="XII RPL 1" subject="PWPB" status="completed" />
              <ScheduleItem time="09:15 - 10:45" class="XII RPL 2" subject="PBO" status="current" />
              <ScheduleItem time="11:00 - 12:30" class="XI RPL 1" subject="Basis Data" status="upcoming" />
              <ScheduleItem time="13:00 - 14:30" class="XI RPL 2" subject="PWPB" status="upcoming" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                title="Presensi XII RPL 1 - PWPB"
                description="30 siswa hadir, 2 izin"
                time="5 menit lalu"
              />
              <ActivityItem
                title="Presensi XI RPL 2 - PBO"
                description="28 siswa hadir, 1 sakit, 1 alpha"
                time="1 jam lalu"
              />
              <ActivityItem
                title="Presensi XII TKJ 1 - Jaringan"
                description="32 siswa hadir"
                time="2 jam lalu"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <AuditLogPanel />
    </div>
  );
}

function SecretaryDashboard() {
  return (
    <div className="space-y-6">
      <ScopeNotice title="Akses Sekretaris" description="Hanya kelas XII RPL 1. Fokus pada input presensi kelas dan pantauan alpha berulang." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Siswa Kelas" value="36" icon={Users} iconColor="bg-blue-100 text-blue-600" />
        <StatCard title="Hadir Hari Ini" value="32" subtitle="88.9%" icon={CheckCircle} iconColor="bg-green-100 text-green-600" />
        <StatCard title="Belum Diinput" value="1" subtitle="Jam pelajaran" icon={ClipboardCheck} iconColor="bg-amber-100 text-amber-600" />
        <StatCard title="Alpha Berulang" value="3" subtitle="Butuh follow-up" icon={AlertTriangle} iconColor="bg-red-100 text-red-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Presensi Kelas Hari Ini</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ScheduleItem time="07:30 - 09:00" class="XII RPL 1" subject="PWPB" status="completed" />
            <ScheduleItem time="09:15 - 10:45" class="XII RPL 1" subject="PBO" status="current" />
            <ScheduleItem time="11:00 - 12:30" class="XII RPL 1" subject="Basis Data" status="upcoming" />
            <Button asChild className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
              <a href="/presensi">Input Presensi Kelas</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perlu Dikonfirmasi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <AlertStudent name="Ahmad Rizki Maulana" absences={5} violations={2} />
            <AlertStudent name="Siti Nurhaliza" absences={4} violations={1} />
          </CardContent>
        </Card>
      </div>

      <AuditLogPanel />
    </div>
  );
}

function HomeroomDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Persentase Kehadiran"
          value="94.5%"
          icon={TrendingUp}
          iconColor="bg-green-100 text-green-600"
          trend="+2.3%"
        />
        <StatCard
          title="Total Siswa"
          value="36"
          icon={Users}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Pelanggaran Bulan Ini"
          value="12"
          icon={AlertTriangle}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="SP Aktif"
          value="3"
          icon={FileText}
          iconColor="bg-red-100 text-red-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tren Kehadiran Minggu Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="hadir" stroke="#16A34A" strokeWidth={2} />
                <Line type="monotone" dataKey="izin" stroke="#2563EB" strokeWidth={2} />
                <Line type="monotone" dataKey="alpha" stroke="#DC2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Status Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alert Students */}
      <Card>
        <CardHeader>
          <CardTitle>Siswa Perlu Perhatian (Absen ≥3x)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AlertStudent name="Ahmad Rizki Maulana" absences={5} violations={2} />
            <AlertStudent name="Siti Nurhaliza" absences={4} violations={1} />
            <AlertStudent name="Budi Santoso" absences={3} violations={0} />
          </div>
        </CardContent>
      </Card>

      <AuditLogPanel />
    </div>
  );
}

function BKDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Siswa Berisiko Tinggi"
          value="8"
          icon={AlertTriangle}
          iconColor="bg-red-100 text-red-600"
        />
        <StatCard
          title="Total Pelanggaran"
          value="45"
          subtitle="Bulan ini"
          icon={FileText}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="SP Diterbitkan"
          value="12"
          subtitle="Bulan ini"
          icon={FileText}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Konseling Selesai"
          value="28"
          subtitle="Bulan ini"
          icon={CheckCircle}
          iconColor="bg-green-100 text-green-600"
        />
      </div>

      {/* Violation Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Pelanggaran</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" stroke="#64748B" />
              <YAxis stroke="#64748B" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="alpha" stroke="#DC2626" strokeWidth={2} name="Pelanggaran" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* High Risk Students */}
      <Card>
        <CardHeader>
          <CardTitle>Siswa Berisiko Tinggi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <RiskStudent name="Ahmad Rizki Maulana" class="XII RPL 1" violations={8} sp={2} level="high" />
            <RiskStudent name="Dedi Kurniawan" class="XI TKJ 2" violations={6} sp={1} level="high" />
            <RiskStudent name="Rina Amelia" class="XII MM 1" violations={5} sp={1} level="medium" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PrincipalDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tingkat Kehadiran Global"
          value="92.8%"
          icon={TrendingUp}
          iconColor="bg-green-100 text-green-600"
          trend="+1.2%"
        />
        <StatCard
          title="Total Siswa"
          value="1,248"
          icon={Users}
          iconColor="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Pelanggaran Bulan Ini"
          value="45"
          icon={AlertTriangle}
          iconColor="bg-amber-100 text-amber-600"
        />
        <StatCard
          title="SP Aktif"
          value="12"
          icon={FileText}
          iconColor="bg-red-100 text-red-600"
        />
      </div>

      {/* Jurusan Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Kehadiran per Jurusan</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jurusanData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis dataKey="name" stroke={chartTextColor} />
              <YAxis stroke={chartTextColor} />
              <Tooltip />
              <Legend wrapperStyle={{ color: chartTextColor }} />
              <Bar dataKey="percentage" fill={chartPrimaryColor} radius={[8, 8, 0, 0]} name="Persentase Kehadiran %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Disiplin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pelanggaran Ringan</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">28</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pelanggaran Sedang</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">12</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pelanggaran Berat</span>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">5</Badge>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center font-medium">
                  <span>Total</span>
                  <span className="text-lg">45</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analitik Bulan Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rata-rata Kehadiran</span>
                <span className="font-semibold text-green-600">92.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kelas Terbaik</span>
                <span className="font-semibold">XII RPL 1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Jurusan Terbaik</span>
                <span className="font-semibold">RPL (95%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">SP Terselesaikan</span>
                <span className="font-semibold text-blue-600">8/12</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MajorHeadDashboard() {
  return (
    <div className="space-y-6">
      <ScopeNotice title="Akses Kaprodi" description="Rekap jurusan RPL. Tidak menginput presensi langsung, fokus evaluasi kelas dan tren jurusan." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Siswa RPL" value="432" icon={Users} iconColor="bg-blue-100 text-blue-600" />
        <StatCard title="Kehadiran RPL" value="95%" icon={TrendingUp} iconColor="bg-green-100 text-green-600" trend="+1.8%" />
        <StatCard title="Kelas Perlu Perhatian" value="2" icon={AlertTriangle} iconColor="bg-amber-100 text-amber-600" />
        <StatCard title="SP Aktif" value="6" icon={FileText} iconColor="bg-red-100 text-red-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Kehadiran Kelas RPL</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[
              { name: "X RPL 1", percentage: 96 },
              { name: "XI RPL 1", percentage: 92 },
              { name: "XII RPL 1", percentage: 95 },
              { name: "XII RPL 2", percentage: 89 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
              <XAxis dataKey="name" stroke={chartTextColor} />
              <YAxis stroke={chartTextColor} />
              <Tooltip />
              <Bar dataKey="percentage" fill={chartPrimaryColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

function CurriculumDashboard() {
  return (
    <div className="space-y-6">
      <ScopeNotice title="Akses Waka Kurikulum" description="Fokus data akademik: jadwal, mapel, agenda blok 6 minggu, dan keterisian presensi." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Jadwal Aktif" value="128" icon={CalendarDays} iconColor="bg-blue-100 text-blue-600" />
        <StatCard title="Presensi Terisi" value="91%" icon={ClipboardCheck} iconColor="bg-green-100 text-green-600" />
        <StatCard title="Jadwal Blok" value="Minggu 4/6" icon={Clock} iconColor="bg-amber-100 text-amber-600" />
        <StatCard title="Mapel Tanpa Input" value="7" icon={AlertTriangle} iconColor="bg-red-100 text-red-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agenda Blok 6 Minggu</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <BlockWeek label="Minggu 1-2" status="Selesai" detail="Dasar kompetensi dan orientasi proyek" />
          <BlockWeek label="Minggu 3-4" status="Berjalan" detail="Praktik inti dan presensi per jam" />
          <BlockWeek label="Minggu 5-6" status="Berikutnya" detail="Assessment, remedial, dan rekap akhir" />
        </CardContent>
      </Card>
    </div>
  );
}

function OperatorDashboard() {
  return (
    <div className="space-y-6">
      <ScopeNotice title="Akses Operator" description="Akses data master dan pemeliharaan sistem. Role ini dipakai untuk menjaga integrasi data." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Data Siswa" value="1,248" icon={Users} iconColor="bg-blue-100 text-blue-600" />
        <StatCard title="Akun Aktif" value="1,386" icon={ShieldCheck} iconColor="bg-green-100 text-green-600" />
        <StatCard title="Notifikasi Queue" value="14" icon={BellIcon} iconColor="bg-amber-100 text-amber-600" />
        <StatCard title="Data Perlu Sinkron" value="3" icon={AlertTriangle} iconColor="bg-red-100 text-red-600" />
      </div>

      <AuditLogPanel />
    </div>
  );
}

// Helper Components
interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  iconColor: string;
  trend?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, iconColor, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            {trend && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {trend}
              </p>
            )}
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ScopeNotice({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-1 h-5 w-5 text-blue-600" />
          <div>
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AuditLogPanel() {
  const logs = [
    { actor: "Pak Budi", action: "mengubah status Ahmad", from: "Alpha", to: "Izin", time: "10:18", reason: "Surat izin diterima" },
    { actor: "Nadia Putri", action: "menginput presensi XII RPL 1", from: "-", to: "Jam 2 selesai", time: "09:42", reason: "Input sekretaris kelas" },
    { actor: "Bu Rina", action: "menerbitkan SP 1", from: "Review", to: "Aktif", time: "08:55", reason: "Alpha berulang" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log Presensi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {logs.map((log, index) => (
          <div key={index} className="rounded-lg border border-gray-200 p-3 dark:border-border">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-gray-900">{log.actor} {log.action}</p>
              <span className="text-xs text-gray-500">Hari ini, {log.time}</span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {log.from} → {log.to} · {log.reason}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function BlockWeek({ label, status, detail }: { label: string; status: string; detail: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-border">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-gray-900">{label}</p>
        <Badge className={status === "Berjalan" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
          {status}
        </Badge>
      </div>
      <p className="mt-3 text-sm text-gray-600">{detail}</p>
    </div>
  );
}

function ScheduleItem({ time, class: className, subject, status }: any) {
  const statusColors = {
    completed: "bg-green-100 text-green-700",
    current: "bg-blue-100 text-blue-700",
    upcoming: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-1 h-12 rounded-full bg-[#1E3A8A]" />
        <div>
          <p className="font-medium text-gray-900">{className} - {subject}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {status === "completed" && "Selesai"}
        {status === "current" && "Berlangsung"}
        {status === "upcoming" && "Akan Datang"}
      </Badge>
    </div>
  );
}

function ActivityItem({ title, description, time }: any) {
  return (
    <div className="flex gap-3">
      <div className="w-2 h-2 rounded-full bg-[#1E3A8A] mt-2" />
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

function AlertStudent({ name, absences, violations }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-400/10 dark:border-red-400/30">
      <div>
        <p className="font-medium text-gray-900">{name}</p>
        <p className="text-sm text-gray-600">
          {absences}x tidak hadir • {violations} pelanggaran
        </p>
      </div>
      <Button variant="outline" size="sm">Detail</Button>
    </div>
  );
}

function RiskStudent({ name, class: className, violations, sp, level }: any) {
  const levelColors = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-amber-100 text-amber-700 border-amber-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-900">{name}</p>
          <Badge className={levelColors[level as keyof typeof levelColors]}>
            {level === "high" ? "Tinggi" : level === "medium" ? "Sedang" : "Rendah"}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">{className}</p>
        <p className="text-sm text-gray-600">
          {violations} pelanggaran • SP: {sp}
        </p>
      </div>
      <Button variant="outline" size="sm">Lihat Detail</Button>
    </div>
  );
}
