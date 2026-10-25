/* ============================================================
   app.js   shared setup and helpers

   TO LOOK AROUND WITHOUT FIREBASE:
     leave  demo: true  below. Everything works, data is saved
     only in that one browser. Open index.html and go.

   WHEN YOU ARE READY FOR THE REAL THING:
     set    demo: false
     and paste your firebaseConfig.
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword,
         setPersistence, browserLocalPersistence, browserSessionPersistence,
         signOut as fbSignOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc as fbDoc, getDoc as fbGetDoc, setDoc as fbSetDoc,
         updateDoc as fbUpdateDoc, collection as fbCollection, addDoc as fbAddDoc,
         deleteDoc as fbDeleteDoc, query as fbQuery, orderBy as fbOrderBy,
         limit as fbLimit, onSnapshot as fbOnSnapshot,
         serverTimestamp as fbServerTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref as fbSref, uploadBytes as fbUploadBytes,
         getDownloadURL as fbGetDownloadURL, deleteObject as fbDeleteObject }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

/* ============ 1. YOUR CONFIG ============================== */

export const SETUP = {
  demo: false,                 // false means it now uses Firebase for real
  useCloudStorage: false,      // stays off the Blaze plan, pictures only
  stayLoggedIn: true,          // keeps the sign in across browser restarts
  lockAfterHours: 6,           // signs out after this many hours untouched. 0 turns it off

  dueDate: "2027-04-17",       // change this in Settings after the scan
  herName: "Halima",
  hisName: "Abdul-Manan",

  herEmail: "halima@littleone.app",   // the account she signs in with

  clinicName: "Altru Clinic",
  clinicPhone: "+17017805000"
};

const firebaseConfig = {
  apiKey: "AIzaSyApI5hgrVc_RahDZl6JVJu4Z3PT0u9uIYU",
  authDomain: "littleone-f1235.firebaseapp.com",
  projectId: "littleone-f1235",
  storageBucket: "littleone-f1235.firebasestorage.app",
  messagingSenderId: "403633062310",
  appId: "1:403633062310:web:3016e4fa4df7d74b900f67"
};

/* ============ 2. plumbing, leave alone ==================== */

const LIVE = !SETUP.demo;

const app = LIVE ? initializeApp(firebaseConfig) : null;
export const auth  = LIVE ? getAuth(app) : null;
export const db    = LIVE ? getFirestore(app) : { demo: true };
export const store = LIVE ? getStorage(app) : { demo: true };

/* ---------- demo store: same shapes, localStorage behind ---------- */

const KEY = "littleone.demo";
const listeners = [];

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; }
}
function persist(all) {
  try { localStorage.setItem(KEY, JSON.stringify(all)); }
  catch (e) { toast("Demo storage is full. Delete a picture."); }
  listeners.forEach(fn => fn());
}
function coll(name) {
  const all = load();
  return all[name] || {};
}
function put(name, id, value) {
  const all = load();
  all[name] = all[name] || {};
  all[name][id] = value;
  persist(all);
}
function drop(name, id) {
  const all = load();
  if (all[name]) delete all[name][id];
  persist(all);
}

const demo = {
  doc: (_db, c, i) => ({ c, i }),
  collection: (_db, c) => ({ c }),
  getDoc: async r => {
    const v = coll(r.c)[r.i];
    return { id: r.i, exists: () => v !== undefined, data: () => v };
  },
  setDoc: async (r, data, opt) => {
    const old = (opt && opt.merge) ? (coll(r.c)[r.i] || {}) : {};
    put(r.c, r.i, Object.assign({}, old, data));
  },
  updateDoc: async (r, data) =>
    put(r.c, r.i, Object.assign({}, coll(r.c)[r.i] || {}, data)),
  deleteDoc: async r => drop(r.c, r.i),
  addDoc: async (cr, data) => {
    const id = "d" + Date.now() + Math.floor(Math.random() * 999);
    put(cr.c, id, data);
    return { id };
  },
  query: (cr, ...parts) => Object.assign({ c: cr.c }, ...parts),
  orderBy: (field, dir) => ({ _f: field, _d: dir || "asc" }),
  limit: n => ({ _n: n }),
  serverTimestamp: () => Date.now(),
  onSnapshot: (q, cb) => {
    const run = () => {
      let rows = Object.entries(coll(q.c)).map(([id, v]) => ({
        id, data: () => v, _v: v
      }));
      if (q._f) {
        rows.sort((a, b) => {
          const x = a._v[q._f], y = b._v[q._f];
          const r = x > y ? 1 : x < y ? -1 : 0;
          return q._d === "desc" ? -r : r;
        });
      }
      if (q._n) rows = rows.slice(0, q._n);
      cb({ empty: rows.length === 0, docs: rows, docChanges: () => [] });
    };
    listeners.push(run);
    run();
    return () => {};
  },
  sref: (_s, path) => ({ path }),
  uploadBytes: async (r, file) => {
    const url = await new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
    put("_files", r.path, url);
    return { ref: r };
  },
  getDownloadURL: async r => coll("_files")[r.path],
  deleteObject: async r => drop("_files", r.path)
};

export const doc             = LIVE ? fbDoc             : demo.doc;
export const getDoc          = LIVE ? fbGetDoc          : demo.getDoc;
export const setDoc          = LIVE ? fbSetDoc          : demo.setDoc;
export const updateDoc       = LIVE ? fbUpdateDoc       : demo.updateDoc;
export const collection      = LIVE ? fbCollection      : demo.collection;
export const addDoc          = LIVE ? fbAddDoc          : demo.addDoc;
export const deleteDoc       = LIVE ? fbDeleteDoc       : demo.deleteDoc;
export const query           = LIVE ? fbQuery           : demo.query;
export const orderBy         = LIVE ? fbOrderBy         : demo.orderBy;
export const limit           = LIVE ? fbLimit           : demo.limit;
export const onSnapshot      = LIVE ? fbOnSnapshot      : demo.onSnapshot;
export const serverTimestamp = LIVE ? fbServerTimestamp : demo.serverTimestamp;
export const sref            = LIVE ? fbSref            : demo.sref;
export const uploadBytes     = LIVE ? fbUploadBytes     : demo.uploadBytes;
export const getDownloadURL  = LIVE ? fbGetDownloadURL  : demo.getDownloadURL;
export const deleteObject    = LIVE ? fbDeleteObject    : demo.deleteObject;
export const signOut         = LIVE ? fbSignOut         : async () => {};

/* ---------- pictures ----------------------------------------
   Two routes:
   - inline  (default): the picture is shrunk in the browser and
     kept inside the Firestore document. No Blaze plan, no card,
     no Storage rules. Images only.
   - cloud: real Cloud Storage. Needs the Blaze plan. Any file.
   ------------------------------------------------------------ */

export const CLOUD_FILES = LIVE && SETUP.useCloudStorage;

const MAX_INLINE = 600 * 1024;   // stay well under Firestore's 1 MB limit

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("That file is not a readable image."));
      img.src = fr.result;
    };
    fr.onerror = () => reject(new Error("Could not read the file."));
    fr.readAsDataURL(file);
  });
}

/* Shrink to a jpeg data url small enough to sit in a document. */
export async function shrinkImage(file, maxDim = 1400) {
  const img = await loadImage(file);
  let dim = maxDim, quality = 0.74, url = "";

  for (let pass = 0; pass < 7; pass++) {
    const scale = Math.min(1, dim / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    url = c.toDataURL("image/jpeg", quality);
    if (url.length <= MAX_INLINE) return url;
    if (quality > 0.42) quality -= 0.12; else dim = Math.round(dim * 0.75);
  }
  throw new Error("That picture will not compress small enough. Try a screenshot of it.");
}

/* Returns { url, path, name, isImage }. path is "" for inline. */
export async function putFile(file) {
  const isImage = /^image\//.test(file.type);

  if (!CLOUD_FILES) {
    if (!isImage) {
      throw new Error("Only pictures can be saved on this setup. Photograph the document instead.");
    }
    const url = await shrinkImage(file);
    return { url, path: "", name: file.name, isImage: true };
  }

  if (file.size > 10 * 1024 * 1024) throw new Error("Keep it under 10 MB.");
  const path = "files/" + Date.now() + "_" + file.name.replace(/[^\w.\-]/g, "_");
  const r = sref(store, path);
  await uploadBytes(r, file);
  const url = await getDownloadURL(r);
  return { url, path, name: file.name, isImage };
}

export async function removeFile(path) {
  if (!path || !CLOUD_FILES) return;
  try { await deleteObject(sref(store, path)); } catch (e) {}
}

export let ME = null;

/* How long a sign in lasts.
   stayLoggedIn true  -> kept in the browser, survives restarts, never expires
   stayLoggedIn false -> cleared the moment the browser closes            */
const persistReady = LIVE
  ? setPersistence(auth, SETUP.stayLoggedIn === false
      ? browserSessionPersistence : browserLocalPersistence).catch(() => {})
  : Promise.resolve();

/* ---------- idle lock ----------------------------------------
   The sign in survives restarts, but goes stale after a stretch
   of not touching it. Set lockAfterHours to 0 to switch off.
   ------------------------------------------------------------ */

export const LOCK_MS = (SETUP.lockAfterHours || 0) * 3600000;
const ACT_KEY = "littleone.lastTouch";

function touch() { try { localStorage.setItem(ACT_KEY, String(Date.now())); } catch (e) {} }

function idleMs() {
  const v = Number(localStorage.getItem(ACT_KEY) || 0);
  return v ? Date.now() - v : 0;
}

async function lockOut() {
  try { localStorage.removeItem(ACT_KEY); } catch (e) {}
  if (LIVE) { try { await fbSignOut(auth); } catch (e) {} }
  location.replace("login.html?reason=idle");
}

function watchIdle() {
  if (!LOCK_MS) return;
  const check = () => { if (idleMs() > LOCK_MS) lockOut(); };
  ["pointerdown", "keydown", "touchstart", "wheel"].forEach(ev =>
    window.addEventListener(ev, touch, { passive: true }));
  document.addEventListener("visibilitychange", () => { if (!document.hidden) check(); });
  setInterval(check, 60000);
}

/* ---------- last seen -----------------------------------------
   One row per person, rewritten at most every five minutes, so
   each of you can see when the other last opened it.
   ------------------------------------------------------------ */

const PING_KEY = "littleone.lastPing";

async function ping() {
  if (!LIVE) return;
  const last = Number(localStorage.getItem(PING_KEY) || 0);
  if (Date.now() - last < 5 * 60000) return;
  try {
    localStorage.setItem(PING_KEY, String(Date.now()));
    await setDoc(doc(db, "presence", side()), {
      name: myName(),
      page: (location.pathname.split("/").pop() || "index.html").replace(".html", ""),
      lastSeen: Date.now()
    }, { merge: true });
  } catch (e) {}
}

/* Hold the page until signed in. Returns the user. */
export async function requireAuth() {
  if (!LIVE) {
    ME = { email: SETUP.herEmail, demo: true };
    document.body.dataset.ready = "1";
    return ME;
  }
  await persistReady;
  return new Promise(resolve => {
    onAuthStateChanged(auth, user => {
      if (!user) {
        const here = location.pathname.split("/").pop() || "index.html";
        if (here !== "login.html") {
          location.replace("login.html?next=" + encodeURIComponent(here));
        }
        return;
      }
      ME = user;
      if (LOCK_MS && idleMs() > LOCK_MS) { lockOut(); return; }
      touch();
      watchIdle();
      ping();
      document.body.dataset.ready = "1";
      resolve(user);
    });
  });
}

export async function signIn(email, password) {
  await persistReady;
  const res = await signInWithEmailAndPassword(auth, email, password);
  touch();
  try { localStorage.removeItem(PING_KEY); } catch (e) {}
  return res;
}

/* Sign out and go straight back to the sign in screen. */
export async function leave(reason) {
  try { localStorage.removeItem(ACT_KEY); } catch (e) {}
  if (LIVE) { try { await fbSignOut(auth); } catch (e) {} }
  location.replace("login.html" + (reason ? "?reason=" + reason : ""));
}

/* Who is writing: "her" or "him". Only decides the card colour. */
export function side() {
  if (!LIVE) return localStorage.getItem("littleone.as") || "her";
  return (ME && ME.email === SETUP.herEmail) ? "her" : "him";
}
export function myName() {
  return side() === "her" ? SETUP.herName : SETUP.hisName;
}

/* Only the husband's account can delete. She can add and edit.
   This hides the buttons. The Firestore rules do the real enforcing. */
export function isAdmin() { return side() === "him"; }
export function setSide(s) { localStorage.setItem("littleone.as", s); }
export const isDemo = !LIVE;

/* ---- dates and week maths ---- */

export const DAY = 86400000;

export function today() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function dayKey(d = new Date()) {
  const p = n => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

/* Returns { week, day, totalDays, daysLeft, due, trimester } */
export function progress(dueStr) {
  const due = new Date((dueStr || SETUP.dueDate) + "T00:00:00");
  const daysLeft = Math.round((due - today()) / DAY);
  const totalDays = Math.max(0, 280 - daysLeft);
  return {
    due, daysLeft, totalDays,
    week: Math.floor(totalDays / 7),
    day: totalDays % 7,
    trimester: totalDays < 98 ? 1 : totalDays < 189 ? 2 : 3
  };
}

export function prettyDate(d) {
  if (typeof d === "string") d = new Date(d + "T00:00:00");
  return d.toLocaleDateString(undefined,
    { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

export function shortDate(d) {
  if (typeof d === "string") d = new Date(d + "T00:00:00");
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export function timeAgo(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  const mins = Math.round((Date.now() - d) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return mins + " min ago";
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return hrs + (hrs === 1 ? " hour ago" : " hours ago");
  const days = Math.round(hrs / 24);
  if (days < 7) return days + (days === 1 ? " day ago" : " days ago");
  return prettyDate(d);
}

/* ---- the shared profile doc (due date lives here) ---- */

export async function getProfile() {
  const snap = await getDoc(doc(db, "profile", "main"));
  return snap.exists() ? snap.data() : { dueDate: SETUP.dueDate };
}

export async function saveProfile(data) {
  await setDoc(doc(db, "profile", "main"), data, { merge: true });
}

/* ---- small ui helpers ---- */

export function toast(msg) {
  let t = document.querySelector(".toast");
  if (!t) {
    t = document.createElement("div");
    t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove("show"), 2200);
}

export function esc(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/* ---- navigation, drawn by js so every page stays in step ---- */

const ICONS = {
  home:  '<path d="M3 10.5 12 3l9 7.5V21H3z"/>',
  today: '<path d="M4 5h16v16H4z"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  week:  '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  food:  '<path d="M5 3v8a3 3 0 0 0 6 0V3"/><path d="M8 11v10"/><path d="M17 3c-1.5 2-2 4-2 6s.5 3 2 3 2-1 2-3-.5-4-2-6z"/><path d="M17 12v9"/>',
  more:  '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>'
};

const TABS = [
  ["index.html",  "Home",  "home"],
  ["log.html",    "Today", "today"],
  ["week.html",   "Week",  "week"],
  ["food.html",   "Safe?", "food"],
  ["more.html",   "More",  "more"]
];

export function drawNav(current) {
  const nav = document.createElement("nav");
  nav.className = "tabs";
  nav.innerHTML = TABS.map(([href, label, icon]) => `
    <a href="${href}" class="${href === current ? "on" : ""}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        ${ICONS[icon]}
      </svg>${label}
    </a>`).join("");
  document.body.appendChild(nav);
}

export function drawTop(sub) {
  const bar = el(`
    <header class="topbar">
      <a class="mark" href="index.html">Little One</a>
      <span class="who">${esc(sub || "")}</span>
    </header>`);
  document.body.prepend(bar);

  if (!LIVE) {
    const strip = el(`
      <div style="background:var(--gold-soft);color:#7A5614;font-size:.76rem;
                  text-align:center;padding:.4rem .8rem">
        Demo mode. Saved in this browser only. Posting as
        <button id="asWho" style="border:0;background:none;color:#7A5614;
          text-decoration:underline;cursor:pointer;font:inherit;padding:0">
          ${side() === "her" ? SETUP.herName : SETUP.hisName}</button>
      </div>`);
    document.body.prepend(strip);
    strip.querySelector("#asWho").onclick = () => {
      setSide(side() === "her" ? "him" : "her");
      location.reload();
    };
  }
}

/* ---- browser notifications ---- */

export async function askNotify() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const res = await Notification.requestPermission();
  return res === "granted";
}

export function notify(title, body) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try { new Notification(title, { body, icon: "icon.png" }); } catch (e) {}
}

/* Watch for new update cards and pop a notification for ones
   the other person wrote while this page is open.             */
export function watchUpdatesForNotices() {
  if (!LIVE) return;
  const since = Date.now();
  const q = query(collection(db, "updates"), orderBy("createdAt", "desc"), limit(5));
  onSnapshot(q, snap => {
    snap.docChanges().forEach(ch => {
      if (ch.type !== "added") return;
      const d = ch.doc.data();
      if (!d.createdAt) return;
      const when = d.createdAt.toDate ? d.createdAt.toDate().getTime() : 0;
      if (when < since) return;
      if (d.side === side()) return;
      notify(d.author + " posted", d.text ? d.text.slice(0, 90) : "");
    });
  });
}
