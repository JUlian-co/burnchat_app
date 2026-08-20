# Burnchat — Design-System

Apple Human Interface Guidelines, hell und dunkel, iOS und Android.
Alles hier ist Code im Repo, kein externes Werkzeug.

---

## Die eine Regel

**Es gibt genau einen Weg, etwas zu setzen.**

| Was | Wie | Nicht |
|---|---|---|
| Farbe | `className="bg-surface"` oder `useColors()` | Hex-Werte im Screen |
| Schriftgröße | `<Text variant="title1">` | `fontSize` oder `text-[19px]` |
| Abstand | `className="p-4 gap-3"` (4pt-Raster) | krumme Zahlen |
| Symbol | `<Icon name="flame" />` | Lucide direkt importieren |
| Haptik | `haptics.success()` | `Haptics.notificationAsync(...)` |

Wer davon abweicht, baut eine Ausnahme, die niemand später wiederfindet.

---

## Farben

Quelle: `lib/design/tokens.js`, Objekt `palette`. Zwei Sätze, gleiche Namen.

| Name | Aufgabe |
|---|---|
| `canvas` | Hintergrund des Screens |
| `surface` | Karten, Listenzeilen, Leisten |
| `elevated` | eingelassen, gedrückter Zustand |
| `separator` | Trennlinien |
| `label` | Haupttext |
| `muted` | Nebentext |
| `faint` | Platzhalter, deaktiviert |
| `accent` | Hauptaktion, Streak — **nur als Fläche** |
| `accent-soft` | Fläche hinter Sekundäraktionen |
| `accent-strong` | Orange als Schrift (hell abgedunkelt, dunkel aufgehellt) |
| `rose` | Brennmoment, Destruktives |
| `ice` | Ruhe, Information |
| `sage` | Bestätigung |

Grundlage ist die gewählte Palette `FF9F0A · 000000 · CE7B91 · C0E8F9 · B8D3D1`.

### Die Kontrastregel

**Orange und die Pastelltöne sind Füllfarben, keine Schriftfarben.**

`#FF9F0A` als Text auf Weiß hat ein Kontrastverhältnis von **1,75** — unlesbar.
Als Fläche mit schwarzer Schrift: **11:1**.

Deshalb ist der Streak eine orange Pille mit schwarzer Zahl, kein oranger Text.
Wo Orange doch Schrift sein muss (Tab-Leiste, Ghost-Button), greift
`accent-strong` mit 5,2:1.

Die Pastelltöne sind in **beiden** Modi hell. Ihre Schrift ist deshalb immer
schwarz, nie `label` — sonst wäre sie im Dunkelmodus weiß auf Hellblau.

### Wie Dark Mode funktioniert

Tailwind-Klassen entstehen beim Bauen und lassen sich zur Laufzeit nicht
umschalten. Deshalb:

1. `tailwind.config.js` erzeugt aus jedem Namen `rgb(var(--color-x) / <alpha-value>)`
2. `components/ui/theme.tsx` setzt die Variablen zur Laufzeit über NativeWinds `vars()`
3. `AppTheme` liegt ganz außen um den Navigator und folgt `useColorScheme()`

Ergebnis: `bg-canvas` passt sich von allein an. Es gibt **keine** `dark:`-Klasse
im ganzen Projekt. Für JavaScript-Werte (Symbolfarben, Tab-Leiste,
`placeholderTextColor`) gibt es `useColors()`.

---

## Schrift

Apples iOS-Skala, `[Größe, Zeilenhöhe]` in Punkt:

```
largeTitle 34/41   title1 28/34   title2 22/28   title3 20/25
headline   17/22   body   17/22   subhead 15/20
footnote   13/18   caption 12/16  caption2 11/13
```

Zehn Stufen stehen bereit — **pro Screen höchstens vier benutzen.**

`variant` legt Größe *und* Gewicht fest, weil das bei Apple zusammengehört.
`tone` ist die Farbe: `default · muted · faint · accent · onFill · inverse`.

**Familie:** iOS bekommt San Francisco als Systemschrift. Android bekommt
**Inter** über `expo-font` — San Francisco darf rechtlich nicht in eine
Android-App gebündelt werden. Auf Android wird `fontWeight` bei geladenen
Schriften ignoriert, deshalb wird dort pro Gewicht die passende Datei benannt.

**Dynamic Type:** React Native skaliert `fontSize` automatisch mit der
Systemschriftgröße, `lineHeight` aber nicht. `text.tsx` multipliziert deshalb
mit `fontScale` — sonst überlappen die Zeilen.

---

## Abstände und Radien

Tailwinds Standardskala ist bereits Apples 4/8-Punkt-Raster: `p-1` = 4,
`p-2` = 8, `p-4` = 16. Da war nichts zu verbessern.

**Konzentrik-Regel:** `innen + Abstand = außen`.
Die Karte hat außen 24 (`rounded-2xl`) und 16 Innenabstand (`p-4`), das Bild
darin bekommt 8. So laufen die Rundungen parallel statt sich zu schneiden.

**44 Punkt** ist das Minimum für alles Antippbare (`touchTarget` in den Tokens).

---

## Bausteine

`components/ui/`, ein Zweck pro Datei:

| Datei | Zweck |
|---|---|
| `screen.tsx` | SafeArea, Hintergrund, Statusleiste je Modus |
| `text.tsx` | Typo-Skala, Plattform-Schrift, Dynamic Type |
| `button.tsx` | 4 Varianten, 44pt, `scale(0.97)`, Haptik |
| `card.tsx` | Inhaltsfläche, Schatten nur im Hellmodus |
| `list-group.tsx` | Apples gruppierte Liste — **ohne Schatten** |
| `list-row.tsx` | Zeile, 44pt, eingerückte Trennlinie |
| `text-field.tsx` | `row` für Formulare, `filled` für Suche |
| `chip.tsx` | gefüllte Pille, färbt ihr Symbol selbst |
| `avatar.tsx` | Foto vor Initialen, Pastellton je Person |
| `icon.tsx` | SF Symbols auf iOS, Lucide auf Android |
| `glass.tsx` | Blur-Material mit Fallback |
| `nav-bar.tsx` | große Überschrift in der Seite |
| `empty-state.tsx` | Leerzustand mit Handlungsaufforderung |
| `haptics.ts` | Rückmeldung nach Bedeutung benannt |
| `theme.tsx` | Hell/Dunkel, `useColors`, `useScheme` |

### Karte oder Gruppe?

**Karte** (`Card`) ist für **Inhalt**: ein Foto, ein Profil. Radius 24, Schatten.

**Gruppe** (`ListGroup`) ist für **Listen**: Freunde, Suchergebnisse,
Formularfelder. Radius 12, **kein Schatten**, weiße Zeilen auf grauem Grund.

Das zu verwechseln ist der häufigste Grund, warum eine App „fast wie iOS"
aussieht statt wie iOS.

---

## Bewegung und Haptik

Apples Dauern: `instant 100 · fast 200 · normal 300 · slow 400`.

| Moment | Bewegung | Haptik |
|---|---|---|
| Knopf drücken | `scale(0.97)` | `tap` |
| Kamera auslösen | `scale(0.94)` | `shutter` |
| Bild ist raus | — | `success` |
| Oops | — | `warning` |
| Bild verbrennen | aufflammen + verschwinden, 380ms | `tap` |
| Karte erscheint | einblenden, 220ms | — |
| Kamera wechseln | — | `select` |
| Freund hinzugefügt | — | `success` / `error` |

**Reduce Motion** wird respektiert: `useReducedMotion()` ersetzt das
Aufflammen durch ein weiches Ausblenden.

Haptik heißt nach **Bedeutung**, nicht nach API. Beim Schreiben eines Screens
fragt man „was passiert hier", nicht „welche Stärke nehme ich".

---

## Etwas ändern

| Was | Wo |
|---|---|
| Farbe ändern | `lib/design/tokens.js`, `palette.light` **und** `palette.dark` |
| Farbe hinzufügen | ebenda plus `COLOR_KEYS` — die Klasse entsteht von allein |
| Schriftgröße | `tokens.js`, `fontSize` |
| Neue Textstufe | `tokens.js` **und** `VARIANTS` in `text.tsx` |
| Button-Variante | `VARIANTS` in `button.tsx` |
| Neues Symbol | `ICONS` in `icon.tsx` — SF-Name und Lucide-Fallback |
| Neuer Baustein | Datei in `components/ui/`, Zeile in `index.ts` |

Nach Änderungen an `tokens.js` oder `tailwind.config.js` Metro neu starten
(`npx expo start -c`) — Klassen entstehen beim Bauen.

---

## Noch offen

- **Einklappende große Überschrift beim Scrollen.** Die auffälligste
  iOS-Geste. Braucht einen Scroll-Handler in Reanimated und visuelle
  Abstimmung am Gerät.
- **Querformat und Tablet.** Layouts sind für Hochformat gebaut.
- **Liquid Glass** (iOS 26). `glass.tsx` nutzt `expo-blur`; echtes
  `expo-glass-effect` braucht iOS 26 und einen Dev-Build.
