const PALETTE = [
  { tint: "var(--tint-purple)", color: "var(--color-primary)" },
  { tint: "var(--tint-amber)", color: "var(--color-amber)" },
  { tint: "var(--tint-teal)", color: "var(--color-teal)" },
  { tint: "var(--tint-pink)", color: "var(--color-pink)" },
  { tint: "var(--tint-blue)", color: "var(--color-blue)" },
];

const ICONS = {
  fruit: "🍎", grocery: "🛒", groceries: "🛒", food: "🍔",
  travel: "✈️", transport: "🚕", cab: "🚕", fuel: "⛽",
  salary: "💼", freelance: "💻", investment: "📈",
  bill: "💡", electricity: "💡", rent: "🏠", loan: "🏦",
  shopping: "🛍️", stationary: "📎", stationery: "📎",
  entertainment: "🎬", health: "💊", education: "📚",
};

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
};

export const getCategoryStyle = (label = "") => {
  const key = label.toLowerCase();
  const matchedKeyword = Object.keys(ICONS).find((k) => key.includes(k));
  const palette = PALETTE[hashString(label) % PALETTE.length];
  return {
    emoji: matchedKeyword ? ICONS[matchedKeyword] : "💳",
    bg: palette.tint,
    color: palette.color,
  };
};

export const CHART_COLORS = [
  "var(--color-primary)",
  "var(--color-amber)",
  "var(--color-teal)",
  "var(--color-pink)",
  "var(--color-blue)",
  "var(--color-lime)",
];