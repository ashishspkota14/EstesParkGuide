const coffeeTheme = {
  primary: "#8B593E",
  secondary: "#D4A574",
  background: "#FFF8F3",
  text: "#4A3428",
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#9A8478",
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#C4956A",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
};

const forestTheme = {
  primary: "#2E7D32",
  secondary: "#81C784",
  background: "#E8F5E9",
  text: "#1B5E20",
  border: "#C8E6C9",
  white: "#FFFFFF",
  textLight: "#66BB6A",
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#4CAF50",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
};

const purpleTheme = {
  primary: "#6A1B9A",
  secondary: "#CE93D8",
  background: "#F3E5F5",
  text: "#4A148C",
  border: "#D1C4E9",
  white: "#FFFFFF",
  textLight: "#BA68C8",
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#9C27B0",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
};

const oceanTheme = {
  primary: "#0277BD",
  secondary: "#4FC3F7",
  background: "#E1F5FE",
  text: "#01579B",
  border: "#B3E5FC",
  white: "#FFFFFF",
  textLight: "#4FC3F7",
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#03A9F4",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
};

const sunsetTheme = {
  primary: "#FF7E67",
  secondary: "#FFB347",
  background: "#FFF3F0",
  text: "#2C1810",
  border: "#FFD5CC",
  white: "#FFFFFF",
  textLight: "#FFA494",
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#FF6B6B",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
};

const mintTheme = {
  primary: "#00B5B5",
  secondary: "#4DD0E1",
  background: "#E8F6F6",
  text: "#006666",
  border: "#B2E8E8",
  white: "#FFFFFF",
  textLight: "#66D9D9",
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#00ACC1",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
};

const midnightTheme = {
  primary: "#2C3E50",
  secondary: "#5D6D7E",
  background: "#F4F6F7",
  text: "#1A2530",
  border: "#D5D8DC",
  white: "#FFFFFF",
  textLight: "#7F8C8D",
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#34495E",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
};

const roseGoldTheme = {
  primary: "#E0BFB8",
  secondary: "#F5D0C5",
  background: "#FDF6F5",
  text: "#4A3B38",
  border: "#F2D9D5",
  white: "#FFFFFF",
  textLight: "#C9A9A6",
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#D4A5A5",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
};

// 🌲 Greenish theme - sun rays through forest
const greenishTheme = {
  primary: "#2d5a3f",
  secondary: "#c89968",
  background: "#f4f1e8",
  text: "#1f2937",
  border: "#d4c5a9",
  white: "#FFFFFF",
  textLight: "#6b7280",
  card: "#FFFFFF",
  shadow: "#000000",
  accent: "#8b7355",
  success: "#4ade80",
  warning: "#fbbf24",
  danger: "#ef4444",
};

export const THEMES = {
  coffee: coffeeTheme,
  forest: forestTheme,
  purple: purpleTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  mint: mintTheme,
  midnight: midnightTheme,
  roseGold: roseGoldTheme,
  greenish: greenishTheme,
};

// Type for theme object
export type Theme = typeof greenishTheme;

// 👇 change this to switch default theme
export const COLORS = THEMES.greenish;