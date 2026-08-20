// Einzige Quelle fuer Farben, Schriftgroessen, Radien und Motion.
// CommonJS, weil tailwind.config.js die Datei per require() einliest.
//
// FARBEN UND DARK MODE
// Tailwind-Klassen entstehen beim Bauen und koennen zur Laufzeit nicht
// umgeschaltet werden. Deshalb erzeugt tailwind.config.js aus jedem Namen
// eine Regel wie  rgb(var(--color-canvas) / <alpha-value>)  und der aktive
// Farbsatz wird zur Laufzeit als CSS-Variable gesetzt (components/ui/theme.tsx).
// Ergebnis: bg-canvas passt sich von allein an, ohne dark:-Klassen ueberall.
//
// Werte als "R G B" ohne rgb(), damit die Alpha-Variante funktioniert
// (bg-surface/70). Deshalb sind auch die Grautoene deckend statt rgba —
// Apple veroeffentlicht fuer beide Modi ohnehin eigene Werte.

const COLOR_KEYS = [
  "canvas",
  "surface",
  "elevated",
  "separator",
  "label",
  "muted",
  "faint",
  "accent",
  "accent-soft",
  "accent-strong",
  "on-fill",
  "rose",
  "ice",
  "sage",
];

// Grundlage ist die gewaehlte Palette: FF9F0A · 000000 · CE7B91 · C0E8F9 · B8D3D1
//
// REGEL: Orange und die Pastelltoene sind FUELLFARBEN. Orange als Schrift auf
// Weiss hat Kontrast 1.75 und ist unlesbar. Wo Orange doch Schrift sein muss,
// gibt es accent-strong — im Hellen abgedunkelt, im Dunklen aufgehellt.
const palette = {
  light: {
    canvas: "242 243 245", // Hintergrund
    surface: "255 255 255", // Karten, Listenzeilen
    elevated: "233 235 238", // eingelassen, gedrueckt
    separator: "209 209 214",

    label: "0 0 0",
    muted: "110 110 115", // Apple secondaryLabel
    faint: "174 174 178", // Apple systemGray2

    accent: "255 159 10",
    "accent-soft": "255 240 217", // Orange bei 16 % auf Weiss
    "accent-strong": "160 95 0", // 5.2:1 auf Weiss
    "on-fill": "0 0 0", // Schrift auf Orange/Pastell — in BEIDEN Modi schwarz

    rose: "206 123 145",
    ice: "192 232 249",
    sage: "184 211 209",
  },
  dark: {
    canvas: "0 0 0",
    surface: "28 28 30",
    elevated: "44 44 46",
    separator: "56 56 58",

    label: "255 255 255",
    muted: "152 152 157",
    faint: "99 99 102",

    accent: "255 159 10",
    "accent-soft": "41 25 2", // Orange bei 16 % auf Schwarz
    "accent-strong": "255 179 64", // im Dunklen aufgehellt statt abgedunkelt
    "on-fill": "0 0 0", // Schrift auf Orange/Pastell — in BEIDEN Modi schwarz

    rose: "206 123 145",
    ice: "192 232 249",
    sage: "184 211 209",
  },
};

// Fertige rgb()-Strings fuer JavaScript: Symbolfarben, placeholderTextColor,
// Tab-Leiste — alles was keine Klassennamen versteht.
const toRgb = (scheme) =>
  Object.fromEntries(
    COLOR_KEYS.map((key) => [key, `rgb(${palette[scheme][key]})`]),
  );

const color = { light: toRgb("light"), dark: toRgb("dark") };

// iOS Type Scale: [Schriftgroesse, Zeilenhoehe] in Punkt.
// Bewusst NICHT in tailwind.config.js — Schrift kommt ausschliesslich ueber
// <Text variant="...">. So gibt es genau einen Weg und niemand kann eine
// Groesse benutzen, die es bei Apple nicht gibt.
const fontSize = {
  caption2: [11, 13],
  caption: [12, 16],
  footnote: [13, 18],
  subhead: [15, 20],
  body: [17, 22],
  headline: [17, 22], // wie body, nur semibold
  title3: [20, 25],
  title2: [22, 28],
  title1: [28, 34],
  largeTitle: [34, 41],
};

// Konzentrik-Regel: inner_radius + padding = outer_radius.
const radius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "20px",
  "2xl": "24px",
  full: "9999px",
};

// Apples Standard-Dauern und -Kurven.
const motion = {
  duration: {
    instant: 100, // Tap-Feedback
    fast: 200, // Ein- und Ausblenden
    normal: 300, // Screenwechsel
    slow: 400, // der Brennmoment
  },
  easing: {
    standard: [0.25, 0.1, 0.25, 1],
    out: [0, 0, 0.58, 1],
    spring: [0.175, 0.885, 0.32, 1.275],
  },
};

// Apples Minimum fuer alles Antippbare.
const touchTarget = 44;

module.exports = {
  COLOR_KEYS,
  palette,
  color,
  fontSize,
  radius,
  motion,
  touchTarget,
};
