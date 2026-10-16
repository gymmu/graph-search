/**
 * Heuristiken — Woche 2.
 *
 * Eine Heuristik h(state) schätzt, wie weit es von diesem Zustand bis zum
 * Ziel noch ist. Sie darf nie zu viel schätzen (dann heisst sie zulässig).
 *
 * h(state) = 0 ist immer erlaubt — aber auch völlig nutzlos.
 */

/** Die Null-Heuristik. Damit wird A* zu UCS. */
export const nullHeuristik = () => 0;

/**
 * TODO: Schiebepuzzle — Anzahl Steine, die nicht am richtigen Platz sind.
 * Das leere Feld (0) wird nicht mitgezählt.
 */
export function falschePlaetze(_state) {
  throw new Error("falschePlaetze() ist noch nicht implementiert");
}

/**
 * TODO: Schiebepuzzle — Manhattan-Distanz.
 * Für jeden Stein: |Zeilendifferenz| + |Spaltendifferenz| zu seinem Zielplatz,
 * alles aufsummiert.
 */
export function manhattan(_state) {
  throw new Error("manhattan() ist noch nicht implementiert");
}

/**
 * TODO: Pancake — Anzahl "Brüche" im Stapel (gap heuristic).
 * Zwei benachbarte Pfannkuchen, deren Grössen sich um mehr als 1
 * unterscheiden, bilden einen Bruch.
 */
export function gap(_state) {
  throw new Error("gap() ist noch nicht implementiert");
}
