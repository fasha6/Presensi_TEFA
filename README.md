# 📱 Presensi TEFA - Sistem Manajemen Kehadiran & SP

Aplikasi manajemen presensi siswa berbasis web yang mengotomatisasi pemberian Surat Peringatan (SP) dan sistem notifikasi terpadu.

---

## 👥 Anggota Tim & Role
* **Tristan (Ketua)** - *Git Coordinator & Backend Integration*
* **Fasha** - *Backend: Students & Attendance API*
* **Raka** - *Backend: SP (Warning Letters) & Pembinaan*
* **Shela** - *Backend: Notification System*
* **Ferdiansyah** - *Frontend: Attendance Page*
* **Zaki** - *Frontend: SP Management Page*
* **Aulia** - *Auth & Role Access*
* **Riki** - *UI/UX Design & Quality Control*
* **Shelly** - *Dashboard & Graphics*

---

## 🛠️ Langkah Instalasi (Local Development)

Ikuti urutan ini jika kamu baru saja melakukan `git clone` atau memindahkan folder:

### 1. Install Dependencies
```bash
# Install library PHP (Backend)
composer install

# Install library JavaScript (Frontend)
npm install

## ⚙️ Konfigurasi Environment

Setelah melakukan instalasi library, ikuti langkah-langkah di bawah ini agar aplikasi dapat terhubung ke database lokal kamu:

### 1. Duplikasi File .env
Jalankan perintah ini di terminal untuk membuat file konfigurasi dari file contoh yang sudah ada:

```bash
cp .env.example .env

### 2. Generate App Key
Wajib dijalankan agar sistem enkripsi dan sesi Laravel aktif

```bash
php artisan key:generate

### 3. Pengaturan Koneksi Database
Buka file .env di VS Code, cari baris di bawah ini dan sesuaikan dengan database yang kamu buat (Contoh di Laragon/XAMPP):

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=presensi_tefa
DB_USERNAME=root
DB_PASSWORD=

Pastikan nama DB_DATABASE sudah sesuai dengan nama database yang kamu buat di HeidiSQL/phpMyAdmin.

### 4. Migrasi & Seeding
Jalankan perintah ini untuk membuat tabel otomatis dan mengisi data contoh (data siswa):