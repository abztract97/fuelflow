import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const RESTAURANTS = [
  {
    id: "chipotle",
    name: "Chipotle",
    color: "#a3e635",
    emoji: "🌯",
    distance: "0.4mi",
    items: [
      { name: "High Protein-High Fiber Bowl", cal: 540, protein: 46, carbs: 49, fat: 16 },
      { name: "High Protein-Low Calorie Salad", cal: 470, protein: 36, carbs: 38, fat: 20 },
      { name: "Double Chicken Bowl (light rice)", cal: 620, protein: 62, carbs: 44, fat: 18 },
    ],
  },
  {
    id: "epl",
    name: "El Pollo Loco",
    color: "#f97316",
    emoji: "🔥",
    distance: "0.3mi",
    items: [
      { name: "Double Chicken Avocado Salad", cal: 450, protein: 50, carbs: 20, fat: 18 },
      { name: "Skinless Chicken Breast + Black Beans", cal: 430, protein: 46, carbs: 32, fat: 10 },
      { name: "Original Pollo Bowl", cal: 500, protein: 38, carbs: 54, fat: 14 },
    ],
  },
  {
    id: "panda",
    name: "Panda Express",
    color: "#38bdf8",
    emoji: "🐼",
    distance: "0.5mi",
    items: [
      { name: "Grilled Teriyaki + Super Greens Bowl", cal: 400, protein: 42, carbs: 28, fat: 12 },
      { name: "Teriyaki + Broccoli Beef Plate", cal: 550, protein: 51, carbs: 36, fat: 18 },
      { name: "String Bean Chicken + Super Greens", cal: 300, protein: 24, carbs: 22, fat: 8 },
    ],
  },
  {
    id: "tacobell",
    name: "Taco Bell",
    color: "#c084fc",
    emoji: "🌮",
    distance: "1.2mi",
    items: [
      { name: "Chicken Power Bowl (no ranch)", cal: 470, protein: 27, carbs: 52, fat: 16 },
      { name: "Grilled Chicken Soft Taco x2", cal: 380, protein: 26, carbs: 44, fat: 10 },
    ],
  },
  {
    id: "subway",
    name: "Subway",
    color: "#facc15",
    emoji: "🥖",
    distance: "0.4mi",
    items: [
      { name: "6\" Rotisserie Chicken on Wheat", cal: 310, protein: 24, carbs: 40, fat: 6 },
      { name: "6\" Turkey Breast on Wheat", cal: 280, protein: 18, carbs: 38, fat: 4 },
      { name: "Rotisserie Chicken Protein Bowl", cal: 260, protein: 28, carbs: 14, fat: 8 },
    ],
  },
  {
    id: "mcdonalds",
    name: "McDonald's",
    color: "#fbbf24",
    emoji: "🍟",
    distance: "0.8mi",
    items: [
      { name: "Egg McMuffin (breakfast)", cal: 310, protein: 17, carbs: 30, fat: 13 },
      { name: "Grilled Chicken Sandwich", cal: 380, protein: 28, carbs: 44, fat: 8 },
      { name: "Side Salad + Grilled Chicken", cal: 250, protein: 24, carbs: 12, fat: 6 },
    ],
  },
];

// ─── Logged Item Card ─────────────────────────────────────────────────────────
function LoggedCard({ item }) {
  return (
    <div style={{
      background: "#0a1a0a",
      border: "1px solid #4ade8040",
      borderRadius: 14,
      padding: "12px 14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      transition: "all .4s",
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            background: "#4ade8030", border: "1px solid #4ade8060",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, color: "#4ade80", fontWeight: 900,
          }}>✓</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#4ade80" }}>Logged!</span>
          <span style={{ fontSize: 12, color: "#4a4a6a", textDecoration: "line-through" }}>{item.name}</span>
        </div>
        <div style={{ display: "flex", gap: 10, fontSize: 11, paddingLeft: 30 }}>
          <span style={{ color: "#f97316" }}>+{item.cal} cal</span>
          <span style={{ color: "#555" }}>·</span>
          <span style={{ color: "#4ade80" }}>+{item.protein}g protein</span>
        </div>
      </div>
    </div>
  );
}

// ─── Best Match Mode ──────────────────────────────────────────────────────────
function BestMatchMode({ caloriesLeft, proteinLeft, onLog }) {
  const [logged, setLogged] = useState({});

  // Build scored list — use itemId to avoid React key conflicts
  const scored = RESTAURANTS.flatMap((r) =>
    r.items.map((item) => ({
      itemName: item.name,
      cal: item.cal,
      protein: item.protein,
      carbs: item.carbs,
      fat: item.fat,
      restaurant: r.name,
      color: r.color,
      emoji: r.emoji,
      itemId: r.id + "||" + item.name,
      score: item.protein * 3 - Math.abs(item.cal - caloriesLeft * 0.6) * 0.1,
    }))
  ).sort((a, b) => b.score - a.score).slice(0, 3);

  const handleLog = (item) => {
    setLogged(prev => ({ ...prev, [item.itemId]: true }));
    onLog({ name: item.itemName, cal: item.cal, protein: item.protein, carbs: item.carbs, fat: item.fat });
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: "#6b6b8a", marginBottom: 14, lineHeight: 1.6 }}>
        Best picks based on your{" "}
        <span style={{ color: "#f97316", fontWeight: 700 }}>{caloriesLeft} cal</span>{" "}
        and{" "}
        <span style={{ color: "#a3e635", fontWeight: 700 }}>{proteinLeft}g protein</span>{" "}
        remaining today.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {scored.map((item, i) =>
          logged[item.itemId] ? (
            <LoggedCard key={item.itemId} item={{ name: item.itemName, cal: item.cal, protein: item.protein }} />
          ) : (
            <div key={item.itemId} style={{
              background: "#0d0d1a",
              border: `1px solid ${item.color}30`,
              borderRadius: 14,
              padding: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}>
              <div style={{ flex: 1 }}>
                {/* Restaurant badge + best match tag */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{
                    background: item.color + "20",
                    border: `1px solid ${item.color}50`,
                    color: item.color,
                    borderRadius: 99,
                    padding: "2px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                  }}>{item.restaurant}</span>
                  {i === 0 && (
                    <span style={{
                      background: "#f9731620", border: "1px solid #f9731650",
                      color: "#f97316", borderRadius: 99, padding: "2px 8px",
                      fontSize: 10, fontWeight: 700,
                    }}>⭐ Best match</span>
                  )}
                </div>
                {/* Food item name */}
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f0", marginBottom: 6 }}>
                  {item.itemName}
                </div>
                {/* Macros */}
                <div style={{ display: "flex", gap: 10, fontSize: 11, flexWrap: "wrap" }}>
                  <span style={{ color: "#f97316", fontWeight: 600 }}>{item.cal} cal</span>
                  <span style={{ color: "#555" }}>·</span>
                  <span style={{ color: "#a3e635", fontWeight: 600 }}>{item.protein}g protein</span>
                  <span style={{ color: "#555" }}>·</span>
                  <span style={{ color: "#60a5fa" }}>{item.carbs}g carbs</span>
                  <span style={{ color: "#555" }}>·</span>
                  <span style={{ color: "#c084fc" }}>{item.fat}g fat</span>
                </div>
              </div>
              <button onClick={() => handleLog(item)} style={{
                background: item.color, border: "none", color: "#000",
                borderRadius: 10, padding: "8px 18px", fontSize: 13,
                fontWeight: 800, cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
              }}>Log</button>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Pick a Restaurant Mode ───────────────────────────────────────────────────
function PickRestaurantMode({ caloriesLeft, proteinLeft, onLog }) {
  const [selected, setSelected] = useState(null);
  const [logged, setLogged] = useState({});

  const restaurant = RESTAURANTS.find((r) => r.id === selected);

  const handleLog = (item, restaurantId) => {
    const key = restaurantId + "-" + item.name;
    setLogged(prev => ({ ...prev, [key]: true }));
    onLog(item);
  };

  return (
    <div>
      {/* Restaurant Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
        marginBottom: 16,
      }}>
        {RESTAURANTS.map((r) => (
          <div
            key={r.id}
            onClick={() => setSelected(selected === r.id ? null : r.id)}
            style={{
              background: selected === r.id ? r.color + "20" : "#0d0d1a",
              border: `1px solid ${selected === r.id ? r.color : "#ffffff15"}`,
              borderRadius: 14,
              padding: "12px 8px",
              textAlign: "center",
              cursor: "pointer",
              transition: "all .2s",
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{r.emoji}</div>
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: selected === r.id ? r.color : "#888",
              lineHeight: 1.3,
            }}>{r.name}</div>
            <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{r.distance}</div>
          </div>
        ))}
      </div>

      {/* Prompt when nothing selected */}
      {!restaurant && (
        <div style={{
          textAlign: "center", padding: "24px",
          color: "#6b6b8a", fontSize: 13,
        }}>
          👆 Tap a restaurant to see what to order
        </div>
      )}

      {/* Menu Items */}
      {restaurant && (
        <div>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#6b6b8a",
            letterSpacing: ".08em", textTransform: "uppercase",
            marginBottom: 12,
          }}>
            {restaurant.emoji} What to order at {restaurant.name}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {restaurant.items.map((item, i) => {
              const key = restaurant.id + "-" + item.name;
              const isLogged = logged[key];
              const fits = item.cal <= caloriesLeft;

              if (isLogged) return <LoggedCard key={i} item={item} />;

              return (
                <div key={i} style={{
                  background: "#0d0d1a",
                  border: `1px solid ${restaurant.color}30`,
                  borderRadius: 14,
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  opacity: fits ? 1 : 0.5,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0" }}>
                        {item.name}
                      </span>
                      {i === 0 && (
                        <span style={{
                          background: restaurant.color + "20",
                          border: `1px solid ${restaurant.color}40`,
                          color: restaurant.color,
                          borderRadius: 99, padding: "1px 8px",
                          fontSize: 10, fontWeight: 700,
                        }}>⭐ Top pick</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 10, fontSize: 11, flexWrap: "wrap" }}>
                      <span style={{ color: "#f97316", fontWeight: 600 }}>{item.cal} cal</span>
                      <span style={{ color: "#555" }}>·</span>
                      <span style={{ color: "#a3e635", fontWeight: 600 }}>{item.protein}g protein</span>
                      <span style={{ color: "#555" }}>·</span>
                      <span style={{ color: "#60a5fa" }}>{item.carbs}g carbs</span>
                      <span style={{ color: "#555" }}>·</span>
                      <span style={{ color: "#c084fc" }}>{item.fat}g fat</span>
                    </div>
                    {!fits && (
                      <div style={{ fontSize: 10, color: "#f97316", marginTop: 4 }}>
                        ⚠️ Over your remaining calories
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleLog(item, restaurant.id)}
                    disabled={!fits}
                    style={{
                      background: fits ? restaurant.color : "#1e1e2e",
                      border: "none",
                      color: fits ? "#000" : "#555",
                      borderRadius: 10, padding: "8px 16px",
                      fontSize: 13, fontWeight: 800,
                      cursor: fits ? "pointer" : "not-allowed",
                      fontFamily: "inherit", flexShrink: 0,
                    }}
                  >Log</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FastFoodSection({ caloriesLeft = 1540, proteinLeft = 121, onLog }) {
  const [mode, setMode] = useState("bestmatch"); // "bestmatch" | "pickrestaurant"

  const handleLog = (item) => {
    if (onLog) onLog(item);
    alert(`✅ Logged: ${item.name}\n${item.cal} cal · ${item.protein}g protein`);
  };

  return (
    <div
      style={{
        background: "#10101e",
        border: "1px solid #ffffff0d",
        borderRadius: 20,
        padding: "20px",
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{ fontWeight: 800, fontSize: 16, marginBottom: 2 }}
          >
            🚗 Fast Food
          </div>
          <div style={{ fontSize: 12, color: "#6b6b8a" }}>
            Watsonville, CA
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 18,
          background: "#0d0d1a",
          padding: 4,
          borderRadius: 12,
        }}
      >
        <button
          onClick={() => setMode("bestmatch")}
          style={{
            flex: 1,
            padding: "9px",
            borderRadius: 10,
            border: "none",
            background:
              mode === "bestmatch"
                ? "linear-gradient(135deg, #f97316, #fb923c)"
                : "transparent",
            color: mode === "bestmatch" ? "#000" : "#6b6b8a",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all .2s",
          }}
        >
          🎲 Best match
        </button>
        <button
          onClick={() => setMode("pickrestaurant")}
          style={{
            flex: 1,
            padding: "9px",
            borderRadius: 10,
            border: "none",
            background:
              mode === "pickrestaurant"
                ? "linear-gradient(135deg, #f97316, #fb923c)"
                : "transparent",
            color: mode === "pickrestaurant" ? "#000" : "#6b6b8a",
            fontFamily: "inherit",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "all .2s",
          }}
        >
          🔍 Pick a restaurant
        </button>
      </div>

      {/* Content */}
      {mode === "bestmatch" ? (
        <BestMatchMode
          caloriesLeft={caloriesLeft}
          proteinLeft={proteinLeft}
          onLog={handleLog}
        />
      ) : (
        <PickRestaurantMode
          caloriesLeft={caloriesLeft}
          proteinLeft={proteinLeft}
          onLog={handleLog}
        />
      )}
    </div>
  );
}
