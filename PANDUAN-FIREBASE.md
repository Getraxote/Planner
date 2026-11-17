# Mengaktifkan login Google dan halaman Admin

Dengan langkah ini, semua anggota masuk memakai akun Google, planner mereka disalin ke server, dan akun admin Anda mendapat menu **Admin** untuk melihat seluruh isinya. Layanan yang dipakai adalah Firebase (Google), paket gratis (Spark) sudah cukup untuk kelompok kecil sampai puluhan orang.

Waktu pengerjaan sekitar 15 menit. Anda perlu akun Google dan alamat aplikasi yang sudah online (lihat `PANDUAN.md`, misalnya `https://namaanda.github.io/planner/`).

## Yang dilihat anggota

Sebelum masuk, layar pertama menyebutkan bahwa admin dapat melihat **seluruh isi** planner mereka (kegiatan, catatan, hasil aktual, alasan terlewat, tujuan, rencana mingguan, refleksi). Anggota harus mencentang persetujuan dulu. Di Pengaturan ada tombol **Berhenti berbagi dan hapus dari server**, dan footer aplikasi selalu menampilkan bahwa isinya dapat dilihat admin. Tulisan ini tidak bisa dimatikan dari pengaturan aplikasi, dan itu disengaja.

## Langkah 1. Buat proyek Firebase

1. Buka https://console.firebase.google.com dan masuk dengan akun Google Anda.
2. Klik **Create a project** (Buat proyek), beri nama, misalnya `planner-kelas`. Google Analytics boleh dimatikan.
3. Di halaman proyek, klik ikon **Web** (`</>`) untuk menambahkan aplikasi web. Beri nama bebas. Jangan centang Firebase Hosting.
4. Firebase menampilkan blok `firebaseConfig` berisi `apiKey`, `authDomain`, `projectId`, dan `appId`. Salin keempat nilai itu.

## Langkah 2. Aktifkan login Google

1. Menu **Build → Authentication → Get started**.
2. Tab **Sign-in method**, pilih **Google**, aktifkan, pilih email dukungan, **Save**.
3. Tab **Settings → Authorized domains → Add domain**. Tambahkan alamat tempat aplikasi di-hosting, **tanpa** `https://` dan tanpa nama folder. Contoh: `namaanda.github.io`.

Tanpa langkah 3, login gagal dengan pesan bahwa alamat belum diizinkan.

## Langkah 3. Buat database dan pasang aturan

1. Menu **Build → Firestore Database → Create database**.
2. Pilih lokasi terdekat (misalnya `asia-southeast2` Jakarta) dan mulai dalam mode **production**.
3. Buka tab **Rules**, hapus isinya, lalu tempel isi berkas `firestore.rules`.
4. Di dalam aturan itu, ganti `emailadmin@gmail.com` dengan email Google Anda (huruf kecil). Untuk lebih dari satu admin: `['a@gmail.com', 'b@gmail.com']`.
5. Klik **Publish**.

Aturan ini yang melindungi data. Isinya: setiap anggota hanya bisa membaca dan menulis dokumennya sendiri, admin bisa **membaca** semua dokumen tetapi tidak bisa mengubah atau menghapusnya, dan orang yang tidak login tidak bisa apa-apa. Jangan memakai aturan "test mode" bawaan Firebase, karena membuka data untuk siapa saja.

## Langkah 4. Isi config.js

Buka `config.js`, lalu isi:

```js
window.PLANNER_CLOUD = {
  enabled: true,
  adminEmails: ["email-anda@gmail.com"],   // sama dengan di firestore.rules
  firebase: {
    apiKey: "...",
    authDomain: "...",
    projectId: "...",
    appId: "..."
  }
};
```

Kunci `apiKey` boleh terlihat publik. Yang menentukan siapa boleh membaca data adalah aturan di Langkah 3, bukan kunci ini.

## Langkah 5. Unggah ulang dan coba

1. Unggah ulang seluruh isi folder ke GitHub (`config.js` yang baru ikut diganti).
2. Buka aplikasi, centang persetujuan, lalu **Masuk dengan Google** memakai akun admin. Menu **Admin** muncul di sebelah Pengaturan.
3. Minta satu orang lain masuk dan menambah satu kegiatan. Dalam beberapa detik namanya muncul di halaman Admin.

Kalau menu Admin tidak muncul, pastikan email di `adminEmails` sama persis dengan akun yang dipakai masuk, dan hapus cache dengan membuka aplikasi sekali lagi saat online.

## Yang terlihat di halaman Admin

- **Daftar anggota:** kegiatan hari ini, penyelesaian minggu ini, terakhir aktif, dan penanda "perlu perhatian" (kegiatan belum dikonfirmasi, tidak aktif lebih dari 2 hari, penyelesaian rendah).
- **Detail per anggota:** kegiatan hari ini, rencana dan refleksi tiap minggu, semua kegiatan dengan hasil aktual dan alasan terlewat, tujuan, dan riwayat jadwal ulang. Semuanya hanya bisa dibaca.

## Catatan penting

- **Batas gratis:** paket Spark mengizinkan 20.000 tulis dan 50.000 baca per hari. Untuk kelompok puluhan orang ini sangat cukup. Jika kelompok membesar, pantau di Firebase Console → Usage.
- **Ukuran data:** tiap anggota disimpan dalam satu dokumen, batas aman sekitar 900 KB (kira-kira ribuan kegiatan). Anggota bisa mengekspor lalu membersihkan data lama.
- **Offline:** anggota yang sudah pernah masuk dan setuju tetap bisa memakai aplikasi tanpa internet. Perubahannya dikirim ke server saat tersambung lagi.
- **Login di iPhone:** login Google memakai jendela popup. Di Android dan di browser laptop ini normal. Di iPhone yang sudah memasang aplikasi ke layar utama, login terkadang gagal karena pembatasan iOS. Jika terjadi, minta anggota masuk lewat Safari biasa.
- **Setelah mengubah berkas aplikasi:** naikkan angka `VERSION` di `sw.js` (misalnya `planner-v2` menjadi `planner-v3`).
- **Mengganti admin:** ubah email di `config.js` dan di aturan Firestore, lalu publikasikan keduanya.
