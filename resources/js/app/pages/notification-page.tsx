import { useState } from "react";
import { Header } from "../components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { MessageSquare, Send, CheckCheck, XCircle, Clock, Filter, Search, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../lib/auth";
import { isClassAllowedForRole, secretaryAssignment } from "../lib/role-scope";

interface Notification {
  id: number;
  studentName: string;
  class: string;
  parentPhone: string;
  message: string;
  type: "absence" | "late" | "violation" | "sp" | "achievement";
  status: "sent" | "failed" | "pending";
  sentAt: string;
  deliveredAt?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    studentName: "Ahmad Rizki Maulana",
    class: "XII RPL 1",
    parentPhone: "081234567890",
    message: "Assalamualaikum, Bapak/Ibu. Kami informasikan bahwa ananda Ahmad Rizki Maulana tidak hadir pada mata pelajaran PWPB hari ini (14 April 2026) tanpa keterangan. Mohon konfirmasi. Terima kasih.",
    type: "absence",
    status: "sent",
    sentAt: "2026-04-14 09:30",
    deliveredAt: "2026-04-14 09:31"
  },
  {
    id: 2,
    studentName: "Siti Nurhaliza",
    class: "XI TKJ 2",
    parentPhone: "081298765432",
    message: "Assalamualaikum, Bapak/Ibu. Kami informasikan bahwa ananda Siti Nurhaliza terlambat masuk sekolah hari ini (14 April 2026) pukul 08:15. Mohon perhatian. Terima kasih.",
    type: "late",
    status: "sent",
    sentAt: "2026-04-14 08:20",
    deliveredAt: "2026-04-14 08:21"
  },
  {
    id: 3,
    studentName: "Budi Santoso",
    class: "XII MM 1",
    parentPhone: "081276543210",
    message: "Assalamualaikum, Bapak/Ibu. Kami informasikan bahwa ananda Budi Santoso telah menerima Surat Peringatan (SP 1) terkait pelanggaran tata tertib sekolah. Mohon untuk dapat hadir ke sekolah. Terima kasih.",
    type: "sp",
    status: "sent",
    sentAt: "2026-04-13 14:00",
    deliveredAt: "2026-04-13 14:02"
  },
  {
    id: 4,
    studentName: "Devi Anggraini",
    class: "XI RPL 1",
    parentPhone: "081265432109",
    message: "Assalamualaikum, Bapak/Ibu. Selamat! Ananda Devi Anggraini meraih Juara 1 Lomba Web Design tingkat Provinsi. Terima kasih atas dukungannya.",
    type: "achievement",
    status: "sent",
    sentAt: "2026-04-12 16:00",
    deliveredAt: "2026-04-12 16:01"
  },
  {
    id: 5,
    studentName: "Eko Prasetyo",
    class: "XII RPL 2",
    parentPhone: "081254321098",
    message: "Assalamualaikum, Bapak/Ibu. Kami informasikan bahwa ananda Eko Prasetyo tidak hadir hari ini. Mohon konfirmasi.",
    type: "absence",
    status: "failed",
    sentAt: "2026-04-14 10:00"
  },
  {
    id: 6,
    studentName: "Fatimah Zahra",
    class: "XI MM 2",
    parentPhone: "081243210987",
    message: "Assalamualaikum, Bapak/Ibu. Kami informasikan bahwa ananda Fatimah Zahra terlambat masuk kelas.",
    type: "late",
    status: "pending",
    sentAt: "2026-04-14 11:45"
  },
];

export function NotificationPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [draftType, setDraftType] = useState<Notification["type"]>("absence");
  const canManageNotifications = user?.role !== "student" && user?.role !== "parent";

  const roleScopedNotifications = notifications.filter((notif) => {
    if (user?.role === "student") {
      return notif.studentName === user.name;
    }

    if (user?.role === "parent") {
      return notif.studentName === "Ahmad Rizki Maulana";
    }

    if (user?.role === "secretary" || user?.role === "homeroom" || user?.role === "teacher") {
      return isClassAllowedForRole(notif.class, user.role);
    }

    if (user?.role === "major_head") {
      return notif.class.includes("RPL");
    }

    return true;
  });

  const filteredNotifications = roleScopedNotifications.filter(notif => {
    if (filterType !== "all" && notif.type !== filterType) return false;
    if (filterStatus !== "all" && notif.status !== filterStatus) return false;
    if (searchQuery && !notif.studentName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: roleScopedNotifications.length,
    sent: roleScopedNotifications.filter(n => n.status === "sent").length,
    failed: roleScopedNotifications.filter(n => n.status === "failed").length,
    pending: roleScopedNotifications.filter(n => n.status === "pending").length,
  };

  return (
    <div>
      <Header title="Notifikasi" breadcrumbs={["Notifikasi"]} />
      
      <div className="w-full p-4 sm:p-6 lg:p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Notifikasi</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Terkirim</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats.sent}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Gagal</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats.failed}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-semibold text-gray-900">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {canManageNotifications && <NotificationRules />}
        {user?.role === "secretary" && (
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-400/40 dark:bg-blue-400/10">
            <CardContent className="pt-6 text-sm text-blue-900 dark:text-blue-100">
              Sekretaris hanya melihat notifikasi kelas {secretaryAssignment.className}. Template dipakai untuk bantu wali kelas menghubungi orang tua atau siswa.
            </CardContent>
          </Card>
        )}

        {/* Filters & Actions */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Filter:</span>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="absence">Ketidakhadiran</SelectItem>
                    <SelectItem value="late">Keterlambatan</SelectItem>
                    <SelectItem value="violation">Pelanggaran</SelectItem>
                    <SelectItem value="sp">SP</SelectItem>
                    <SelectItem value="achievement">Prestasi</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Semua Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="sent">Terkirim</SelectItem>
                    <SelectItem value="failed">Gagal</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari nama siswa..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              {canManageNotifications && (
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                    <Send className="w-4 h-4 mr-2" />
                    Kirim Notifikasi Baru
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Kirim Notifikasi Baru</DialogTitle>
                  </DialogHeader>
                  <NewNotificationForm
                    initialMessage={draftMessage}
                    initialType={draftType}
                    onSubmitSuccess={() => {
                      setIsCreateOpen(false);
                      toast.success("Notifikasi berhasil dikirim!");
                    }}
                  />
                </DialogContent>
              </Dialog>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}

          {filteredNotifications.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Tidak ada notifikasi yang sesuai filter</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Message Templates */}
        {canManageNotifications && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Template Pesan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <MessageTemplate
                title="Ketidakhadiran"
                message="Assalamualaikum, Bapak/Ibu. Kami informasikan bahwa ananda [NAMA] tidak hadir pada mata pelajaran [MAPEL] hari ini ([TANGGAL]) tanpa keterangan. Mohon konfirmasi. Terima kasih."
                type="absence"
                onUse={(message, type) => {
                  setDraftMessage(message);
                  setDraftType(type);
                  setIsCreateOpen(true);
                }}
              />
              <MessageTemplate
                title="Keterlambatan"
                message="Assalamualaikum, Bapak/Ibu. Kami informasikan bahwa ananda [NAMA] terlambat masuk sekolah hari ini ([TANGGAL]) pukul [JAM]. Mohon perhatian. Terima kasih."
                type="late"
                onUse={(message, type) => {
                  setDraftMessage(message);
                  setDraftType(type);
                  setIsCreateOpen(true);
                }}
              />
              <MessageTemplate
                title="Surat Peringatan"
                message="Assalamualaikum, Bapak/Ibu. Kami informasikan bahwa ananda [NAMA] telah menerima Surat Peringatan ([JENIS_SP]) terkait [ALASAN]. Mohon untuk dapat hadir ke sekolah. Terima kasih."
                type="sp"
                onUse={(message, type) => {
                  setDraftMessage(message);
                  setDraftType(type);
                  setIsCreateOpen(true);
                }}
              />
              <MessageTemplate
                title="Prestasi"
                message="Assalamualaikum, Bapak/Ibu. Selamat! Ananda [NAMA] meraih [PRESTASI]. Terima kasih atas dukungannya."
                type="achievement"
                onUse={(message, type) => {
                  setDraftMessage(message);
                  setDraftType(type);
                  setIsCreateOpen(true);
                }}
              />
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  );
}

function NotificationRules() {
  const rules = [
    { condition: "Alpha 1x hari itu", target: "Orang tua", channel: "WhatsApp", tone: "Informatif, tidak membuat panik" },
    { condition: "Alpha 3x", target: "Orang tua + Wali Kelas", channel: "WhatsApp + dashboard", tone: "Perlu konfirmasi wali" },
    { condition: "Alpha berhari-hari", target: "Sekretaris + Siswa + BK", channel: "Dashboard + notifikasi", tone: "Butuh tindak lanjut" },
    { condition: "Alpha 4x", target: "BK", channel: "Dashboard BK", tone: "Pemanggilan/pembinaan" },
    { condition: "SP dikeluarkan", target: "Orang tua + Siswa", channel: "WhatsApp + dashboard", tone: "Formal dan jelas" },
    { condition: "Kasus khusus", target: "Orang tua + BK + Wali", channel: "WhatsApp + dashboard", tone: "Koordinasi terbatas" },
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Aturan Notifikasi Otomatis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {rules.map((rule) => (
            <div key={rule.condition} className="rounded-lg border border-gray-200 p-4 dark:border-border">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-gray-900">{rule.condition}</p>
                <Badge className="bg-blue-100 text-blue-700">{rule.channel}</Badge>
              </div>
              <p className="mt-2 text-sm text-gray-600">Penerima: {rule.target}</p>
              <p className="mt-1 text-xs text-gray-500">Bahasa: {rule.tone}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationCard({ notification }: { notification: Notification }) {
  const typeLabels = {
    absence: "Ketidakhadiran",
    late: "Keterlambatan",
    violation: "Pelanggaran",
    sp: "Surat Peringatan",
    achievement: "Prestasi"
  };

  const typeColors = {
    absence: "bg-red-100 text-red-700",
    late: "bg-amber-100 text-amber-700",
    violation: "bg-orange-100 text-orange-700",
    sp: "bg-purple-100 text-purple-700",
    achievement: "bg-green-100 text-green-700"
  };

  const statusIcons = {
    sent: <CheckCheck className="w-5 h-5 text-green-600" />,
    failed: <XCircle className="w-5 h-5 text-red-600" />,
    pending: <Clock className="w-5 h-5 text-amber-600" />
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge className={typeColors[notification.type]}>
                {typeLabels[notification.type]}
              </Badge>
              <div className="flex items-center gap-2">
                {statusIcons[notification.status]}
                <span className="text-sm font-medium text-gray-700">
                  {notification.status === "sent" && "Terkirim"}
                  {notification.status === "failed" && "Gagal"}
                  {notification.status === "pending" && "Pending"}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <p className="font-medium text-gray-900">{notification.studentName} - {notification.class}</p>
              <p className="text-sm text-gray-600">Ke: {notification.parentPhone}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-3">
              <p className="text-sm text-gray-700">{notification.message}</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Dikirim: {notification.sentAt}</span>
              {notification.deliveredAt && <span>Terkirim: {notification.deliveredAt}</span>}
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Detail Notifikasi</DialogTitle>
              </DialogHeader>
              <NotificationDetail notification={notification} />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}

function MessageTemplate({
  title,
  message,
  type,
  onUse,
}: {
  title: string;
  message: string;
  type: Notification["type"];
  onUse: (message: string, type: Notification["type"]) => void;
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-[#1E3A8A] transition-colors cursor-pointer">
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{message}</p>
      <Button variant="outline" size="sm" className="w-full" onClick={() => onUse(message, type)}>
        Gunakan Template
      </Button>
    </div>
  );
}

function NewNotificationForm({
  initialMessage,
  initialType,
  onSubmitSuccess,
}: {
  initialMessage: string;
  initialType: Notification["type"];
  onSubmitSuccess: () => void;
}) {
  const [message, setMessage] = useState(initialMessage);
  const [type, setType] = useState(initialType);

  return (
    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); onSubmitSuccess(); }}>
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Pilih Siswa</label>
        <Select value={type} onValueChange={(value) => setType(value as Notification["type"])}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih siswa..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Ahmad Rizki Maulana - XII RPL 1</SelectItem>
            <SelectItem value="2">Siti Nurhaliza - XI TKJ 2</SelectItem>
            <SelectItem value="3">Budi Santoso - XII MM 1</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Tipe Notifikasi</label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Pilih tipe..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="absence">Ketidakhadiran</SelectItem>
            <SelectItem value="late">Keterlambatan</SelectItem>
            <SelectItem value="violation">Pelanggaran</SelectItem>
            <SelectItem value="sp">Surat Peringatan</SelectItem>
            <SelectItem value="achievement">Prestasi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Nomor WhatsApp Orang Tua</label>
        <Input placeholder="081234567890" />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Pesan</label>
        <Textarea 
          placeholder="Tulis pesan untuk orang tua..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={6}
        />
        <p className="text-xs text-gray-500 mt-1">
          Gunakan [NAMA], [KELAS], [TANGGAL] untuk placeholder otomatis
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          <Send className="w-4 h-4 mr-2" />
          Kirim Sekarang
        </Button>
      </div>
    </form>
  );
}

function NotificationDetail({ notification }: { notification: Notification }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600 mb-1">Siswa</p>
        <p className="font-medium text-gray-900">{notification.studentName}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Kelas</p>
          <p className="font-medium text-gray-900">{notification.class}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">No. HP Orang Tua</p>
          <p className="font-medium text-gray-900">{notification.parentPhone}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Pesan</p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-900">{notification.message}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">Waktu Kirim</p>
          <p className="font-medium text-gray-900">{notification.sentAt}</p>
        </div>
        {notification.deliveredAt && (
          <div>
            <p className="text-sm text-gray-600 mb-1">Waktu Terkirim</p>
            <p className="font-medium text-gray-900">{notification.deliveredAt}</p>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm text-gray-600 mb-1">Status</p>
        <Badge className={
          notification.status === "sent" ? "bg-green-100 text-green-700" :
          notification.status === "failed" ? "bg-red-100 text-red-700" :
          "bg-amber-100 text-amber-700"
        }>
          {notification.status === "sent" ? "Terkirim" :
           notification.status === "failed" ? "Gagal" : "Pending"}
        </Badge>
      </div>
    </div>
  );
}
