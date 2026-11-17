# Personal Planner (PWA)

Planner harian, mingguan, tujuan, dan refleksi. Bisa dipasang di layar utama HP atau laptop dan tetap berjalan tanpa internet.

## Isi folder

| Berkas | Fungsi |
|---|---|
| `index.html` | Seluruh aplikasi (tampilan dan logika) |
| `manifest.webmanifest` | Nama, warna, dan ikon aplikasi saat dipasang |
| `sw.js` | Menyimpan aplikasi di cache supaya bisa dibuka offline |
| `config.js` | Pengaturan login dan admin. Bawaannya mati (`enabled: false`) |
| `cloud.js` | Penghubung ke Firebase, dipakai hanya bila `config.js` diaktifkan |
| `firestore.rules` | Aturan keamanan database, ditempel di Firebase Console |
| `icons/` | Ikon aplikasi (PNG dan SVG) |

Semua alamat di dalamnya relatif, jadi folder ini bisa ditaruh di mana saja, termasuk di subfolder seperti `/planner/`.

## Menaruh di GitHub Pages

1. Buka github.com, buat repository baru, misalnya `planner`. Pilih **Public**.
2. Klik **Add file → Upload files**, lalu seret **isi** folder ini (`index.html`, `manifest.webmanifest`, `sw.js`, `config.js`, `cloud.js`, dan folder `icons`). Isinya, bukan folder pembungkusnya. `index.html` harus berada di lapisan paling atas repository.
3. Klik **Commit changes**.
4. Buka **Settings → Pages**. Pada **Branch**, pilih `main` dan folder `/ (root)`, lalu **Save**.
5. Tunggu 1 sampai 2 menit. Alamatnya akan berbentuk `https://NAMA-GITHUB-ANDA.github.io/planner/`.

Alamat itu bisa langsung dikirim ke siapa saja lewat WhatsApp atau media lain.

## Memasang di perangkat

- **Android (Chrome):** buka alamatnya. Muncul banner "Pasang aplikasi", atau buka menu ⋮ lalu pilih **Instal aplikasi**.
- **iPhone/iPad (Safari):** buka alamatnya di Safari, ketuk **Bagikan**, lalu **Tambah ke Layar Utama**. Harus lewat Safari, bukan browser lain.
- **Laptop (Chrome/Edge):** klik ikon pasang di ujung kanan kolom alamat, atau menu → **Instal Personal Planner**.

## Dua cara pakai

- **Mandiri (bawaan):** `config.js` dibiarkan `enabled: false`. Tanpa akun dan tanpa server, data hanya ada di perangkat masing-masing.
- **Dengan login Google dan admin:** untuk kelompok yang ingin dipantau bersama. Semua anggota masuk dengan Google, dan akun admin bisa melihat seluruh isi planner mereka. Anggota diberi tahu di layar masuk dan harus menyetujuinya. Langkahnya ada di `PANDUAN-FIREBASE.md`.

## Soal data pada cara mandiri

- Tidak ada akun dan tidak ada server. Data setiap orang disimpan di browser perangkat masing-masing dan tidak dikirim ke mana pun. Orang lain yang membuka link Anda tidak bisa melihat data Anda.
- Konsekuensinya, data tidak otomatis pindah antar perangkat. Pada cara mandiri, untuk memindahkan, pakai **Pengaturan → Ekspor JSON** di perangkat lama, lalu **Impor JSON** di perangkat baru.
- Membersihkan data browser atau menghapus aplikasi akan menghapus datanya. Ekspor cadangan secara berkala.
- Cadangan JSON dari versi pertama (`Personal_Planner_Goal_Tracker_v2.html`) bisa diimpor ke aplikasi ini.

## Pengingat

Notifikasi muncul selama aplikasi terbuka atau masih berjalan di latar belakang. Notifikasi saat aplikasi tertutup sepenuhnya butuh layanan push di server, dan itu belum ada di paket ini.

## Memperbarui aplikasi

Setelah mengubah `index.html`, naikkan angka `VERSION` di `sw.js` (misalnya `planner-v1` menjadi `planner-v2`), lalu unggah ulang. Pengguna akan mendapat versi baru saat membuka aplikasi dalam keadaan online.
