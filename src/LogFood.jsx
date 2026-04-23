import { useRef, useState } from "react";

const DEFAULT_HOTBAR = [
  { id: "coffee", emoji: "☕", name: "Black Coffee", cal: 5, protein: 0, carbs: 0, fat: 0 },
  { id: "proteinshake", emoji: "🥛", name: "Protein Shake", cal: 150, protein: 25, carbs: 8, fat: 3 },
  { id: "banana", emoji: "🍌", name: "Banana", cal: 105, protein: 1, carbs: 27, fat: 0 },
  { id: "eggs2", emoji: "🥚", name: "2 Scrambled Eggs", cal: 180, protein: 12, carbs: 2, fat: 12 },
  { id: "apple", emoji: "🍎", name: "Apple", cal: 95, protein: 0, carbs: 25, fat: 0 },
  { id: "yogurt", emoji: "🫙", name: "Greek Yogurt (1 cup)", cal: 150, protein: 20, carbs: 9, fat: 4 },
  { id: "cheese", emoji: "🧀", name: "String Cheese", cal: 80, protein: 7, carbs: 1, fat: 5 },
  { id: "rice", emoji: "🍚", name: "White Rice (1 cup)", cal: 206, protein: 4, carbs: 45, fat: 0 },
  { id: "tortilla", emoji: "🫓", name: "Flour Tortilla", cal: 146, protein: 4, carbs: 26, fat: 3 },
  { id: "jerky", emoji: "🥩", name: "Beef Jerky (1oz)", cal: 80, protein: 9, carbs: 5, fat: 1 },
  { id: "almonds", emoji: "🌰", name: "Almonds (1oz)", cal: 164, protein: 6, carbs: 6, fat: 14 },
  { id: "cottage", emoji: "🥗", name: "Cottage Cheese (1c)", cal: 206, protein: 25, carbs: 8, fat: 9 },
];

const FOOD_DB = [
  { id: "f1", emoji: "🍗", name: "Grilled Chicken Breast (6oz)", cal: 280, protein: 53, carbs: 0, fat: 6 },
  { id: "f2", emoji: "🥑", name: "Avocado (half)", cal: 120, protein: 1, carbs: 6, fat: 11 },
  { id: "f3", emoji: "🥦", name: "Broccoli (1 cup)", cal: 55, protein: 4, carbs: 11, fat: 0 },
  { id: "f4", emoji: "🍠", name: "Sweet Potato (medium)", cal: 130, protein: 3, carbs: 30, fat: 0 },
  { id: "f5", emoji: "🐟", name: "Tuna (1 can)", cal: 100, protein: 22, carbs: 0, fat: 1 },
  { id: "f6", emoji: "🥜", name: "Peanut Butter (2 tbsp)", cal: 190, protein: 7, carbs: 7, fat: 16 },
  { id: "f7", emoji: "🫘", name: "Black Beans (1 cup)", cal: 227, protein: 15, carbs: 41, fat: 1 },
  { id: "f8", emoji: "🍳", name: "Egg (whole)", cal: 78, protein: 6, carbs: 1, fat: 5 },
  { id: "f9", emoji: "🥤", name: "Fairlife Protein Shake", cal: 150, protein: 30, carbs: 6, fat: 2 },
  { id: "f10", emoji: "🍫", name: "Chocolate Protein Bar", cal: 200, protein: 20, carbs: 24, fat: 6 },
  { id: "f11", emoji: "🥛", name: "Whole Milk (1 cup)", cal: 149, protein: 8, carbs: 12, fat: 8 },
  { id: "f12", emoji: "🫐", name: "Blueberries (1 cup)", cal: 84, protein: 1, carbs: 21, fat: 0 },
  { id: "f13", emoji: "🍞", name: "Whole Wheat Bread (slice)", cal: 80, protein: 4, carbs: 15, fat: 1 },
  { id: "f14", emoji: "🧇", name: "Oatmeal (1 cup cooked)", cal: 158, protein: 6, carbs: 27, fat: 3 },
  { id: "f15", emoji: "🥩", name: "Skirt Steak (6oz grilled)", cal: 320, protein: 44, carbs: 0, fat: 14 },
  ...DEFAULT_HOTBAR,
];

function Toast({ item }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 90,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#0a1a0a",
        border: "1px solid rgba(74, 222, 128, 0.38)",
        borderRadius: 16,
        padding: "12px 20px",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        minWidth: 260,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          background: "rgba(74, 222, 128, 0.14)",
          border: "1px solid rgba(74, 222, 128, 0.38)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color: "#4ade80",
          fontWeight: 900,
        }}
      >
        ✓
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: "#4ade80" }}>Logged!</div>
        <div style={{ fontSize: 12, color: "rgba(226,232,240,0.55)" }}>
          {item.name} — {item.cal} cal · {item.protein}g protein
        </div>
      </div>
    </div>
  );
}

function MacroBadge({ cal, protein, carbs, fat }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
      {[
        { label: "cal", val: cal, color: "#f97316" },
        { label: "protein", val: protein, color: "#4ade80" },
        { label: "carbs", val: carbs, color: "#60a5fa" },
        { label: "fat", val: fat, color: "#c084fc" },
      ].map((m) => (
        <span
          key={m.label}
          style={{
            background: `${m.color}15`,
            border: `1px solid ${m.color}30`,
            color: m.color,
            borderRadius: 999,
            padding: "2px 10px",
            fontSize: 11,
            fontWeight: 900,
          }}
        >
          {m.val} {m.label}
        </span>
      ))}
    </div>
  );
}

export default function LogFood({ onLog }) {
  const [mode, setMode] = useState(null); // null | "search" | "manual"
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null);
  const [frequencies, setFreq] = useState({});
  const [manualForm, setManual] = useState({ name: "", cal: "", protein: "", carbs: "", fat: "" });
  const [manualError, setManErr] = useState("");
  const searchRef = useRef(null);

  const hotbar = [...DEFAULT_HOTBAR]
    .sort((a, b) => (frequencies[b.id] || 0) - (frequencies[a.id] || 0))
    .slice(0, 6);

  const q = query.trim().toLowerCase();
  const searchResults = q.length >= 2 ? FOOD_DB.filter((f) => f.name.toLowerCase().includes(q)).slice(0, 6) : [];

  const inputBaseStyle = {
    width: "100%",
    background: "#0d0d1a",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#f0f0f0",
    fontFamily: "inherit",
    fontSize: 14,
    outline: "none",
  };

  const handleLog = (item) => {
    setFreq((prev) => ({ ...prev, [item.id || item.name]: (prev[item.id || item.name] || 0) + 1 }));
    setToast(item);
    window.setTimeout(() => setToast(null), 2500);
    if (onLog) onLog(item);
    setMode(null);
    setQuery("");
    setManual({ name: "", cal: "", protein: "", carbs: "", fat: "" });
  };

  const handleManualSubmit = () => {
    if (!manualForm.name || !manualForm.cal) {
      setManErr("Name and calories are required.");
      return;
    }
    setManErr("");
    handleLog({
      id: `manual-${Date.now()}`,
      name: manualForm.name,
      emoji: "✏️",
      cal: parseInt(manualForm.cal, 10) || 0,
      protein: parseInt(manualForm.protein, 10) || 0,
      carbs: parseInt(manualForm.carbs, 10) || 0,
      fat: parseInt(manualForm.fat, 10) || 0,
    });
  };

  return (
    <>
      <div
        style={{
          background: "rgba(13, 15, 23, 0.72)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 20,
          padding: 18,
          marginBottom: 14,
          boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12 }}>
          <div>
            <div style={{ fontWeight: 950, fontSize: 16, marginBottom: 2, color: "#e2e8f0" }}>➕ Log Food</div>
            <div style={{ fontSize: 12, color: "rgba(226,232,240,0.55)", fontWeight: 800 }}>Tap to instantly add to today</div>
          </div>
          {mode && (
            <button
              onClick={() => {
                setMode(null);
                setQuery("");
                setManErr("");
              }}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 999,
                padding: "6px 12px",
                color: "rgba(226,232,240,0.55)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: 900,
              }}
            >
              ✕ Close
            </button>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: "rgba(226,232,240,0.35)", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 10 }}>
            Frequently eaten
          </div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {hotbar.map((item) => (
              <button
                key={item.id}
                onClick={() => handleLog(item)}
                title={`${item.name} — ${item.cal} cal`}
                style={{
                  flexShrink: 0,
                  background: "#0d0d1a",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 14,
                  padding: "10px 12px",
                  cursor: "pointer",
                  textAlign: "center",
                  minWidth: 84,
                  transition: "transform 160ms ease, border-color 160ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(249, 115, 22, 0.35)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 4 }}>{item.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 900, color: "rgba(226,232,240,0.65)", lineHeight: 1.3, marginBottom: 3 }}>
                  {item.name.length > 14 ? `${item.name.slice(0, 14)}…` : item.name}
                </div>
                <div style={{ fontSize: 10, color: "#f97316", fontWeight: 950 }}>{item.cal}c</div>
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: 16 }} />

        {!mode && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                setMode("search");
                window.setTimeout(() => searchRef.current?.focus(), 50);
              }}
              style={{
                flex: 1,
                minWidth: 160,
                background: "#0d0d1a",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: "12px 10px",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "rgba(226,232,240,0.82)",
                fontSize: 13,
                fontWeight: 950,
              }}
            >
              🔍 Search food
            </button>

            <button
              onClick={() => setMode("manual")}
              style={{
                flex: 1,
                minWidth: 160,
                background: "#0d0d1a",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: "12px 10px",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "rgba(226,232,240,0.82)",
                fontSize: 13,
                fontWeight: 950,
              }}
            >
              ✏️ Manual entry
            </button>

            <button
              onClick={() => alert("📸 Food Scanner coming soon!")}
              style={{
                flex: 1,
                minWidth: 160,
                background: "#0d0d1a",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: "12px 10px",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "rgba(226,232,240,0.82)",
                fontSize: 13,
                fontWeight: 950,
              }}
            >
              📸 Scan
            </button>
          </div>
        )}

        {mode === "search" && (
          <div>
            <input
              ref={searchRef}
              placeholder="Search — chicken, banana, protein bar…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ ...inputBaseStyle, marginBottom: 12 }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "rgba(249, 115, 22, 0.55)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.10)";
              }}
            />

            {q.length < 2 && <div style={{ fontSize: 12, color: "rgba(226,232,240,0.45)", textAlign: "center", padding: "12px 0", fontWeight: 800 }}>Type at least 2 characters to search</div>}
            {q.length >= 2 && searchResults.length === 0 && <div style={{ fontSize: 12, color: "rgba(226,232,240,0.45)", textAlign: "center", padding: "12px 0", fontWeight: 800 }}>No results — try manual entry</div>}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#0d0d1a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    cursor: "pointer",
                    transition: "background 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(19, 19, 37, 0.95)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#0d0d1a";
                  }}
                  onClick={() => handleLog(item)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 20 }}>{item.emoji}</span>
                      <span style={{ fontSize: 13, fontWeight: 950, color: "#f0f0f0" }}>{item.name}</span>
                    </div>
                    <MacroBadge cal={item.cal} protein={item.protein} carbs={item.carbs} fat={item.fat} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLog(item);
                    }}
                    style={{
                      background: "#f97316",
                      border: "none",
                      color: "#000",
                      borderRadius: 10,
                      padding: "8px 14px",
                      fontSize: 12,
                      fontWeight: 950,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      flexShrink: 0,
                    }}
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>

            {q.length >= 2 && (
              <button
                onClick={() => setMode("manual")}
                style={{
                  width: "100%",
                  marginTop: 12,
                  background: "transparent",
                  border: "1px dashed rgba(255,255,255,0.14)",
                  borderRadius: 12,
                  padding: "10px",
                  color: "rgba(226,232,240,0.45)",
                  fontSize: 12,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  fontWeight: 900,
                }}
              >
                Not finding it? → Enter manually
              </button>
            )}
          </div>
        )}

        {mode === "manual" && (
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(226,232,240,0.55)", marginBottom: 6, fontWeight: 900 }}>Food name *</div>
                <input
                  placeholder="e.g. Chipotle chicken bowl"
                  value={manualForm.name}
                  onChange={(e) => setManual((p) => ({ ...p, name: e.target.value }))}
                  style={inputBaseStyle}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#f97316", marginBottom: 6, fontWeight: 900 }}>Calories *</div>
                  <input
                    placeholder="e.g. 540"
                    type="number"
                    value={manualForm.cal}
                    onChange={(e) => setManual((p) => ({ ...p, cal: e.target.value }))}
                    style={inputBaseStyle}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#4ade80", marginBottom: 6, fontWeight: 900 }}>Protein (g)</div>
                  <input
                    placeholder="e.g. 46"
                    type="number"
                    value={manualForm.protein}
                    onChange={(e) => setManual((p) => ({ ...p, protein: e.target.value }))}
                    style={inputBaseStyle}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#60a5fa", marginBottom: 6, fontWeight: 900 }}>Carbs (g)</div>
                  <input
                    placeholder="e.g. 49"
                    type="number"
                    value={manualForm.carbs}
                    onChange={(e) => setManual((p) => ({ ...p, carbs: e.target.value }))}
                    style={inputBaseStyle}
                  />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#c084fc", marginBottom: 6, fontWeight: 900 }}>Fat (g)</div>
                  <input
                    placeholder="e.g. 16"
                    type="number"
                    value={manualForm.fat}
                    onChange={(e) => setManual((p) => ({ ...p, fat: e.target.value }))}
                    style={inputBaseStyle}
                  />
                </div>
              </div>

              {manualForm.name && manualForm.cal && (
                <div style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, color: "rgba(226,232,240,0.45)", marginBottom: 6, fontWeight: 900 }}>Preview</div>
                  <div style={{ fontSize: 13, fontWeight: 950, color: "#f0f0f0", marginBottom: 4 }}>✏️ {manualForm.name}</div>
                  <MacroBadge
                    cal={parseInt(manualForm.cal, 10) || 0}
                    protein={parseInt(manualForm.protein, 10) || 0}
                    carbs={parseInt(manualForm.carbs, 10) || 0}
                    fat={parseInt(manualForm.fat, 10) || 0}
                  />
                </div>
              )}

              {manualError && <div style={{ fontSize: 12, color: "#f97316", fontWeight: 900 }}>⚠️ {manualError}</div>}

              <button
                onClick={handleManualSubmit}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #f97316, #fb923c)",
                  border: "none",
                  color: "#000",
                  borderRadius: 12,
                  padding: "14px",
                  fontSize: 14,
                  fontWeight: 950,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 20px rgba(249,115,22,0.25)",
                }}
              >
                Log Food
              </button>
            </div>
          </div>
        )}
      </div>

      {toast && <Toast item={toast} />}
    </>
  );
}

