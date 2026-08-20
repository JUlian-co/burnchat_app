import * as Haptics from "expo-haptics";

// Apple kennt drei Haptik-Klassen, und sie bedeuten Verschiedenes:
//
//   Selection    — der Finger wandert durch Optionen
//   Impact       — etwas trifft auf, rastet ein, faellt
//   Notification — eine Aufgabe endet: Erfolg, Warnung, Fehler
//
// Deshalb heissen die Funktionen hier nach ihrer BEDEUTUNG, nicht nach der
// API. Beim Schreiben eines Screens fragt man sich "was passiert hier",
// nicht "welche Staerke nehme ich".
export const haptics = {
  /** Ein Knopf wurde gedrueckt. */
  tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  /** Etwas Gewichtiges passiert — der Ausloeser der Kamera. */
  shutter: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

  /** Die Auswahl hat gewechselt. */
  select: () => Haptics.selectionAsync(),

  /** Fertig und gut gegangen: Bild raus, Freund hinzugefuegt. */
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  /** Etwas wurde zurueckgenommen oder abgebrochen. */
  warning: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

  /** Etwas ist schiefgegangen. */
  error: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
