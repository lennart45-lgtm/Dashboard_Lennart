import { useState, useEffect, useRef, useCallback } from "react";
import { storage } from "./storage.js";

// ── ICONS (SVG, keine Emojis) ─────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home: <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>,
    fitness: <><rect x="3" y="11" width="4" height="2" rx="1" fill={color}/><rect x="17" y="11" width="4" height="2" rx="1" fill={color}/><rect x="7" y="8" width="2" height="8" rx="1" fill={color}/><rect x="15" y="8" width="2" height="8" rx="1" fill={color}/><rect x="9" y="10" width="6" height="4" rx="1" fill={color}/></>,
    book: <><path d="M4 4h11a1 1 0 011 1v13H5a1 1 0 01-1-1V4z" fill="none" stroke={color} strokeWidth="1.5"/><path d="M16 18h2a1 1 0 000-2h-2" fill="none" stroke={color} strokeWidth="1.5"/><line x1="8" y1="9" x2="13" y2="9" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="12" x2="13" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    nutrition: <><path d="M12 2C8 2 5 6 5 10c0 3 1.5 5.5 4 7v3h6v-3c2.5-1.5 4-4 4-7 0-4-3-8-7-8z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><line x1="9" y1="22" x2="15" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    notes: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><polyline points="14,2 14,8 20,8" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" fill="none" stroke={color} strokeWidth="1.5"/><line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="1.5"/><line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><rect x="7" y="13" width="3" height="3" rx="0.5" fill={color}/></>,
    sun: <><circle cx="12" cy="12" r="4" fill="none" stroke={color} strokeWidth="1.5"/><line x1="12" y1="2" x2="12" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="2" y1="12" x2="4" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="20" y1="12" x2="22" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    cloud: <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>,
    rain: <><path d="M20 16.2A5 5 0 0018 7h-1.26A8 8 0 104 15.25" fill="none" stroke={color} strokeWidth="1.5"/><line x1="8" y1="19" x2="8" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="16" y1="19" x2="16" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    check: <polyline points="20,6 9,17 4,12" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
    trash: <><polyline points="3,6 5,6 21,6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    back: <><line x1="19" y1="12" x2="5" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><polyline points="12,19 5,12 12,5" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    flame: <path d="M12 2c0 0-5 5-5 10a5 5 0 0010 0c0-3-2-5-2-5s0 3-3 3c0-3 1-5 0-8z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>,
    target: <><circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="12" r="6" fill="none" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="12" r="2" fill={color}/></>,
    chart: <><line x1="18" y1="20" x2="18" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="20" x2="12" y2="4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    timer: <><circle cx="12" cy="12" r="9" fill="none" stroke={color} strokeWidth="1.5"/><polyline points="12,7 12,12 15,15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    water: <path d="M12 2L5 12a7 7 0 1014 0L12 2z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>,
    moon: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>,
    sync: <><polyline points="23,4 23,10 17,10" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><polyline points="1,20 1,14 7,14" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></>,
    edit: <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/></>,
    download: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><polyline points="7,10 12,15 17,10" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    upload: <><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><polyline points="17,8 12,3 7,8" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></>,
    dumbbell: <><rect x="2" y="10" width="3" height="4" rx="1" fill={color}/><rect x="19" y="10" width="3" height="4" rx="1" fill={color}/><rect x="5" y="8" width="2" height="8" rx="1" fill={color}/><rect x="17" y="8" width="2" height="8" rx="1" fill={color}/><line x1="7" y1="12" x2="17" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/></>,
    heart: <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>,
    person: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/><circle cx="12" cy="7" r="4" fill="none" stroke={color} strokeWidth="1.5"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {icons[name] || null}
    </svg>
  );
};

// ── USER ──────────────────────────────────────────────────────────────────────
const USER = { geburtsdatum: "2004-01-11", groesse: 178, gewichtStart: 78, uni: "HAW Kiel", studiengang: "Maschinenbau" };
function getAlter() { const b = new Date(USER.geburtsdatum), h = new Date(); let a = h.getFullYear() - b.getFullYear(); if (h < new Date(h.getFullYear(), b.getMonth(), b.getDate())) a--; return a; }
function getBMI(kg) { return (kg / ((USER.groesse / 100) ** 2)).toFixed(1); }
function getTDEE(kg, f = 1.55) { return Math.round((10 * kg + 6.25 * USER.groesse - 5 * getAlter() + 5) * f); }

// ── STORAGE ───────────────────────────────────────────────────────────────────
function getTodayKey() { return new Date().toISOString().split("T")[0]; }
function getInitialLog() {
  return {
    workout: { done: false, split: "", dauer: "", exercises: [], notes: "", intensity: 3 },
    nutrition: { meals: [{ name: "Frühstück", items: "", kcal: "" }, { name: "Mittagessen", items: "", kcal: "" }, { name: "Abendessen", items: "", kcal: "" }, { name: "Snacks", items: "", kcal: "" }], water: 0, protein: "" },
    sleep: { from: "", to: "", hours: "", quality: 70 },
    weight: "", bodyfat: "",
    mood: 0, energy: 0, stress: 0,
    notes: "", supplements: [],
  };
}
const INITIAL_DATA = { timetable: { Mo: [], Di: [], Mi: [], Do: [], Fr: [], Sa: [], So: [] }, exams: [], logs: {}, notes: [] };
const WORKOUT_PRESETS = {
  Push: [{ name: "Bankdrücken", sets: 4, reps: "8-10", muscle: "Brust" }, { name: "Schrägbank Kurzhantel", sets: 3, reps: "10-12", muscle: "Brust" }, { name: "Schulterdrücken", sets: 4, reps: "8-10", muscle: "Schultern" }, { name: "Seitheben", sets: 3, reps: "12-15", muscle: "Schultern" }, { name: "Trizeps Pushdown", sets: 3, reps: "12-15", muscle: "Trizeps" }, { name: "Dips", sets: 3, reps: "10-12", muscle: "Trizeps" }],
  Pull: [{ name: "Klimmzüge", sets: 4, reps: "6-10", muscle: "Rücken" }, { name: "Latzug", sets: 3, reps: "10-12", muscle: "Rücken" }, { name: "Kabelrudern", sets: 3, reps: "10-12", muscle: "Rücken" }, { name: "Langhantelrudern", sets: 4, reps: "8-10", muscle: "Rücken" }, { name: "Bizeps Curls", sets: 3, reps: "10-12", muscle: "Bizeps" }, { name: "Hammer Curls", sets: 3, reps: "12-15", muscle: "Bizeps" }],
  Legs: [{ name: "Kniebeugen", sets: 4, reps: "6-8", muscle: "Quadrizeps" }, { name: "Beinpresse", sets: 3, reps: "10-12", muscle: "Quadrizeps" }, { name: "Romanian Deadlift", sets: 4, reps: "8-10", muscle: "Hamstrings" }, { name: "Beinbeuger", sets: 3, reps: "12-15", muscle: "Hamstrings" }, { name: "Hip Thrust", sets: 4, reps: "10-12", muscle: "Gesäß" }, { name: "Wadenheben", sets: 4, reps: "15-20", muscle: "Waden" }],
};

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const C = {
  bg: "#000000", bg1: "#0d0d0d", bg2: "#1a1a1a", bg3: "#2a2a2a",
  border: "rgba(255,255,255,0.08)", borderHover: "rgba(255,255,255,0.15)",
  text: "#ffffff", text2: "#ababab", text3: "#666666",
  accent: "#0a84ff", accentGreen: "#30d158", accentOrange: "#ff9f0a",
  accentRed: "#ff453a", accentPurple: "#bf5af2", accentTeal: "#5ac8fa",
};
const cardStyle = (active = false) => ({
  background: C.bg2, borderRadius: 16, border: `1px solid ${active ? C.border : C.border}`,
  padding: 20, cursor: "pointer", transition: "all 0.2s ease",
  boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
});
const inputStyle = {
  background: C.bg3, border: `1px solid ${C.border}`, borderRadius: 10,
  color: C.text, padding: "10px 14px", fontSize: 15, outline: "none",
  width: "100%", boxSizing: "border-box", fontFamily: "inherit",
};
const btnPrimary = (color = C.accent) => ({
  background: color, color: "#fff", border: "none", borderRadius: 10,
  padding: "11px 20px", cursor: "pointer", fontWeight: 600, fontSize: 15,
  fontFamily: "inherit", transition: "opacity 0.15s",
});
const btnGhost = {
  background: "transparent", color: C.text2, border: `1px solid ${C.border}`,
  borderRadius: 10, padding: "10px 16px", cursor: "pointer", fontSize: 14,
  fontFamily: "inherit", transition: "all 0.15s",
};

// ── CLOCK ─────────────────────────────────────────────────────────────────────
function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(i); }, []);
  const h = String(time.getHours()).padStart(2, "0");
  const m = String(time.getMinutes()).padStart(2, "0");
  const day = time.toLocaleDateString("de-DE", { weekday: "long", day: "numeric", month: "long" });
  return (
    <div style={{ textAlign: "center", padding: "32px 0 16px" }}>
      <div style={{ fontSize: 72, fontWeight: 200, letterSpacing: -4, color: C.text, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
        {h}<span style={{ opacity: 0.4, animation: "blink 1s step-end infinite" }}>:</span>{m}
      </div>
      <div style={{ fontSize: 16, color: C.text2, marginTop: 8, fontWeight: 400 }}>{day}</div>
    </div>
  );
}

// ── WEATHER WIDGET ────────────────────────────────────────────────────────────
function WeatherWidget() {
  const w = { temp: 15, high: 18, low: 10, condition: "Leicht bewölkt", rain: 40, icon: "cloud" };
  return (
    <div style={{ background: "linear-gradient(135deg, #1c2f4a, #0d1f35)", borderRadius: 16, padding: "16px 20px", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: 13, color: C.text2, marginBottom: 4 }}>Kiel</div>
        <div style={{ fontSize: 36, fontWeight: 300, color: C.text }}>{w.temp}°</div>
        <div style={{ fontSize: 13, color: C.text2, marginTop: 2 }}>{w.condition}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <Icon name={w.icon} size={36} color={C.accentTeal} />
        <div style={{ fontSize: 12, color: C.text3, marginTop: 8 }}>H:{w.high}° T:{w.low}°</div>
        <div style={{ fontSize: 12, color: C.accentTeal, marginTop: 2 }}>Regen {w.rain}%</div>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(INITIAL_DATA);
  const [screen, setScreen] = useState("home");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try { const r = await storage.get("dashboard_v4"); if (r?.value) setData({ ...INITIAL_DATA, ...JSON.parse(r.value) }); }
      catch (e) {}
      setLoaded(true);
    }
    load();
  }, []);

  const save = useCallback(async (d) => { try { await storage.set("dashboard_v4", JSON.stringify(d)); } catch (e) {} }, []);
  function updateData(nd) { setData(nd); save(nd); }
  function getLog() { return data.logs[getTodayKey()] || getInitialLog(); }
  function updateLog(log) { updateData({ ...data, logs: { ...data.logs, [getTodayKey()]: log } }); }

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@200;300;400;500;600&display=swap');
      * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
      body { background: #000; font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; }
      @keyframes blink { 50% { opacity: 0.2; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      ::-webkit-scrollbar { width: 0; }
      input, textarea, select { font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif; }
      input[type=range] { accent-color: #0a84ff; }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (!loaded) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#000", color: "#fff", fontSize: 16 }}>Laden…</div>;

  const screens = { home: HomeScreen, fitness: FitnessScreen, study: StudyScreen, nutrition: NutritionScreen, notes: NotesScreen, sync: SyncScreen };
  const Screen = screens[screen] || HomeScreen;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", animation: "fadeIn 0.3s ease" }}>
      <Screen data={data} updateData={updateData} log={getLog()} updateLog={updateLog} setScreen={setScreen} />
    </div>
  );
}

// ── HOME SCREEN ───────────────────────────────────────────────────────────────
function HomeScreen({ log, setScreen, data }) {
  const todayKey = getTodayKey();
  const streak = (() => { let c = 0; const t = new Date(); for (let i = 1; i <= 90; i++) { const d = new Date(t); d.setDate(d.getDate() - i); if (data.logs[d.toISOString().split("T")[0]]?.workout?.done) c++; else break; } return c; })();
  const kcalToday = (log.nutrition?.meals || []).reduce((s, m) => s + Number(m.kcal || 0), 0);
  const tdee = getTDEE(log.weight || USER.gewichtStart);
  const apps = [
    { id: "fitness", label: "Fitness", icon: "dumbbell", color: C.accentOrange, sub: log.workout?.done ? `${log.workout.split || "Training"} ✓` : streak > 0 ? `${streak} Tage Streak` : "Kein Training heute" },
    { id: "study", label: "Studium", icon: "book", color: C.accent, sub: `${data.exams?.filter(e => e.datum && new Date(e.datum) > new Date()).length || 0} Klausuren` },
    { id: "nutrition", label: "Ernährung", icon: "nutrition", color: C.accentGreen, sub: kcalToday > 0 ? `${kcalToday} / ${tdee} kcal` : `Ziel: ${tdee} kcal` },
    { id: "notes", label: "Notizen", icon: "notes", color: C.accentPurple, sub: `${data.notes?.length || 0} Notizen` },
    { id: "sync", label: "Sync", icon: "sync", color: C.text3, sub: "Export / Import" },
  ];

  return (
    <div style={{ padding: "0 20px 100px", animation: "slideUp 0.4s ease" }}>
      <Clock />
      <div style={{ marginBottom: 20 }}><WeatherWidget /></div>

      {/* Quick Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Schlaf", value: log.sleep?.hours ? `${log.sleep.hours}h` : "—", icon: "moon", color: C.accentPurple },
          { label: "Wasser", value: `${log.nutrition?.water || 0}/8`, icon: "water", color: C.accentTeal },
          { label: "Streak", value: `${streak}d`, icon: "flame", color: C.accentOrange },
        ].map(s => (
          <div key={s.label} style={{ background: C.bg2, borderRadius: 14, padding: "14px 12px", textAlign: "center", border: `1px solid ${C.border}` }}>
            <Icon name={s.icon} size={18} color={s.color} />
            <div style={{ fontSize: 20, fontWeight: 600, color: C.text, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.text3, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* App Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {apps.map(app => (
          <div key={app.id} onClick={() => setScreen(app.id)}
            style={{ background: C.bg2, borderRadius: 20, padding: 20, cursor: "pointer", border: `1px solid ${C.border}`, transition: "transform 0.15s, opacity 0.15s", active: { transform: "scale(0.97)" } }}
            onTouchStart={e => e.currentTarget.style.opacity = "0.7"}
            onTouchEnd={e => e.currentTarget.style.opacity = "1"}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${app.color}22`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon name={app.icon} size={22} color={app.color} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 4 }}>{app.label}</div>
            <div style={{ fontSize: 12, color: C.text3, lineHeight: 1.4 }}>{app.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SCREEN WRAPPER ────────────────────────────────────────────────────────────
function ScreenWrapper({ title, icon, iconColor, setScreen, children }) {
  return (
    <div style={{ minHeight: "100vh", animation: "slideUp 0.3s ease" }}>
      <div style={{ position: "sticky", top: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, zIndex: 100 }}>
        <button onClick={() => setScreen("home")} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center" }}>
          <Icon name="back" size={22} color={C.accent} />
        </button>
        <Icon name={icon} size={20} color={iconColor} />
        <span style={{ fontSize: 17, fontWeight: 600, color: C.text }}>{title}</span>
      </div>
      <div style={{ padding: "20px 20px 100px" }}>{children}</div>
    </div>
  );
}

// ── FITNESS SCREEN ────────────────────────────────────────────────────────────
function FitnessScreen({ log, updateLog, data, setScreen }) {
  const [subScreen, setSubScreen] = useState("overview"); // overview | workout | history | body
  const w = log.workout || getInitialLog().workout;
  const setW = (nw) => updateLog({ ...log, workout: { ...w, ...nw } });

  const allLogs = data.logs || {};
  const streak = (() => { let c = 0; const t = new Date(); for (let i = 1; i <= 90; i++) { const d = new Date(t); d.setDate(d.getDate() - i); if (allLogs[d.toISOString().split("T")[0]]?.workout?.done) c++; else break; } return c; })();
  const totalSessions = Object.values(allLogs).filter(l => l?.workout?.done).length;
  const avgVol = (() => {
    const vols = Object.values(allLogs).map(l => (l?.workout?.exercises || []).reduce((s, e) => s + (e.sets || []).reduce((s2, st) => s2 + (Number(st.kg) || 0) * (Number(st.reps) || 0), 0), 0)).filter(v => v > 0);
    return vols.length ? Math.round(vols.reduce((a, b) => a + b, 0) / vols.length) : 0;
  })();

  function loadPreset(split) {
    const exs = (WORKOUT_PRESETS[split] || []).map(e => ({ ...e, sets: Array.from({ length: e.sets }, () => ({ kg: "", reps: "" })), done: false }));
    setW({ split, exercises: exs, done: true });
  }
  function addExercise() { setW({ exercises: [...(w.exercises || []), { name: "", muscle: "", sets: [{ kg: "", reps: "" }], done: false }] }); }
  function updateExercise(i, field, val) { const ex = [...(w.exercises || [])]; ex[i] = { ...ex[i], [field]: val }; setW({ exercises: ex }); }
  function addSet(ei) { const ex = [...(w.exercises || [])]; const last = ex[ei].sets[ex[ei].sets.length - 1] || { kg: "", reps: "" }; ex[ei].sets = [...ex[ei].sets, { kg: last.kg, reps: last.reps }]; setW({ exercises: ex }); }
  function updateSet(ei, si, field, val) { const ex = [...(w.exercises || [])]; ex[ei].sets[si] = { ...ex[ei].sets[si], [field]: val }; setW({ exercises: ex }); }
  function removeSet(ei, si) { const ex = [...(w.exercises || [])]; ex[ei].sets = ex[ei].sets.filter((_, j) => j !== si); setW({ exercises: ex }); }
  function removeExercise(i) { setW({ exercises: (w.exercises || []).filter((_, j) => j !== i) }); }
  const totalVolume = (w.exercises || []).reduce((s, e) => s + (e.sets || []).reduce((s2, st) => s2 + (Number(st.kg) || 0) * (Number(st.reps) || 0), 0), 0);

  if (subScreen === "workout") return (
    <ScreenWrapper title="Workout" icon="dumbbell" iconColor={C.accentOrange} setScreen={() => setSubScreen("overview")}>
      {/* Workout Header */}
      <div style={{ background: C.bg2, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: w.done ? C.accentGreen : C.bg3 }} />
          <span style={{ fontSize: 14, color: w.done ? C.accentGreen : C.text2 }}>{w.done ? "Training läuft" : "Training starten"}</span>
          <div style={{ marginLeft: "auto" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={w.done || false} onChange={e => setW({ done: e.target.checked })} style={{ width: 18, height: 18, accentColor: C.accentGreen }} />
            </label>
          </div>
        </div>
        {/* Split Selector */}
        <div style={{ fontSize: 12, color: C.text3, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Split</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Push", "Pull", "Legs", "Upper", "Full Body", "Cardio"].map(s => (
            <button key={s} onClick={() => { setW({ split: s }); if (WORKOUT_PRESETS[s]) loadPreset(s); }}
              style={{ background: w.split === s ? C.accentOrange : C.bg3, color: w.split === s ? "#fff" : C.text2, border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit" }}>{s}</button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: C.text3, marginBottom: 6 }}>Dauer</div>
            <input value={w.dauer || ""} onChange={e => setW({ dauer: e.target.value })} placeholder="z.B. 75 min" style={inputStyle} />
          </div>
          <div>
            <div style={{ fontSize: 12, color: C.text3, marginBottom: 6 }}>Intensität</div>
            <div style={{ display: "flex", gap: 6 }}>
              {[1, 2, 3, 4, 5].map(v => (
                <div key={v} onClick={() => setW({ intensity: v })} style={{ flex: 1, height: 32, borderRadius: 6, background: v <= (w.intensity || 3) ? C.accentOrange : C.bg3, cursor: "pointer", transition: "background 0.15s" }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Exercises */}
      {(w.exercises || []).map((ex, ei) => {
        const exVol = (ex.sets || []).reduce((s, st) => s + (Number(st.kg) || 0) * (Number(st.reps) || 0), 0);
        const maxKg = Math.max(...(ex.sets || []).map(st => Number(st.kg) || 0), 0);
        return (
          <div key={ei} style={{ background: C.bg2, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${C.border}`, opacity: ex.done ? 0.6 : 1 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              <input type="checkbox" checked={ex.done || false} onChange={e => updateExercise(ei, "done", e.target.checked)} style={{ width: 18, height: 18, accentColor: C.accentGreen, flexShrink: 0 }} />
              <input value={ex.name} onChange={e => updateExercise(ei, "name", e.target.value)} placeholder="Übungsname" style={{ ...inputStyle, fontWeight: 600, fontSize: 16 }} />
              <button onClick={() => removeExercise(ei)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: 4 }}>
                <Icon name="trash" size={18} color={C.text3} />
              </button>
            </div>
            {/* Sets */}
            <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 60px 28px", gap: 6, marginBottom: 8, padding: "0 2px" }}>
              {["#", "kg", "Wdh", "1RM", ""].map((h, i) => <div key={i} style={{ fontSize: 11, color: C.text3, textAlign: "center" }}>{h}</div>)}
            </div>
            {(ex.sets || []).map((set, si) => {
              const e1rm = set.kg && set.reps ? Math.round(Number(set.kg) * (1 + Number(set.reps) / 30)) : null;
              return (
                <div key={si} style={{ display: "grid", gridTemplateColumns: "32px 1fr 1fr 60px 28px", gap: 6, marginBottom: 6, alignItems: "center" }}>
                  <div style={{ fontSize: 13, color: C.text3, textAlign: "center" }}>{si + 1}</div>
                  <input type="number" value={set.kg} onChange={e => updateSet(ei, si, "kg", e.target.value)} placeholder="0" style={{ ...inputStyle, textAlign: "center", padding: "8px 4px", fontSize: 15, fontWeight: 600 }} />
                  <input type="number" value={set.reps} onChange={e => updateSet(ei, si, "reps", e.target.value)} placeholder="0" style={{ ...inputStyle, textAlign: "center", padding: "8px 4px", fontSize: 15 }} />
                  <div style={{ textAlign: "center", fontSize: 13, color: C.accentOrange, fontWeight: 600 }}>{e1rm ? `${e1rm}` : "—"}</div>
                  <button onClick={() => removeSet(ei, si)} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", justifyContent: "center" }}>
                    <Icon name="trash" size={14} color={C.text3} />
                  </button>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
              <button onClick={() => addSet(ei)} style={{ ...btnGhost, fontSize: 13, padding: "7px 14px" }}>+ Satz</button>
              {exVol > 0 && <span style={{ fontSize: 12, color: C.text3, marginLeft: "auto" }}>Vol: {exVol} kg · Max: {maxKg} kg</span>}
            </div>
          </div>
        );
      })}

      <button onClick={addExercise} style={{ ...btnGhost, width: "100%", padding: 14, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Icon name="plus" size={16} color={C.text2} /> Übung hinzufügen
      </button>

      {totalVolume > 0 && (
        <div style={{ background: `${C.accentOrange}15`, border: `1px solid ${C.accentOrange}30`, borderRadius: 14, padding: 16, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: C.text3, marginBottom: 4 }}>GESAMTVOLUMEN</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.accentOrange }}>{totalVolume.toLocaleString("de-DE")} kg</div>
        </div>
      )}
    </ScreenWrapper>
  );

  if (subScreen === "body") return (
    <ScreenWrapper title="Körperwerte" icon="heart" iconColor={C.accentRed} setScreen={() => setSubScreen("overview")}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
        {[{ label: "Gewicht (kg)", field: "weight", placeholder: "78.5", step: "0.1" }, { label: "Körperfett (%)", field: "bodyfat", placeholder: "15", step: "0.5" }].map(({ label, field, placeholder, step }) => (
          <div key={field} style={{ background: C.bg2, borderRadius: 16, padding: 16, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 12, color: C.text3, marginBottom: 8 }}>{label}</div>
            <input type="number" step={step} value={log[field] || ""} onChange={e => updateLog({ ...log, [field]: e.target.value })} placeholder={placeholder} style={{ ...inputStyle, fontSize: 28, fontWeight: 700, padding: "8px 0", background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, borderRadius: 0 }} />
            {field === "weight" && log.weight > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: C.text3 }}>BMI</span>
                  <span style={{ color: C.accentGreen, fontWeight: 600 }}>{getBMI(log.weight)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginTop: 6 }}>
                  <span style={{ color: C.text3 }}>TDEE</span>
                  <span style={{ color: C.accent, fontWeight: 600 }}>{getTDEE(log.weight)} kcal</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Supplements */}
      <div style={{ background: C.bg2, borderRadius: 16, padding: 16, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 12, color: C.text3, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Supplements heute</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Kreatin 5g", "Whey Protein", "Vitamin D3", "Omega-3", "Magnesium", "Zink", "Koffein"].map(s => {
            const active = (log.supplements || []).includes(s);
            return (
              <button key={s} onClick={() => { const arr = log.supplements || []; updateLog({ ...log, supplements: active ? arr.filter(x => x !== s) : [...arr, s] }); }}
                style={{ background: active ? `${C.accentGreen}20` : C.bg3, color: active ? C.accentGreen : C.text2, border: `1px solid ${active ? C.accentGreen + "50" : C.border}`, borderRadius: 20, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: active ? 500 : 400 }}>
                {s}
              </button>
            );
          })}
        </div>
      </div>
    </ScreenWrapper>
  );

  // Overview
  return (
    <ScreenWrapper title="Fitness" icon="dumbbell" iconColor={C.accentOrange} setScreen={setScreen}>
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Streak", value: `${streak}d`, color: C.accentOrange },
          { label: "Sessions", value: totalSessions, color: C.accent },
          { label: "Ø Volumen", value: avgVol > 0 ? `${avgVol}kg` : "—", color: C.accentGreen },
        ].map(s => (
          <div key={s.label} style={{ background: C.bg2, borderRadius: 14, padding: 14, textAlign: "center", border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.text3, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 7-Day Calendar */}
      <div style={{ background: C.bg2, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 12, color: C.text3, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Diese Woche</div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d, i) => {
            const date = new Date(); date.setDate(date.getDate() - ((date.getDay() + 6) % 7) + i);
            const key = date.toISOString().split("T")[0];
            const trained = data.logs[key]?.workout?.done;
            const isToday = key === getTodayKey();
            return (
              <div key={d} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: isToday ? C.accent : C.text3, marginBottom: 6, fontWeight: isToday ? 600 : 400 }}>{d}</div>
                <div style={{ height: 36, borderRadius: 8, background: trained ? C.accentOrange : C.bg3, border: isToday ? `2px solid ${C.accent}` : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {trained && <Icon name="check" size={14} color="#fff" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <button onClick={() => setSubScreen("workout")} style={{ background: C.accentOrange, color: "#fff", border: "none", borderRadius: 16, padding: 20, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
          <Icon name="dumbbell" size={24} color="#fff" />
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 12 }}>Workout</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>{w.done ? `${w.split || "Aktiv"}` : "Starten"}</div>
        </button>
        <button onClick={() => setSubScreen("body")} style={{ background: C.bg2, color: C.text, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
          <Icon name="heart" size={24} color={C.accentRed} />
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 12 }}>Körperwerte</div>
          <div style={{ fontSize: 12, color: C.text3, marginTop: 2 }}>{log.weight ? `${log.weight} kg` : "Eintragen"}</div>
        </button>
      </div>
    </ScreenWrapper>
  );
}

// ── STUDY SCREEN ──────────────────────────────────────────────────────────────
function StudyScreen({ data, updateData, setScreen }) {
  const [tab, setTab] = useState("exams");
  const exams = data.exams || [];
  const timetable = data.timetable || {};
  const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const todayIdx = (new Date().getDay() + 6) % 7;

  function addExam() { updateData({ ...data, exams: [...exams, { fach: "", datum: "", uhrzeit: "", raum: "", note: "", stoff: "" }] }); }
  function updateExam(i, f, v) { updateData({ ...data, exams: exams.map((e, j) => j === i ? { ...e, [f]: v } : e) }); }
  function removeExam(i) { updateData({ ...data, exams: exams.filter((_, j) => j !== i) }); }
  function daysUntil(d) { if (!d) return null; return Math.ceil((new Date(d) - new Date()) / 86400000); }

  return (
    <ScreenWrapper title="Studium" icon="book" iconColor={C.accent} setScreen={setScreen}>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["exams", "Klausuren"], ["timetable", "Stundenplan"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, background: tab === id ? C.accent : C.bg2, color: tab === id ? "#fff" : C.text2, border: `1px solid ${tab === id ? "transparent" : C.border}`, borderRadius: 10, padding: "10px 0", cursor: "pointer", fontSize: 14, fontWeight: 500, fontFamily: "inherit" }}>{label}</button>
        ))}
      </div>

      {tab === "exams" && (
        <div>
          {exams.length === 0 && <div style={{ textAlign: "center", color: C.text3, padding: 40, fontSize: 15 }}>Keine Klausuren eingetragen.</div>}
          {[...exams].map((ex, i) => {
            const days = daysUntil(ex.datum);
            const urgent = days !== null && days <= 14 && days >= 0;
            return (
              <div key={i} style={{ background: C.bg2, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${urgent ? C.accentOrange + "50" : C.border}` }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                  <input value={ex.fach} onChange={e => updateExam(i, "fach", e.target.value)} placeholder="Fach" style={{ ...inputStyle, fontWeight: 600, fontSize: 16 }} />
                  <button onClick={() => removeExam(i)} style={{ background: "transparent", border: "none", cursor: "pointer" }}><Icon name="trash" size={18} color={C.text3} /></button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[["datum", "Datum", "date"], ["uhrzeit", "Uhrzeit", "time"], ["raum", "Raum", "text"], ["note", "Note", "text"]].map(([f, l, t]) => (
                    <div key={f}>
                      <div style={{ fontSize: 12, color: C.text3, marginBottom: 4 }}>{l}</div>
                      <input type={t} value={ex[f] || ""} onChange={e => updateExam(i, f, e.target.value)} placeholder={l} style={{ ...inputStyle, fontSize: 14 }} />
                    </div>
                  ))}
                </div>
                {days !== null && (
                  <div style={{ marginTop: 12, padding: "8px 12px", borderRadius: 8, background: days < 0 ? C.bg3 : urgent ? `${C.accentOrange}15` : `${C.accentGreen}15`, textAlign: "center", fontSize: 14, fontWeight: 600, color: days < 0 ? C.text3 : urgent ? C.accentOrange : C.accentGreen }}>
                    {days < 0 ? `Vor ${Math.abs(days)} Tagen` : days === 0 ? "Heute!" : `In ${days} Tagen`}
                  </div>
                )}
              </div>
            );
          })}
          <button onClick={addExam} style={{ ...btnGhost, width: "100%", padding: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Icon name="plus" size={16} color={C.text2} /> Klausur hinzufügen
          </button>
        </div>
      )}

      {tab === "timetable" && (
        <div>
          {DAYS.map((day, idx) => (
            <div key={day} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: idx === todayIdx ? C.accent : C.text2, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                {day} {idx === todayIdx && <span style={{ fontSize: 11, background: C.accent, color: "#fff", borderRadius: 6, padding: "2px 8px" }}>Heute</span>}
              </div>
              {(timetable[day] || []).map((slot, i) => (
                <div key={i} style={{ background: C.bg2, borderRadius: 12, padding: "10px 14px", marginBottom: 6, border: `1px solid ${C.border}`, display: "flex", gap: 10 }}>
                  <div style={{ width: 3, borderRadius: 3, background: C.accent, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={slot.fach} onChange={e => { const t = { ...timetable }; t[day] = [...(t[day] || [])]; t[day][i] = { ...t[day][i], fach: e.target.value }; updateData({ ...data, timetable: t }); }} placeholder="Fach" style={{ ...inputStyle, fontWeight: 500, fontSize: 14 }} />
                      <button onClick={() => { const t = { ...timetable }; t[day] = t[day].filter((_, j) => j !== i); updateData({ ...data, timetable: t }); }} style={{ background: "transparent", border: "none", cursor: "pointer" }}><Icon name="trash" size={16} color={C.text3} /></button>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                      <input value={slot.zeit || ""} onChange={e => { const t = { ...timetable }; t[day] = [...(t[day] || [])]; t[day][i] = { ...t[day][i], zeit: e.target.value }; updateData({ ...data, timetable: t }); }} placeholder="08:00–09:30" style={{ ...inputStyle, fontSize: 13 }} />
                      <input value={slot.raum || ""} onChange={e => { const t = { ...timetable }; t[day] = [...(t[day] || [])]; t[day][i] = { ...t[day][i], raum: e.target.value }; updateData({ ...data, timetable: t }); }} placeholder="Raum" style={{ ...inputStyle, fontSize: 13 }} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => { const t = { ...timetable }; t[day] = [...(t[day] || []), { fach: "", zeit: "", raum: "" }]; updateData({ ...data, timetable: t }); }} style={{ ...btnGhost, fontSize: 13, padding: "8px 14px", width: "100%" }}>+ Fach</button>
            </div>
          ))}
        </div>
      )}
    </ScreenWrapper>
  );
}

// ── NUTRITION SCREEN ──────────────────────────────────────────────────────────
function NutritionScreen({ log, updateLog, setScreen }) {
  const n = log.nutrition || getInitialLog().nutrition;
  const setN = (nn) => updateLog({ ...log, nutrition: { ...n, ...nn } });
  const kg = log.weight || USER.gewichtStart;
  const tdee = getTDEE(kg);
  const totalKcal = (n.meals || []).reduce((s, m) => s + Number(m.kcal || 0), 0);
  const kcalLeft = tdee - totalKcal;
  const proteinTarget = Math.round(kg * 2);

  return (
    <ScreenWrapper title="Ernährung" icon="nutrition" iconColor={C.accentGreen} setScreen={setScreen}>
      {/* Kalorienmeter */}
      <div style={{ background: C.bg2, borderRadius: 16, padding: 20, marginBottom: 16, border: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 12, color: C.text3, marginBottom: 4 }}>Heute gegessen</div>
            <div style={{ fontSize: 40, fontWeight: 700, color: C.text, fontVariantNumeric: "tabular-nums" }}>{totalKcal}</div>
            <div style={{ fontSize: 13, color: C.text3 }}>von {tdee} kcal</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, color: kcalLeft >= 0 ? C.accentGreen : C.accentRed, fontWeight: 600 }}>
              {kcalLeft >= 0 ? `${kcalLeft} übrig` : `${Math.abs(kcalLeft)} drüber`}
            </div>
            <div style={{ fontSize: 12, color: C.text3, marginTop: 4 }}>Protein-Ziel: {proteinTarget}g</div>
          </div>
        </div>
        <div style={{ background: C.bg3, borderRadius: 99, height: 6 }}>
          <div style={{ background: totalKcal > tdee ? C.accentRed : C.accentGreen, borderRadius: 99, height: 6, width: `${Math.min(100, (totalKcal / tdee) * 100)}%`, transition: "width 0.5s ease" }} />
        </div>
      </div>

      {/* Mahlzeiten */}
      {(n.meals || []).map((meal, i) => (
        <div key={i} style={{ background: C.bg2, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 12, color: C.text3, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>{meal.name}</div>
          <textarea value={meal.items || ""} onChange={e => { const ms = [...n.meals]; ms[i] = { ...ms[i], items: e.target.value }; setN({ meals: ms }); }} placeholder="Was hast du gegessen?" rows={2}
            style={{ ...inputStyle, resize: "none", marginBottom: 8, lineHeight: 1.5, fontSize: 14 }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="number" value={meal.kcal || ""} onChange={e => { const ms = [...n.meals]; ms[i] = { ...ms[i], kcal: e.target.value }; setN({ meals: ms }); }} placeholder="kcal" style={{ ...inputStyle, width: 100 }} />
            <span style={{ fontSize: 13, color: C.text3 }}>kcal</span>
            <input type="number" value={meal.protein || ""} onChange={e => { const ms = [...n.meals]; ms[i] = { ...ms[i], protein: e.target.value }; setN({ meals: ms }); }} placeholder="Protein" style={{ ...inputStyle, width: 100 }} />
            <span style={{ fontSize: 13, color: C.text3 }}>g</span>
          </div>
        </div>
      ))}

      {/* Wasser */}
      <div style={{ background: C.bg2, borderRadius: 16, padding: 16, marginBottom: 12, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 12, color: C.text3, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>Wasser</div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={() => setN({ water: Math.max(0, (n.water || 0) - 1) })} style={{ ...btnGhost, padding: "8px 16px", fontSize: 20 }}>−</button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", gap: 5 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <div key={i} onClick={() => setN({ water: i + 1 })} style={{ flex: 1, height: 28, borderRadius: 6, background: i < (n.water || 0) ? C.accentTeal : C.bg3, cursor: "pointer", transition: "background 0.15s" }} />
              ))}
            </div>
            <div style={{ textAlign: "center", fontSize: 13, color: C.accentTeal, marginTop: 6, fontWeight: 600 }}>{n.water || 0} / 8 Gläser</div>
          </div>
          <button onClick={() => setN({ water: Math.min(8, (n.water || 0) + 1) })} style={{ ...btnGhost, padding: "8px 16px", fontSize: 20 }}>+</button>
        </div>
      </div>

      {/* Protein */}
      <div style={{ background: C.bg2, borderRadius: 16, padding: 16, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 12, color: C.text3, marginBottom: 8 }}>Protein gesamt (g)</div>
        <input type="number" value={n.protein || ""} onChange={e => setN({ protein: e.target.value })} placeholder={`Ziel: ${proteinTarget}g`} style={{ ...inputStyle, fontSize: 18, fontWeight: 600 }} />
        {n.protein > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ background: C.bg3, borderRadius: 99, height: 5 }}>
              <div style={{ background: n.protein >= proteinTarget ? C.accentGreen : C.accentOrange, borderRadius: 99, height: 5, width: `${Math.min(100, (n.protein / proteinTarget) * 100)}%` }} />
            </div>
            <div style={{ fontSize: 12, color: n.protein >= proteinTarget ? C.accentGreen : C.text3, marginTop: 6 }}>
              {n.protein >= proteinTarget ? "Ziel erreicht!" : `Noch ${proteinTarget - n.protein}g fehlen`}
            </div>
          </div>
        )}
      </div>
    </ScreenWrapper>
  );
}

// ── NOTES SCREEN ──────────────────────────────────────────────────────────────
function NotesScreen({ data, updateData, setScreen }) {
  const [selected, setSelected] = useState(null);
  const [newNote, setNewNote] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "" });
  const notes = data.notes || [];

  function saveNote() {
    if (!draft.title && !draft.body) return;
    if (selected !== null) {
      updateData({ ...data, notes: notes.map((n, i) => i === selected ? { ...draft, updated: new Date().toISOString() } : n) });
    } else {
      updateData({ ...data, notes: [...notes, { ...draft, created: new Date().toISOString(), updated: new Date().toISOString() }] });
    }
    setSelected(null); setNewNote(false); setDraft({ title: "", body: "" });
  }
  function deleteNote(i) { updateData({ ...data, notes: notes.filter((_, j) => j !== i) }); setSelected(null); setNewNote(false); }
  function openNote(i) { setDraft({ title: notes[i].title, body: notes[i].body }); setSelected(i); setNewNote(true); }

  if (newNote) return (
    <ScreenWrapper title={selected !== null ? "Notiz bearbeiten" : "Neue Notiz"} icon="notes" iconColor={C.accentPurple} setScreen={() => { setNewNote(false); setSelected(null); setDraft({ title: "", body: "" }); }}>
      <input value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="Titel" style={{ ...inputStyle, fontSize: 22, fontWeight: 600, marginBottom: 12, background: "transparent", border: "none", borderBottom: `1px solid ${C.border}`, borderRadius: 0, padding: "8px 0" }} />
      <textarea value={draft.body} onChange={e => setDraft(d => ({ ...d, body: e.target.value }))} placeholder="Notiz schreiben…" rows={12}
        style={{ ...inputStyle, resize: "none", fontSize: 16, lineHeight: 1.7, marginBottom: 16 }} autoFocus />
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={saveNote} style={{ ...btnPrimary(C.accentPurple), flex: 1 }}>Speichern</button>
        {selected !== null && <button onClick={() => deleteNote(selected)} style={{ ...btnGhost, color: C.accentRed, borderColor: C.accentRed + "40" }}>Löschen</button>}
      </div>
    </ScreenWrapper>
  );

  return (
    <ScreenWrapper title="Notizen" icon="notes" iconColor={C.accentPurple} setScreen={setScreen}>
      <button onClick={() => { setNewNote(true); setSelected(null); setDraft({ title: "", body: "" }); }} style={{ ...btnPrimary(C.accentPurple), width: "100%", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Icon name="plus" size={16} color="#fff" /> Neue Notiz
      </button>
      {notes.length === 0 && <div style={{ textAlign: "center", color: C.text3, padding: 40, fontSize: 15 }}>Noch keine Notizen.</div>}
      {notes.map((note, i) => (
        <div key={i} onClick={() => openNote(i)} style={{ background: C.bg2, borderRadius: 14, padding: 16, marginBottom: 10, cursor: "pointer", border: `1px solid ${C.border}` }}>
          <div style={{ fontWeight: 600, fontSize: 16, color: C.text, marginBottom: 6 }}>{note.title || "Ohne Titel"}</div>
          <div style={{ fontSize: 14, color: C.text3, lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{note.body}</div>
          <div style={{ fontSize: 11, color: C.text3, marginTop: 8 }}>{note.updated ? new Date(note.updated).toLocaleDateString("de-DE") : ""}</div>
        </div>
      ))}
    </ScreenWrapper>
  );
}

// ── SYNC SCREEN ───────────────────────────────────────────────────────────────
function SyncScreen({ data, updateData, setScreen }) {
  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `dashboard-${getTodayKey()}.json`; a.click(); URL.revokeObjectURL(url);
  }
  function importData(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { try { updateData({ ...INITIAL_DATA, ...JSON.parse(ev.target.result) }); alert("Daten importiert!"); } catch { alert("Fehler beim Importieren."); } };
    reader.readAsText(file);
  }
  return (
    <ScreenWrapper title="Sync" icon="sync" iconColor={C.text2} setScreen={setScreen}>
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ background: C.bg2, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Icon name="download" size={20} color={C.accentGreen} />
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Exportieren</div>
          </div>
          <div style={{ fontSize: 14, color: C.text3, marginBottom: 16, lineHeight: 1.5 }}>Alle Daten als JSON-Datei speichern. Auf einem anderen Gerät importieren um zu synchronisieren.</div>
          <button onClick={exportData} style={{ ...btnPrimary(C.accentGreen), width: "100%" }}>Daten exportieren</button>
        </div>
        <div style={{ background: C.bg2, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <Icon name="upload" size={20} color={C.accent} />
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Importieren</div>
          </div>
          <div style={{ fontSize: 14, color: C.text3, marginBottom: 16, lineHeight: 1.5 }}>Backup-Datei laden und Daten wiederherstellen.</div>
          <label style={{ ...btnPrimary(C.accent), width: "100%", display: "block", textAlign: "center", cursor: "pointer" }}>
            Datei importieren <input type="file" accept=".json" onChange={importData} style={{ display: "none" }} />
          </label>
        </div>
        <div style={{ background: C.bg2, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 14, color: C.text3, lineHeight: 1.8 }}>
            <strong style={{ color: C.text }}>Sync-Ablauf:</strong><br />
            1. Auf Gerät A → Exportieren<br />
            2. Datei per iCloud / Google Drive / WhatsApp teilen<br />
            3. Auf Gerät B → Importieren<br />
            4. Fertig ✓
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
}
