/* Pengaturan layanan online. Panduan pengisian ada di PANDUAN-FIREBASE.md.

   enabled: false  -> aplikasi dipakai sendiri, tanpa login dan tanpa admin (data hanya di perangkat).
   enabled: true   -> semua orang wajib masuk dengan Google, data disalin ke server,
                      dan akun di adminEmails dapat membuka halaman Admin.

   Kunci di bawah ini bukan rahasia. Yang melindungi data adalah aturan Firestore (firestore.rules). */
window.PLANNER_CLOUD = {
  enabled: true,
  adminEmails: ["getramaz@gmail.com"],   
  firebase: {
    apiKey: "AIzaSyBJ2uD-XHG0_xjUU6YDvGPR6ND8o7COosc",
  authDomain: "planneradam.firebaseapp.com",
  projectId: "planneradam",
    appId: "1:175365258795:web:6961ad2828543a96a9b46e",
  }
};
