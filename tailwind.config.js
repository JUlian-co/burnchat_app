const { COLOR_KEYS, radius } = require("./lib/design/tokens");

// Jede Farbe wird zu einer CSS-Variablen-Regel statt zu einem festen Wert.
// Den aktiven Farbsatz setzt components/ui/theme.tsx zur Laufzeit — dadurch
// funktioniert bg-canvas in Hell UND Dunkel, ohne dark:-Klassen im Code.
// Die <alpha-value>-Form haelt Varianten wie bg-surface/70 am Leben.
const colors = Object.fromEntries(
  COLOR_KEYS.map((key) => [key, `rgb(var(--color-${key}) / <alpha-value>)`]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./components/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Schriftgroessen fehlen hier absichtlich: die kommen ueber <Text variant>.
      colors,
      borderRadius: radius,
    },
  },
  plugins: [],
};
