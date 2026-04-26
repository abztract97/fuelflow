import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

const S = {
  bg: "#000",
  surface: "rgba(255,255,255,0.05)",
  surface2: "rgba(255,255,255,0.09)",
  border: "rgba(255,255,255,0.08)",
  border2: "rgba(255,255,255,0.16)",
  text: "#f5f5f7",
  muted: "rgba(245,245,247,0.5)",
  dim: "rgba(245,245,247,0.28)",
  orange: "#ff6b2b",
  green: "#34c759",
  blue: "#0a84ff",
  purple: "#bf5af2",
};

const TARGET = { cal: 2100, protein: 175, carbs: 190, fat: 68 };

const RESTAURANTS = [
  { id: "epl", name: "El Pollo Loco", emoji: "\uD83D\uDD25", color: "#ff6b2b", dist: "0.3mi", items: [
    { name: "Double Chicken Avocado Salad", cal: 450, protein: 50, carbs: 20, fat: 18 },
    { name: "Skinless Chicken + Black Beans", cal: 430, protein: 46, carbs: 32, fat: 10 },
    { name: "Original Pollo Bowl", cal: 500, protein: 38, carbs: 54, fat: 14 },
    { name: "Chicken Avocado Taco x2", cal: 380, protein: 30, carbs: 36, fat: 14 },
  ]},
  { id: "chipotle", name: "Chipotle", emoji: "\uD83C\uDF2F", color: "#34c759", dist: "0.4mi", items: [
    { name: "High Protein-High Fiber Bowl", cal: 540, protein: 46, carbs: 49, fat: 16 },
    { name: "Double Chicken Bowl (light rice)", cal: 620, protein: 62, carbs: 44, fat: 18 },
    { name: "High Protein-Low Calorie Salad", cal: 470, protein: 36, carbs: 38, fat: 20 },
    { name: "Chicken Veggie Burrito Bowl", cal: 500, protein: 40, carbs: 52, fat: 14 },
  ]},
  { id: "panda", name: "Panda Express", emoji: "\uD83D\uDC3C", color: "#0a84ff", dist: "0.5mi", items: [
    { name: "Grilled Teriyaki + Super Greens", cal: 400, protein: 42, carbs: 28, fat: 12 },
    { name: "Teriyaki + Broccoli Beef Plate", cal: 550, protein: 51, carbs: 36, fat: 18 },
    { name: "String Bean Chicken + Super Greens", cal: 300, protein: 26, carbs: 22, fat: 8 },
    { name: "Mushroom Chicken + Brown Rice", cal: 480, protein: 36, carbs: 58, fat: 10 },
  ]},
  { id: "subway", name: "Subway", emoji: "\uD83E\uDD56", color: "#ffd60a", dist: "0.4mi", items: [
    { name: "Rotisserie Chicken Protein Bowl", cal: 260, protein: 28, carbs: 14, fat: 8 },
    { name: "Turkey Breast on Wheat 6in", cal: 280, protein: 18, carbs: 38, fat: 4 },
    { name: "Tuna Protein Bowl no mayo", cal: 300, protein: 26, carbs: 12, fat: 10 },
  ]},
  { id: "taco", name: "Taco Bell", emoji: "\uD83C\uDF2E", color: "#bf5af2", dist: "1.2mi", items: [
    { name: "Chicken Power Bowl no ranch", cal: 470, protein: 27, carbs: 52, fat: 16 },
    { name: "Grilled Chicken Soft Taco x2", cal: 380, protein: 26, carbs: 44, fat: 10 },
    { name: "Cantina Chicken Bowl", cal: 490, protein: 29, carbs: 54, fat: 14 },
  ]},
  { id: "mc", name: "McDonalds", emoji: "\uD83C\uDF5F", color: "#ffd60a", dist: "0.8mi", items: [
    { name: "Grilled Chicken Sandwich", cal: 380, protein: 28, carbs: 44, fat: 8 },
    { name: "Egg McMuffin", cal: 310, protein: 17, carbs: 30, fat: 13 },
    { name: "Side Salad + Grilled Chicken", cal: 250, protein: 24, carbs: 12, fat: 6 },
  ]},
];

const HOTBAR = [
  { id: "coffee", emoji: "\u2615", name: "Black Coffee", cal: 5, protein: 0, carbs: 0, fat: 0 },
  { id: "shake", emoji: "\uD83E\uDD5B", name: "Protein Shake", cal: 150, protein: 25, carbs: 8, fat: 3 },
  { id: "banana", emoji: "\uD83C\uDF4C", name: "Banana", cal: 105, protein: 1, carbs: 27, fat: 0 },
  { id: "eggs", emoji: "\uD83E\uDD5A", name: "2 Eggs", cal: 180, protein: 12, carbs: 2, fat: 12 },
  { id: "apple", emoji: "\uD83C\uDF4E", name: "Apple", cal: 95, protein: 0, carbs: 25, fat: 0 },
  { id: "yogurt", emoji: "\uD83E\uDEFB", name: "Greek Yogurt", cal: 150, protein: 20, carbs: 9, fat: 4 },
];


function Ring(props) {
  var value = props.value;
  var max = props.max;
  var color = props.color;
  var size = props.size || 56;
  var stroke = props.stroke || 4;
  var r = (size - stroke * 2) / 2;
  var circ = 2 * Math.PI * r;
  var pct = Math.min(value / max, 1);
  var half = size / 2;
  var dashArr = (pct * circ) + " " + circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
      <circle cx={half} cy={half} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
      <circle cx={half} cy={half} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round" strokeDasharray={dashArr}
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
    </svg>
  );
}

function CalArc(props) {
  var consumed = props.consumed;
  var target = props.target;
  var pct = Math.min(consumed / target, 1);
  var W = 220;
  var sw = 10;
  var r = (W - sw * 2) / 2;
  var half = Math.PI * r;
  var filled = pct * half;
  var ang = Math.PI * (1 - pct);
  var dotX = (W / 2) + r * Math.cos(ang);
  var dotY = (W / 2) - r * Math.sin(ang);
  var cx = W / 2;
  var cy = W / 2;
  var H = (W / 2) + sw + 4;
  var bgDash = half + " " + (half * 3);
  var fgDash = filled + " " + (half * 3);
  var rotVal = "rotate(180 " + cx + " " + cy + ")";
  return (
    <svg width={W} height={H} style={{ display: "block", margin: "0 auto", overflow: "visible" }}>
      <defs>
        <linearGradient id="og" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ff6b2b" />
          <stop offset="100%" stopColor="#ff9f0a" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.07)"
        strokeWidth={sw} strokeLinecap="round" strokeDasharray={bgDash} transform={rotVal} />
      {pct > 0 && (
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#og)"
          strokeWidth={sw} strokeLinecap="round" strokeDasharray={fgDash} transform={rotVal}
          style={{ transition: "stroke-dasharray 1s ease", filter: "drop-shadow(0 0 10px rgba(255,107,43,.6))" }}
        />
      )}
      {pct > 0 && (
        <circle cx={dotX} cy={dotY} r={6} fill="#ff6b2b"
          style={{ filter: "drop-shadow(0 0 8px #ff6b2b)" }}
        />
      )}
    </svg>
  );
}

function Pill(props) {
  var color = props.color;
  var children = props.children;
  var bg = color + "20";
  var bd = "1px solid " + color + "40";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", borderRadius: 999, fontSize: 11, fontWeight: 700, padding: "3px 10px", background: bg, color: color, border: bd }}>
      {children}
    </span>
  );
}

function MacroRow(props) {
  return (
    <div style={{ display: "flex", gap: 8, fontSize: 11, flexWrap: "wrap" }}>
      <span style={{ color: S.orange, fontWeight: 600 }}>{props.cal} cal</span>
      <span style={{ color: S.green, fontWeight: 600 }}>{props.protein}g P</span>
      <span style={{ color: S.blue, fontWeight: 600 }}>{props.carbs}g C</span>
      <span style={{ color: S.purple, fontWeight: 600 }}>{props.fat}g F</span>
    </div>
  );
}

function LogBtn(props) {
  return (
    <button onClick={props.onClick} style={{ background: S.surface2, border: "1px solid " + S.border2, color: S.muted, borderRadius: 999, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", flexShrink: 0 }}>
      {props.label || "Log"}
    </button>
  );
}

function GhostBtn(props) {
  return (
    <button onClick={props.onClick} disabled={props.disabled} style={{ background: S.surface, border: "1px solid " + S.border, color: S.muted, borderRadius: 999, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flex: 1, opacity: props.disabled ? 0.35 : 1 }}>
      {props.children}
    </button>
  );
}

function Card(props) {
  return (
    <div style={{ background: S.surface, border: "1px solid " + S.border, borderRadius: 22, padding: "22px 20px", marginTop: 12 }}>
      {props.children}
    </div>
  );
}

function SectionTitle(props) {
  return (
    <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.02em", marginBottom: props.mb || 18 }}>
      {props.children}
    </div>
  );
}

function ManualEntry(props) {
  var onLog = props.onLog;
  var [name, setName] = useState("");
  var [cal, setCal] = useState("");
  var [protein, setProtein] = useState("");
  var [carbs, setCarbs] = useState("");
  var [fat, setFat] = useState("");
  var [err, setErr] = useState("");
  var inp = { width: "100%", background: S.surface, border: "1px solid " + S.border, borderRadius: 12, padding: "11px 14px", color: S.text, fontFamily: "inherit", fontSize: 14, outline: "none", boxSizing: "border-box" };
  function submit() {
    if (!name || !cal) { setErr("Name and calories required."); return; }
    onLog({ id: "m" + Date.now(), name: name, cal: parseInt(cal)||0, protein: parseInt(protein)||0, carbs: parseInt(carbs)||0, fat: parseInt(fat)||0 });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <input style={inp} placeholder="Food name" value={name} onChange={function(e) { setName(e.target.value); }} autoFocus />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <input style={inp} placeholder="Calories" type="number" value={cal} onChange={function(e) { setCal(e.target.value); }} />
        <input style={inp} placeholder="Protein g" type="number" value={protein} onChange={function(e) { setProtein(e.target.value); }} />
        <input style={inp} placeholder="Carbs g" type="number" value={carbs} onChange={function(e) { setCarbs(e.target.value); }} />
        <input style={inp} placeholder="Fat g" type="number" value={fat} onChange={function(e) { setFat(e.target.value); }} />
      </div>
      {err && <div style={{ fontSize: 12, color: S.orange }}>{err}</div>}
      <button onClick={submit} style={{ width: "100%", background: S.text, border: "none", color: "#000", borderRadius: 14, padding: 13, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        Log Food
      </button>
    </div>
  );
}

function SearchResultRow(props) {
  var item = props.item;
  var onLog = props.onLog;
  var [qty, setQty] = useState(1);
  var qtyBtnStyle = { background: S.surface2, border: "1px solid " + S.border2, color: S.text, borderRadius: 6, width: 26, height: 26, fontSize: 16, lineHeight: "26px", textAlign: "center", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 };
  return (
    <div style={{ padding: "13px 0", borderBottom: "1px solid " + S.border }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, lineHeight: 1.35 }}>{item.name}</div>
          <div style={{ fontSize: 11, color: S.dim }}>per {item.serving}</div>
        </div>
        <LogBtn label="+ Add" onClick={function() {
          onLog({ name: item.name, cal: Math.round(item.cal * qty), protein: Math.round(item.protein * qty), carbs: Math.round(item.carbs * qty), fat: Math.round(item.fat * qty) });
        }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <MacroRow cal={Math.round(item.cal * qty)} protein={Math.round(item.protein * qty)} carbs={Math.round(item.carbs * qty)} fat={Math.round(item.fat * qty)} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button style={qtyBtnStyle} onClick={function() { setQty(function(q) { return Math.max(1, q - 1); }); }}>−</button>
          <span style={{ fontSize: 13, fontWeight: 700, minWidth: 16, textAlign: "center" }}>{qty}</span>
          <button style={qtyBtnStyle} onClick={function() { setQty(function(q) { return q + 1; }); }}>+</button>
        </div>
      </div>
    </div>
  );
}

function MovementTab() {
  var [steps, setSteps] = useState(0);
  var [permState, setPermState] = useState("idle");
  var stepRef = useRef({ lastTime: 0, peaking: false });
  var STEP_GOAL = 10000;

  useEffect(function() {
    if (typeof DeviceMotionEvent === "undefined") { setPermState("unavailable"); return; }
    if (typeof DeviceMotionEvent.requestPermission !== "function") {
      setPermState("listening");
    }
  }, []);

  useEffect(function() {
    if (permState !== "listening") return;
    function handleMotion(e) {
      var acc = e.accelerationIncludingGravity;
      if (!acc) return;
      var mag = Math.sqrt((acc.x||0)*(acc.x||0) + (acc.y||0)*(acc.y||0) + (acc.z||0)*(acc.z||0));
      var now = Date.now();
      var r = stepRef.current;
      if (!r.peaking && mag > 12 && now - r.lastTime > 300) {
        r.peaking = true;
      } else if (r.peaking && mag < 10) {
        r.peaking = false;
        r.lastTime = now;
        setSteps(function(s) { return s + 1; });
      }
    }
    window.addEventListener("devicemotion", handleMotion);
    return function() { window.removeEventListener("devicemotion", handleMotion); };
  }, [permState]);

  async function requestPermission() {
    try {
      var result = await DeviceMotionEvent.requestPermission();
      setPermState(result === "granted" ? "listening" : "denied");
    } catch(e) { setPermState("denied"); }
  }

  var calBurned = Math.round(steps * 0.04);
  var distance = (steps * 0.000473).toFixed(2);
  var activeMins = Math.round(steps / 100);
  var ringSize = 200;
  var ringStroke = 12;

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16 }}>
        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
          <Ring value={steps} max={STEP_GOAL} color={S.orange} size={ringSize} stroke={ringStroke} />
          <div style={{ position: "absolute", textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-.03em", color: S.orange }}>{steps.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: S.muted, fontWeight: 600 }}>steps</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: S.dim }}>
          {steps.toLocaleString()} / {STEP_GOAL.toLocaleString()} goal
          {steps >= STEP_GOAL && <span style={{ color: S.orange, fontWeight: 700, marginLeft: 8 }}>Goal reached!</span>}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", paddingTop: 20, borderTop: "1px solid " + S.border, width: "100%" }}>
        {[
          { label: "Cal Burned", val: calBurned, unit: "kcal", color: S.orange },
          { label: "Distance", val: distance, unit: "mi", color: S.blue },
          { label: "Active", val: activeMins, unit: "min", color: S.green },
        ].map(function(stat) {
          return (
            <div key={stat.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, letterSpacing: "-.02em" }}>{stat.val}</div>
              <div style={{ fontSize: 11, color: S.dim, marginTop: 1 }}>{stat.unit}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: S.muted, marginTop: 2 }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {permState === "idle" && typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function" && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ fontSize: 13, color: S.muted, marginBottom: 12 }}>Enable motion tracking to count steps</div>
          <button onClick={requestPermission} style={{ background: S.orange, border: "none", color: "#fff", borderRadius: 14, padding: "11px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Enable Motion Tracking
          </button>
        </div>
      )}
      {permState === "denied" && (
        <div style={{ fontSize: 13, color: S.dim, textAlign: "center", marginTop: 20 }}>Motion access denied. Enable it in Settings to count steps.</div>
      )}
      {permState === "unavailable" && (
        <div style={{ fontSize: 13, color: S.dim, textAlign: "center", marginTop: 20 }}>Step counting requires a mobile device with a motion sensor.</div>
      )}
    </div>
  );
}

export default function FuelFlow() {
  var [heroPage, setHeroPage] = useState(0);
  var heroInnerRef = useRef(null);
  var heroDragRef = useRef({ startX: 0, dragging: false, dx: 0, isHoriz: null });
  var [consumed, setConsumed] = useState({ cal: 0, protein: 0, carbs: 0, fat: 0 });
  var [history, setHistory] = useState([]);
  var [loading, setLoading] = useState(true);
  var [ffMode, setFfMode] = useState("best");
  var [selR, setSelR] = useState(null);
  var [logMode, setLogMode] = useState(null);
  var [query, setQuery] = useState("");
  var [searchResults, setSearchResults] = useState([]);
  var [searchLoading, setSearchLoading] = useState(false);
  var [toast, setToast] = useState(null);

  // Load today's logs from Supabase on mount
  useEffect(function() {
    async function loadToday() {
      var startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      var { data, error } = await supabase
        .from("food_logs")
        .select("*")
        .gte("logged_at", startOfDay.toISOString())
        .order("logged_at", { ascending: false });

      if (!error && data) {
        var totals = data.reduce(function(acc, row) {
          return {
            cal: acc.cal + (row.cal || 0),
            protein: acc.protein + (row.protein || 0),
            carbs: acc.carbs + (row.carbs || 0),
            fat: acc.fat + (row.fat || 0),
          };
        }, { cal: 0, protein: 0, carbs: 0, fat: 0 });

        setConsumed(totals);
        setHistory(data.slice(0, 10).map(function(row) {
          return { dbId: row.id, name: row.name, cal: row.cal, protein: row.protein, carbs: row.carbs, fat: row.fat };
        }));
      }
      setLoading(false);
    }
    loadToday();
  }, []);

  useEffect(function() {
    if (query.length < 2) { setSearchResults([]); return; }
    var cancelled = false;
    var timer = setTimeout(async function() {
      setSearchLoading(true);
      try {
        var apiKey = import.meta.env.VITE_USDA_API_KEY;
        var url = "https://api.nal.usda.gov/fdc/v1/foods/search?query=" + encodeURIComponent(query) + "&api_key=" + apiKey + "&pageSize=20&dataType=SR%20Legacy,Foundation,Branded";
        var res = await fetch(url);
        var json = await res.json();
        console.log("USDA raw response:", json);
        if (cancelled) return;
        var results = (json.foods || []).map(function(p) {
          var n = {};
          (p.foodNutrients || []).forEach(function(fn) { n[fn.nutrientId] = fn.value; });
          var unitMap = { GRM: "g", MLT: "ml", LBR: "lb", OZ: "oz", MGM: "mg", KJO: "kJ", ONZ: "oz", GCAL: "kcal" };
          var rawUnit = (p.servingSizeUnit || "g").toUpperCase().trim();
          var unit = unitMap[rawUnit] || rawUnit.toLowerCase();
          var serving = p.servingSize ? Math.round(p.servingSize) + unit : "100g";
          var desc = p.description
            ? p.description.charAt(0).toUpperCase() + p.description.slice(1).toLowerCase()
            : "";
          var brand = p.brandName || p.brandOwner || "";
          var name = brand ? desc + " — " + brand : desc;
          var priority = p.dataType === "SR Legacy" ? 0 : p.dataType === "Foundation" ? 1 : 2;
          return {
            name: name,
            serving: serving,
            cal: Math.round(n[1008] || 0),
            protein: Math.round(n[1003] || 0),
            carbs: Math.round(n[1005] || 0),
            fat: Math.round(n[1004] || 0),
            priority: priority,
          };
        })
        .sort(function(a, b) { return a.priority - b.priority; })
        .slice(0, 8)
        .map(function(r) { delete r.priority; return r; });
        console.log("Parsed results:", results);
        setSearchResults(results);
      } catch (e) {
        console.error("Search error:", e);
        if (!cancelled) setSearchResults([]);
      }
      if (!cancelled) setSearchLoading(false);
    }, 400);
    return function() { cancelled = true; clearTimeout(timer); };
  }, [query]);

  var calLeft = Math.max(0, TARGET.cal - consumed.cal);
  var proteinLeft = Math.max(0, TARGET.protein - consumed.protein);

  function showToast(msg) {
    setToast(msg);
    setTimeout(function() { setToast(null); }, 2600);
  }

  async function logItem(item) {
    var { data, error } = await supabase
      .from("food_logs")
      .insert({
        name: item.name,
        cal: item.cal || 0,
        protein: item.protein || 0,
        carbs: item.carbs || 0,
        fat: item.fat || 0,
      })
      .select()
      .single();

    if (error) {
      showToast("Save failed: " + error.message);
      return;
    }

    var saved = { dbId: data.id, name: data.name, cal: data.cal, protein: data.protein, carbs: data.carbs, fat: data.fat };
    setHistory(function(h) { return [saved].concat(h).slice(0, 10); });
    setConsumed(function(c) {
      return { cal: c.cal + data.cal, protein: c.protein + data.protein, carbs: c.carbs + data.carbs, fat: c.fat + data.fat };
    });
    showToast("Logged " + data.name + " — +" + data.cal + " cal");
    setLogMode(null);
    setQuery("");
  }

  async function undo() {
    if (!history.length) return;
    var last = history[0];

    if (last.dbId) {
      await supabase.from("food_logs").delete().eq("id", last.dbId);
    }

    setHistory(function(h) { return h.slice(1); });
    setConsumed(function(c) {
      return { cal: Math.max(0, c.cal - last.cal), protein: Math.max(0, c.protein - (last.protein||0)), carbs: Math.max(0, c.carbs - (last.carbs||0)), fat: Math.max(0, c.fat - (last.fat||0)) };
    });
    showToast("Removed " + last.name);
  }

  var allItems = [];
  for (var ri = 0; ri < RESTAURANTS.length; ri++) {
    var rest = RESTAURANTS[ri];
    for (var ii = 0; ii < rest.items.length; ii++) {
      var it = rest.items[ii];
      allItems.push({ name: it.name, cal: it.cal, protein: it.protein, carbs: it.carbs, fat: it.fat, id: rest.id + it.name, restaurant: rest.name, rColor: rest.color, score: it.protein * 3 - Math.abs(it.cal - calLeft * 0.65) * 0.04 });
    }
  }
  allItems.sort(function(a, b) { return b.score - a.score; });
  var bestMatches = allItems.slice(0, 3);
  var selRestaurant = null;
  for (var ri2 = 0; ri2 < RESTAURANTS.length; ri2++) {
    if (RESTAURANTS[ri2].id === selR) { selRestaurant = RESTAURANTS[ri2]; break; }
  }

  var macros = [
    { label: "Protein", val: consumed.protein, target: TARGET.protein, color: S.green },
    { label: "Carbs", val: consumed.carbs, target: TARGET.carbs, color: S.blue },
    { label: "Fat", val: consumed.fat, target: TARGET.fat, color: S.purple },
  ];


  useEffect(function() {
    var el = heroInnerRef.current;
    if (!el || !el.parentElement) return;
    var w = el.parentElement.offsetWidth;
    el.style.transition = "transform 0.35s cubic-bezier(0.4,0,0.2,1)";
    el.style.transform = "translateX(" + (-heroPage * w) + "px)";
  }, [heroPage]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontSize: 14, color: S.dim }}>Loading...</div>
      </div>
    );
  }

  function heroSnap(page) {
    var el = heroInnerRef.current;
    if (!el || !el.parentElement) return;
    var w = el.parentElement.offsetWidth;
    el.style.transition = "transform 0.35s cubic-bezier(0.4,0,0.2,1)";
    el.style.transform = "translateX(" + (-page * w) + "px)";
  }
  function heroDragStart(clientX) {
    heroDragRef.current = { startX: clientX, dragging: true, dx: 0, isHoriz: null };
  }
  function heroDragMove(clientX, clientY) {
    var d = heroDragRef.current;
    if (!d.dragging) return;
    var dx = clientX - d.startX;
    if (d.isHoriz === null) {
      var dy = clientY - (d.startY || clientY);
      d.isHoriz = Math.abs(dx) > Math.abs(dy);
    }
    if (!d.isHoriz) return;
    d.dx = dx;
    var el = heroInnerRef.current;
    if (el && el.parentElement) {
      var w = el.parentElement.offsetWidth;
      var clamped = Math.max(Math.min(dx, w * 0.5), -w * 0.5);
      el.style.transition = "none";
      el.style.transform = "translateX(" + (-heroPage * w + clamped) + "px)";
    }
  }
  function heroDragEnd() {
    var d = heroDragRef.current;
    if (!d.dragging) return;
    d.dragging = false;
    var newPage = heroPage;
    if (d.dx < -50 && heroPage < 1) newPage = 1;
    else if (d.dx > 50 && heroPage > 0) newPage = 0;
    heroSnap(newPage);
    if (newPage !== heroPage) setHeroPage(newPage);
  }

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif", color: S.text }}>
      <div style={{ maxWidth: 430, margin: "0 auto", padding: "0 14px 80px" }}>

        <div style={{ padding: "48px 8px 0" }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".09em", color: S.dim, textTransform: "uppercase", marginBottom: 6 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1.2, marginBottom: 14 }}>
            Good afternoon, Francisco.
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Pill color={S.orange}>Body Recomposition</Pill>
            <Pill color={S.muted}>175 lbs - 6ft - 28</Pill>
          </div>
        </div>

        <Card>
          <div
            style={{ overflow: "hidden", touchAction: "pan-y", userSelect: "none" }}
            onTouchStart={function(e) { var t = e.touches[0]; heroDragRef.current.startY = t.clientY; heroDragStart(t.clientX); }}
            onTouchMove={function(e) { heroDragMove(e.touches[0].clientX, e.touches[0].clientY); }}
            onTouchEnd={heroDragEnd}
            onMouseDown={function(e) { heroDragRef.current.startY = e.clientY; heroDragStart(e.clientX); }}
            onMouseMove={function(e) { heroDragMove(e.clientX, e.clientY); }}
            onMouseUp={heroDragEnd}
            onMouseLeave={heroDragEnd}
          >
            <div ref={heroInnerRef} style={{ display: "flex", width: "200%", willChange: "transform" }}>
              <div style={{ width: "50%", flexShrink: 0, boxSizing: "border-box" }}>
                <div style={{ textAlign: "center", position: "relative" }}>
                  <CalArc consumed={consumed.cal} target={TARGET.cal} />
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-.04em", color: S.orange }}>{consumed.cal}</div>
                    <div style={{ fontSize: 13, color: S.muted, marginTop: 4 }}>
                      of {TARGET.cal} cal
                      <span style={{ color: S.orange, fontWeight: 600, marginLeft: 8 }}>{calLeft} left</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: 20, paddingTop: 20, borderTop: "1px solid " + S.border }}>
                  {macros.map(function(m) {
                    return (
                      <div key={m.label} style={{ textAlign: "center" }}>
                        <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 6 }}>
                          <Ring value={m.val} max={m.target} color={m.color} />
                          <div style={{ position: "absolute", fontSize: 11, fontWeight: 700, color: m.color }}>{m.val}g</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: S.muted }}>{m.label}</div>
                        <div style={{ fontSize: 10, color: S.dim, marginTop: 1 }}>{m.target}g goal</div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
                  <GhostBtn onClick={undo} disabled={!history.length}>Undo</GhostBtn>
                  <GhostBtn onClick={async function() {
                    var startOfDay = new Date();
                    startOfDay.setHours(0, 0, 0, 0);
                    await supabase.from("food_logs").delete().gte("logged_at", startOfDay.toISOString());
                    setConsumed({ cal: 0, protein: 0, carbs: 0, fat: 0 });
                    setHistory([]);
                    showToast("Day reset");
                  }}>Reset day</GhostBtn>
                </div>
              </div>
              <div style={{ width: "50%", flexShrink: 0, boxSizing: "border-box" }}>
                <MovementTab />
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 16 }}>
            {[0, 1].map(function(i) {
              return (
                <div key={i} onClick={function() { setHeroPage(i); }} style={{ width: heroPage === i ? 18 : 6, height: 6, borderRadius: 999, background: heroPage === i ? S.orange : S.dim, transition: "all 0.25s ease", cursor: "pointer" }} />
              );
            })}
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18 }}>
            <SectionTitle mb={0}>Log Food</SectionTitle>
            {logMode && (
              <button onClick={function() { setLogMode(null); setQuery(""); }} style={{ background: "none", border: "none", color: S.dim, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                Cancel
              </button>
            )}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: S.dim, marginBottom: 12 }}>
            Frequently eaten
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 18 }}>
            {HOTBAR.map(function(item) {
              return (
                <button key={item.id} onClick={function() { logItem(item); }} style={{ flexShrink: 0, background: S.surface, border: "1px solid " + S.border, borderRadius: 14, padding: "10px 12px", cursor: "pointer", textAlign: "center", minWidth: 68, fontFamily: "inherit" }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{item.emoji}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: S.muted, lineHeight: 1.3, marginBottom: 3 }}>
                    {item.name.length > 9 ? item.name.slice(0, 9) + "..." : item.name}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: S.orange }}>{item.cal}c</div>
                </button>
              );
            })}
          </div>
          {!logMode && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <button onClick={function() { setLogMode("search"); }} style={{ background: S.surface, border: "1px solid " + S.border, borderRadius: 12, padding: "12px 8px", cursor: "pointer", fontFamily: "inherit", color: S.muted, fontSize: 12, fontWeight: 600 }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>&#128269;</div>Search
              </button>
              <button onClick={function() { setLogMode("manual"); }} style={{ background: S.surface, border: "1px solid " + S.border, borderRadius: 12, padding: "12px 8px", cursor: "pointer", fontFamily: "inherit", color: S.muted, fontSize: 12, fontWeight: 600 }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>&#9999;</div>Manual
              </button>
              <button onClick={function() { setLogMode("scan"); }} style={{ background: S.surface, border: "1px solid " + S.border, borderRadius: 12, padding: "12px 8px", cursor: "pointer", fontFamily: "inherit", color: S.muted, fontSize: 12, fontWeight: 600 }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>&#128248;</div>Scan
              </button>
            </div>
          )}
          {logMode === "search" && (
            <div>
              <input style={{ width: "100%", background: S.surface, border: "1px solid " + S.border, borderRadius: 12, padding: "11px 14px", color: S.text, fontFamily: "inherit", fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 8 }} placeholder="Search food..." value={query} onChange={function(e) { setQuery(e.target.value); }} autoFocus />
              {query.length < 2 && (
                <div style={{ fontSize: 13, color: S.dim, textAlign: "center", padding: "18px 0" }}>Type to search...</div>
              )}
              {query.length >= 2 && searchLoading && (
                <div style={{ fontSize: 13, color: S.dim, textAlign: "center", padding: "18px 0" }}>Searching...</div>
              )}
              {query.length >= 2 && !searchLoading && searchResults.length === 0 && (
                <div style={{ fontSize: 13, color: S.dim, textAlign: "center", padding: "18px 0" }}>No results found</div>
              )}
              {searchResults.map(function(item, i) {
                return <SearchResultRow key={i} item={item} onLog={logItem} />;
              })}
            </div>
          )}
          {logMode === "manual" && <ManualEntry onLog={logItem} />}
          {logMode === "scan" && (
            <div style={{ textAlign: "center", padding: "24px 0", color: S.muted, fontSize: 14 }}>
              Camera scanner coming soon
            </div>
          )}
        </Card>

        <Card>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
            <SectionTitle mb={0}>Eat Nearby</SectionTitle>
            <div style={{ fontSize: 12, color: S.dim }}>Watsonville, CA</div>
          </div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 3, gap: 3, marginBottom: 20 }}>
            <button onClick={function() { setFfMode("best"); setSelR(null); }} style={{ flex: 1, padding: "9px 10px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, background: ffMode === "best" ? "rgba(255,255,255,0.1)" : "transparent", color: ffMode === "best" ? S.text : S.dim }}>
              Best match
            </button>
            <button onClick={function() { setFfMode("pick"); setSelR(null); }} style={{ flex: 1, padding: "9px 10px", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, background: ffMode === "pick" ? "rgba(255,255,255,0.1)" : "transparent", color: ffMode === "pick" ? S.text : S.dim }}>
              Pick restaurant
            </button>
          </div>
          {ffMode === "best" && (
            <div>
              <div style={{ fontSize: 12, color: S.dim, marginBottom: 16, lineHeight: 1.7 }}>
                Top picks for <span style={{ color: S.orange, fontWeight: 700 }}>{calLeft} cal</span> and <span style={{ color: S.green, fontWeight: 700 }}>{proteinLeft}g protein</span> remaining
              </div>
              {bestMatches.map(function(item, i) {
                return (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < 2 ? "1px solid " + S.border : "none", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, flexWrap: "wrap" }}>
                        <Pill color={item.rColor}>{item.restaurant}</Pill>
                        {i === 0 && <Pill color={S.orange}>Top pick</Pill>}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                      <MacroRow cal={item.cal} protein={item.protein} carbs={item.carbs} fat={item.fat} />
                    </div>
                    <LogBtn onClick={function() { logItem(Object.assign({}, item)); }} />
                  </div>
                );
              })}
            </div>
          )}
          {ffMode === "pick" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                {RESTAURANTS.map(function(r) {
                  var isSelected = selR === r.id;
                  return (
                    <button key={r.id} onClick={function() { setSelR(isSelected ? null : r.id); }} style={{ background: isSelected ? r.color + "20" : S.surface, border: "1px solid " + (isSelected ? r.color + "50" : S.border), borderRadius: 14, padding: "12px 8px", textAlign: "center", cursor: "pointer", fontFamily: "inherit" }}>
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{r.emoji}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: isSelected ? r.color : S.muted, lineHeight: 1.3, marginBottom: 2 }}>{r.name}</div>
                      <div style={{ fontSize: 9, color: S.dim }}>{r.dist}</div>
                    </button>
                  );
                })}
              </div>
              {!selRestaurant && (
                <div style={{ textAlign: "center", padding: "16px 0", fontSize: 13, color: S.dim }}>
                  Tap a restaurant to see what to order
                </div>
              )}
              {selRestaurant && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase", color: S.dim, marginBottom: 12 }}>
                    Best at {selRestaurant.name}
                  </div>
                  {selRestaurant.items.map(function(item, i) {
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < selRestaurant.items.length - 1 ? "1px solid " + S.border : "none", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5, flexWrap: "wrap" }}>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                            {i === 0 && <Pill color={selRestaurant.color}>Top pick</Pill>}
                          </div>
                          <MacroRow cal={item.cal} protein={item.protein} carbs={item.carbs} fat={item.fat} />
                        </div>
                        <LogBtn onClick={function() { logItem(Object.assign({}, item, { id: selRestaurant.id + item.name })); }} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle>Meal Prep</SectionTitle>
          {[
            { name: "Chicken Rice Bowls", time: "35m", servings: 4, cal: 480, protein: 52, carbs: 48, fat: 12 },
            { name: "Turkey Egg Scramble", time: "15m", servings: 2, cal: 380, protein: 45, carbs: 12, fat: 18 },
            { name: "Greek Yogurt Parfait", time: "5m", servings: 1, cal: 320, protein: 30, carbs: 44, fat: 6 },
          ].map(function(item, i) {
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 0", borderBottom: i < 2 ? "1px solid " + S.border : "none", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: S.dim, marginBottom: 4 }}>{item.time} - {item.servings} servings</div>
                  <MacroRow cal={item.cal} protein={item.protein} carbs={item.carbs} fat={item.fat} />
                </div>
                <LogBtn label="+ Add" onClick={function() { logItem(Object.assign({}, item, { id: "meal" + item.name })); }} />
              </div>
            );
          })}
        </Card>

      </div>
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "rgba(28,28,30,0.95)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "12px 20px", fontSize: 13, fontWeight: 500, color: S.text, whiteSpace: "nowrap", zIndex: 999, boxShadow: "0 8px 32px rgba(0,0,0,.6)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
