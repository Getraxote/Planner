/* Penghubung ke Firebase (login Google + Firestore).
   Hanya dimuat dan dipakai bila config.js mengisi enabled: true.
   SDK Firebase diambil dari CDN resmi Google saat dibutuhkan. */
window.Cloud = (function () {
  'use strict';
  const cfg = window.PLANNER_CLOUD || {};
  const SDK = '10.14.1';
  const BASE = 'https://www.gstatic.com/firebasejs/' + SDK + '/';
  let fb = null, auth = null, db = null, ready = null;

  const enabled = () => !!(cfg.enabled && cfg.firebase && cfg.firebase.apiKey && cfg.firebase.projectId);

  function init() {
    if (ready) return ready;
    ready = (async () => {
      const mods = await Promise.all([
        import(BASE + 'firebase-app.js'),
        import(BASE + 'firebase-auth.js'),
        import(BASE + 'firebase-firestore.js')
      ]);
      fb = { app: mods[0], a: mods[1], f: mods[2] };
      const application = fb.app.initializeApp(cfg.firebase);
      auth = fb.a.getAuth(application);
      db = fb.f.getFirestore(application);
    })();
    ready.catch(() => { ready = null; });
    return ready;
  }

  const userOf = (u) => u ? {
    uid: u.uid,
    name: u.displayName || u.email || 'Tanpa nama',
    email: (u.email || '').toLowerCase(),
    photo: u.photoURL || ''
  } : null;

  const isAdmin = (email) =>
    (cfg.adminEmails || []).map((x) => String(x).toLowerCase()).indexOf(String(email || '').toLowerCase()) !== -1;

  const ref = (uid) => fb.f.doc(db, 'planners', uid);

  return {
    enabled,
    init,
    isAdmin,
    onAuth(cb) {
      return fb.a.onAuthStateChanged(auth, (u) => cb(userOf(u)));
    },
    async signIn() {
      const provider = new fb.a.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      try {
        await fb.a.signInWithPopup(auth, provider);
      } catch (e) {
        if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment')) {
          await fb.a.signInWithRedirect(auth, provider);
          return;
        }
        throw e;
      }
    },
    signOut() {
      return fb.a.signOut(auth);
    },
    watch(uid, next, error) {
      return fb.f.onSnapshot(ref(uid), (snap) => next(snap.exists() ? snap.data() : null, snap.metadata), error);
    },
    put(uid, data) {
      return fb.f.setDoc(ref(uid), data, { merge: true });
    },
    remove(uid) {
      return fb.f.deleteDoc(ref(uid));
    },
    watchAll(next, error) {
      return fb.f.onSnapshot(
        fb.f.collection(db, 'planners'),
        (snap) => next(snap.docs.map((d) => Object.assign({ uid: d.id }, d.data()))),
        error
      );
    }
  };
})();
