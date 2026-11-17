/* Pengaturan layanan online. Panduan pengisian ada di PANDUAN-FIREBASE.md.

   enabled: false  -> aplikasi dipakai sendiri, tanpa login dan tanpa admin (data hanya di perangkat).
   enabled: true   -> semua orang wajib masuk dengan Google, data disalin ke server,
                      dan akun di adminEmails dapat membuka halaman Admin.

   Kunci di bawah ini bukan rahasia. Yang melindungi data adalah aturan Firestore (firestore.rules). */
window.PLANNER_CLOUD = {
  enabled: false,
  adminEmails: ["emailadmin@gmail.com"],   // huruf kecil semua, harus sama dengan firestore.rules
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: ""
  }
};
