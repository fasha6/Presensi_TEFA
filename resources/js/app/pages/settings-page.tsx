import { Header } from "../components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { User, Bell, Database, Shield, Save } from "lucide-react";
import { toast } from "sonner";
import { DemoRole, useAuth } from "../lib/auth";

const roleOptions: Array<{ value: DemoRole; label: string }> = [
  { value: "teacher", label: "Guru Mata Pelajaran" },
  { value: "homeroom", label: "Wali Kelas" },
  { value: "secretary", label: "Sekretaris Kelas" },
  { value: "major_head", label: "Kaprodi" },
  { value: "student", label: "Siswa" },
  { value: "parent", label: "Orang Tua" },
  { value: "bk", label: "Guru BK" },
  { value: "student_affairs", label: "Waka Kesiswaan" },
  { value: "curriculum", label: "Waka Kurikulum" },
  { value: "operator", label: "Operator" },
  { value: "principal", label: "Kepala Sekolah" },
];

const roleProfileMap: Record<DemoRole, { nip: string; phone: string; subjects: string }> = {
  secretary: { nip: "-", phone: "081290001111", subjects: "Sekretaris Kelas XII RPL 1" },
  homeroom: { nip: "197902142005012003", phone: "081290001112", subjects: "Wali Kelas XII RPL 1" },
  major_head: { nip: "197701102003121004", phone: "081290001113", subjects: "Kaprodi RPL" },
  teacher: { nip: "196801011990031001", phone: "081234567890", subjects: "PWPB, PBO" },
  student: { nip: "-", phone: "081290001114", subjects: "Siswa Aktif" },
  parent: { nip: "-", phone: "081290001115", subjects: "Orang Tua/Wali" },
  bk: { nip: "197805212006042001", phone: "081290001116", subjects: "Bimbingan Konseling" },
  student_affairs: { nip: "197612092004031002", phone: "081290001117", subjects: "Kesiswaan" },
  curriculum: { nip: "197509032002121001", phone: "081290001118", subjects: "Kurikulum" },
  operator: { nip: "198101102010011003", phone: "081290001119", subjects: "Administrasi Sistem" },
  principal: { nip: "196912101995031002", phone: "081290001120", subjects: "Kepala Sekolah" },
};

export function SettingsPage() {
  const { user } = useAuth();

  const handleSave = () => {
    toast.success("Pengaturan berhasil disimpan!");
  };

  const activeRole = user?.role ?? "teacher";
  const isAccessLimitedRole = activeRole === "secretary" || activeRole === "teacher";
  const profile = roleProfileMap[activeRole];
  const profileEmail = user?.email ?? "guru@demo.test";
  const profileName = user?.name ?? "Akun Demo";
  const roleLabel = user?.roleLabel ?? "Pengguna";

  return (
    <div>
      <Header title="Pengaturan" breadcrumbs={["Pengaturan"]} />
      
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className={`grid w-full ${isAccessLimitedRole ? "grid-cols-3" : "grid-cols-4"}`}>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
            {!isAccessLimitedRole && <TabsTrigger value="system">Sistem</TabsTrigger>}
            <TabsTrigger value="security">Keamanan</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informasi Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nama Lengkap</label>
                    <Input defaultValue={profileName} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">NIP</label>
                    <Input defaultValue={profile.nip} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                    <Input type="email" defaultValue={profileEmail} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Nomor HP</label>
                    <Input defaultValue={profile.phone} />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Role</label>
                  {isAccessLimitedRole ? (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                      {roleLabel}. Role tidak bisa diganti sendiri karena hak akses diberikan oleh wali kelas/admin.
                    </div>
                  ) : (
                    <Select value={activeRole}>
                      <SelectTrigger>
                        <SelectValue placeholder={roleLabel} />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Bidang / Keterangan</label>
                  <Input defaultValue={profile.subjects} />
                </div>

                <Button onClick={handleSave} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferensi Notifikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Notifikasi Email</p>
                    <p className="text-sm text-gray-600">Terima notifikasi via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Notifikasi Push</p>
                    <p className="text-sm text-gray-600">Notifikasi langsung di browser</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Notifikasi Kehadiran</p>
                    <p className="text-sm text-gray-600">Notifikasi ketika ada siswa tidak hadir</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Notifikasi Pelanggaran</p>
                    <p className="text-sm text-gray-600">Notifikasi pelanggaran siswa</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Ringkasan Harian</p>
                    <p className="text-sm text-gray-600">Terima ringkasan aktivitas setiap hari</p>
                  </div>
                  <Switch />
                </div>

                <Button onClick={handleSave} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          {!isAccessLimitedRole && (
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Pengaturan Sistem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Tahun Ajaran</label>
                  <Select defaultValue="2025-2026">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025-2026">2025/2026</SelectItem>
                      <SelectItem value="2024-2025">2024/2025</SelectItem>
                      <SelectItem value="2023-2024">2023/2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Semester</label>
                  <Select defaultValue="genap">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ganjil">Ganjil</SelectItem>
                      <SelectItem value="genap">Genap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Batas Keterlambatan (menit)</label>
                  <Input type="number" defaultValue="15" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Batas Absen untuk SP (kali)</label>
                  <Input type="number" defaultValue="3" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Auto-send Notifikasi</p>
                    <p className="text-sm text-gray-600">Kirim notifikasi otomatis ke orang tua</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Mode Maintenance</p>
                    <p className="text-sm text-gray-600">Nonaktifkan akses sementara</p>
                  </div>
                  <Switch />
                </div>

                <Button onClick={handleSave} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          )}

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Keamanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Password Saat Ini</label>
                  <Input type="password" placeholder="Masukkan password saat ini" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Password Baru</label>
                  <Input type="password" placeholder="Masukkan password baru" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Konfirmasi Password Baru</label>
                  <Input type="password" placeholder="Konfirmasi password baru" />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Tambahkan lapisan keamanan ekstra</p>
                  </div>
                  <Switch />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium text-gray-900 mb-3">Aktivitas Login Terakhir</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Desktop - Chrome</span>
                      <span className="text-gray-900">Hari ini, 09:15</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mobile - Safari</span>
                      <span className="text-gray-900">Kemarin, 15:30</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Desktop - Firefox</span>
                      <span className="text-gray-900">2 hari lalu, 08:00</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
