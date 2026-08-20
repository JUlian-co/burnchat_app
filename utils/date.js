/**
 * Prüft, ob zwei Datumswerte am selben Kalendertag liegen
 */
export function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  return (
    new Date(d1).toISOString().split("T")[0] ===
    new Date(d2).toISOString().split("T")[0]
  );
}

/**
 * Prüft, ob ein Datum innerhalb der letzten 24 Stunden liegt
 */
export function isWithinLast24Hours(date, now = new Date()) {
  if (!date) return false;
  const hours24InMs = 24 * 60 * 60 * 1000;
  return now.getTime() - new Date(date).getTime() < hours24InMs;
}
