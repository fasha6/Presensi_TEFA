import { useState, useEffect } from "react";
import { Header } from "../components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { FileText, Plus, Filter, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

interface SPRecord {
  id: number;
  number: string;
  studentName: string;
  class: string;
  type: "SP 1" | "SP 2" | "SP 3";
  reason: string;
  date: string;
  status: "active" | "completed" | "cancelled";
  issuedBy: string;
  parentNotified: boolean;
}



export function SPManagementPage() {
  const [records, setRecords] = useState<SPRecord[]>([]);
  const [filterClass, setFilterClass] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<SPRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  function refreshSPRecords() {
  fetch("/api/warning-letters")
    .then(res => res.json())
    .then(data => {
      setRecords(Array.isArray(data) ? data.map(mapWarningLetterToSPRecord) : []);
    })
    .catch(() => setRecords([]));
}

  const filteredRecords = records.filter(record => {
    if (filterClass !== "all" && !record.class.includes(filterClass)) return false;
    if (filterStatus !== "all" && record.status !== filterStatus) return false;
    return true;
  });

  const stats = {
    total: records.length,
    active: records.filter(r => r.status === "active").length,
    completed: records.filter(r => r.status === "completed").length,
    sp1: records.filter(r => r.type === "SP 1").length,
    sp2: records.filter(r => r.type === "SP 2").length,
    sp3: records.filter(r => r.type === "SP 3").length,
  };

  return (
    <div>
      <Header title="SP & Pembinaan" breadcrumbs={["SP & Pembinaan"]} />
      
      <div className="p-8 max-w-[1280px]">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total SP</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">SP Aktif</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats.active}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">SP Selesai</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Distribusi SP</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SP 1:</span>
                    <span className="font-medium">{stats.sp1}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SP 2:</span>
                    <span className="font-medium">{stats.sp2}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SP 3:</span>
                    <span className="font-medium">{stats.sp3}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter:</span>
                </div>
                <Select value={filterClass} onValueChange={setFilterClass}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Semua Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    <SelectItem value="RPL">RPL</SelectItem>
                    <SelectItem value="TKJ">TKJ</SelectItem>
                    <SelectItem value="MM">MM</SelectItem>
                    <SelectItem value="OTKP">OTKP</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Terbitkan SP Baru
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Terbitkan Surat Peringatan Baru</DialogTitle>
                  </DialogHeader>
                  <NewSPForm
                    onCancel={() => setIsCreateOpen(false)}
                    onSubmitSuccess={() => {
                      setIsCreateOpen(false);
                      toast.success("SP berhasil diterbitkan!");
                      refreshSPRecords();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Alur Pembinaan BK</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <CoachingStep title="1. Deteksi" detail="Alpha/telat berulang dari presensi" status="Otomatis" />
              <CoachingStep title="2. Review BK" detail="BK memeriksa riwayat siswa" status="Berjalan" />
              <CoachingStep title="3. Terbitkan SP" detail="SP dibuat oleh BK bila memenuhi aturan" status="Validasi" />
              <CoachingStep title="4. Notifikasi Ortu" detail="Orang tua dan siswa menerima pemberitahuan" status="WA" />
            </div>
          </CardContent>
        </Card>

        {/* SP Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Surat Peringatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">No. SP</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Nama Siswa</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kelas</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Jenis</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tanggal</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.number}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900">{record.studentName}</p>
                        {!record.parentNotified && (
                          <p className="text-xs text-red-600">⚠️ Ortu belum dihubungi</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{record.class}</td>
                      <td className="px-6 py-4">
                        <Badge className={
                          record.type === "SP 1" ? "bg-yellow-100 text-yellow-700" :
                          record.type === "SP 2" ? "bg-orange-100 text-orange-700" :
                          "bg-red-100 text-red-700"
                        }>
                          {record.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(record.date).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={
                          record.status === "active" ? "bg-green-100 text-green-700" :
                          record.status === "completed" ? "bg-gray-100 text-gray-700" :
                          "bg-red-100 text-red-700"
                        }>
                          {record.status === "active" ? "Aktif" :
                           record.status === "completed" ? "Selesai" : "Dibatalkan"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedRecord(record)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detail Surat Peringatan</DialogTitle>
                            </DialogHeader>
                            {selectedRecord && <SPDetailView record={selectedRecord} />}
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredRecords.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Tidak ada data SP yang sesuai filter</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CoachingStep({ title, detail, status }: { title: string; detail: string; status: string }) {
  return (
    <div className="rounded-lg border border-gray-200 p-4 dark:border-border">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-gray-900">{title}</p>
        <Badge className="bg-blue-100 text-blue-700">{status}</Badge>
      </div>
      <p className="mt-3 text-sm text-gray-600">{detail}</p>
    </div>
  );
}

function mapWarningLetterToSPRecord(wl: any): SPRecord {
  return {
    id: wl.id,
    number: wl.letter_number || wl.number || `SP-${wl.id}`,
    studentName: wl.student_name || wl.student?.name || wl.name || "-",
    class: wl.class || wl.student?.class || wl.class_name || "-",
    type: wl.type || wl.sp_type || "SP 1",
    reason: wl.reason || "-",
    date: wl.date || wl.created_at || new Date().toISOString(),
    status: wl.status || "active",
    issuedBy: wl.issued_by || "BK",
    parentNotified: wl.parent_notified ?? false,
  };
}

function NewSPForm({
  onCancel,
  onSubmitSuccess,
}: {
  onCancel: () => void;
  onSubmitSuccess: () => void;
}) {
  const [students, setStudents] = useState<any[]>([]);
  const [studentId, setStudentId] = useState("");
  const [className, setClassName] = useState("");
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [notifyParent, setNotifyParent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
  fetch("/api/students")
    .then((res) => res.json())
    .then((data) => {
      // Jika API return { data: [...] }
      if (Array.isArray(data)) setStudents(data);
      else if (Array.isArray(data.data)) setStudents(data.data);
      else setStudents([]);
    })
    .catch(() => setStudents([]));
}, []);

  useEffect(() => {
    const selected = students.find((s) => String(s.id) === String(studentId));
    setClassName(selected ? selected.class : "");
  }, [studentId, students]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!studentId || !type || !reason) {
      setError("Semua field wajib diisi.");
      return;
    }
    setLoading(true);
    const today = new Date();
    const date = today.toISOString().slice(0, 10);
    const letter_number = `SP-${today.getTime()}`;
    try {
      const res = await fetch("/api/warning-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          letter_number,
          date,
          reason,
        }),
      });
      if (!res.ok) throw new Error("Gagal menerbitkan SP");
      onSubmitSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal menerbitkan SP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Nama Siswa</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            required
          >
            <option value="">Pilih siswa...</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">Kelas</label>
          <Input value={className} disabled />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Jenis SP</label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih jenis SP" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sp1">SP 1 (Peringatan Pertama)</SelectItem>
            <SelectItem value="sp2">SP 2 (Peringatan Kedua)</SelectItem>
            <SelectItem value="sp3">SP 3 (Peringatan Terakhir)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Alasan</label>
        <Textarea 
          placeholder="Jelaskan alasan penerbitan SP..."
          rows={4}
          value={reason}
          onChange={e => setReason(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Tindak Lanjut</label>
        <Textarea 
          placeholder="Tindakan yang perlu dilakukan siswa..."
          rows={3}
        />
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="notify-parent" className="rounded" />
        <label htmlFor="notify-parent" className="text-sm text-gray-700">
          Kirim notifikasi ke orang tua via WhatsApp
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          Terbitkan SP
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}

function SPDetailView({ record }: { record: SPRecord }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Nomor SP</p>
          <p className="font-medium text-gray-900">{record.number}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Tanggal Terbit</p>
          <p className="font-medium text-gray-900">{new Date(record.date).toLocaleDateString('id-ID')}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Nama Siswa</p>
        <p className="font-medium text-gray-900">{record.studentName}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Kelas</p>
          <p className="font-medium text-gray-900">{record.class}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Jenis SP</p>
          <Badge className={
            record.type === "SP 1" ? "bg-yellow-100 text-yellow-700" :
            record.type === "SP 2" ? "bg-orange-100 text-orange-700" :
            "bg-red-100 text-red-700"
          }>
            {record.type}
          </Badge>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Alasan</p>
        <p className="text-gray-900">{record.reason}</p>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Diterbitkan Oleh</p>
        <p className="font-medium text-gray-900">{record.issuedBy}</p>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Status</p>
        <Badge className={
          record.status === "active" ? "bg-green-100 text-green-700" :
          record.status === "completed" ? "bg-gray-100 text-gray-700" :
          "bg-red-100 text-red-700"
        }>
          {record.status === "active" ? "Aktif" :
           record.status === "completed" ? "Selesai" : "Dibatalkan"}
        </Badge>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Notifikasi Orang Tua</p>
        <div className="flex items-center gap-2">
          {record.parentNotified ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">Orang tua sudah dihubungi</span>
            </>
          ) : (
            <>
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="text-sm text-red-700">Orang tua belum dihubungi</span>
            </>
          )}
        </div>
      </div>

      {/* Timeline Progress */}
      <div className="pt-4 border-t">
        <p className="text-sm font-medium text-gray-700 mb-3">Progress Pembinaan</p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">SP Diterbitkan</p>
              <p className="text-xs text-gray-600">{new Date(record.date).toLocaleDateString('id-ID')}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Konseling Dilakukan</p>
              <p className="text-xs text-gray-600">5 April 2026</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Monitoring (Berlangsung)</p>
              <p className="text-xs text-gray-600">Target: 30 hari</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
