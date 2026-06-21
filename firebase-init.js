/* ══════════════════════════════════
   FIREBASE INIT — AnimeX (OPTIMIZADO)
══════════════════════════════════ */

const firebaseConfig = {
  apiKey: "AIzaSyDJHQn8ND7xwFIyIWwhdWQNJcgOd6_MMP8",
  authDomain: "anime-x-8e7d5.firebaseapp.com",
  projectId: "anime-x-8e7d5",
  storageBucket: "anime-x-8e7d5.firebasestorage.app",
  messagingSenderId: "293091614648",
  appId: "1:293091614648:web:25c6aac3685a2892bcb94d"
};

/* INIT */
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const FS_COLLECTION = "animex_data";

/* ══════════════════════════════════
   ESTADO DE CONEXIÓN
══════════════════════════════════ */
let isOnline = true;

window.addEventListener("online", () => {
  isOnline = true;
  console.log("🌐 Online");
});

window.addEventListener("offline", () => {
  isOnline = false;
  console.warn("⚠️ Offline mode");
});

/* ══════════════════════════════════
   PERSISTENCIA (NO BLOQUEANTE)
══════════════════════════════════ */
try {
  db.enablePersistence({ synchronizeTabs: true })
    .then(() => console.log("💾 Persistence OK"))
    .catch(err => {
      if (err.code === "failed-precondition") {
        console.warn("Persistence: otra pestaña activa");
      } else if (err.code === "unimplemented") {
        console.warn("Persistence no soportada");
      }
    });
} catch (e) {
  console.warn("Persistence error:", e);
}

/* ══════════════════════════════════
   CACHE LOCAL (FALLBACK RÁPIDO)
══════════════════════════════════ */
const localCache = new Map();

/* ══════════════════════════════════
   GET (OPTIMIZADO + FAST FALLBACK)
══════════════════════════════════ */
async function fsGet(key) {
  try {
    // 1. Cache inmediata (ULTRA RÁPIDO)
    if (localCache.has(key)) {
      return localCache.get(key);
    }

    // 2. Si está offline → cache local
    if (!isOnline) {
      return localStorage.getItem(key)
        ? JSON.parse(localStorage.getItem(key))
        : undefined;
    }

    // 3. Firestore fetch
    const snap = await db.collection(FS_COLLECTION).doc(key).get();

    if (!snap.exists) return undefined;

    const value = snap.data().value;

    // Guardar en cache RAM + localStorage
    localCache.set(key, value);
    localStorage.setItem(key, JSON.stringify(value));

    return value;

  } catch (e) {
    console.warn(`fsGet fallback [${key}]`, e);

    // fallback final
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : undefined;
  }
}

/* ══════════════════════════════════
   SET (FAST + CACHE)
══════════════════════════════════ */
async function fsSet(key, value) {
  try {
    localCache.set(key, value);
    localStorage.setItem(key, JSON.stringify(value));

    if (!isOnline) return;

    await db.collection(FS_COLLECTION).doc(key).set({
      value,
      updatedAt: Date.now()
    });

  } catch (e) {
    console.error("fsSet error:", e);
  }
}

/* ══════════════════════════════════
   DELETE
══════════════════════════════════ */
async function fsDelete(key) {
  try {
    localCache.delete(key);
    localStorage.removeItem(key);

    if (!isOnline) return;

    await db.collection(FS_COLLECTION).doc(key).delete();

  } catch (e) {
    console.error("fsDelete error:", e);
  }
}

/* ══════════════════════════════════
   PRELOAD (MEJORA VELOCIDAD INICIAL)
══════════════════════════════════ */
async function fsWarmup(keys = []) {
  keys.forEach(k => fsGet(k));
}