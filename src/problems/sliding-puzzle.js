import { Problem } from "../problem.js";

/**
 * Das Schiebepuzzle (8-Puzzle).
 *
 * Zustand: Array mit 9 Zahlen, 0 ist das leere Feld.
 *   [1, 2, 3,
 *    4, 0, 6,
 *    7, 5, 8]
 */
const ZIEL = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export class SlidingPuzzle extends Problem {
  constructor(start = [0, 8, 2, 5, 7, 3, 1, 4, 6], size = 3) {
    super();
    this.start = start;
    this.size = size;
  }

  startState() {
    return this.start;
  }

  isGoal(state) {
    return state.every((v, i) => v === ZIEL[i]);
  }

  successors(state) {
    const n = this.size;
    const leer = state.indexOf(0);
    const zeile = Math.floor(leer / n);
    const spalte = leer % n;

    const zuege = [
      { action: "hoch", dz: -1, ds: 0 },
      { action: "runter", dz: 1, ds: 0 },
      { action: "links", dz: 0, ds: -1 },
      { action: "rechts", dz: 0, ds: 1 },
    ];

    const result = [];
    for (const zug of zuege) {
      const z = zeile + zug.dz;
      const s = spalte + zug.ds;
      if (z < 0 || z >= n || s < 0 || s >= n) continue;
      const ziel = z * n + s;
      const next = [...state];
      next[leer] = next[ziel];
      next[ziel] = 0;
      result.push({
        action: `${next[leer]} ${zug.action}`,
        cost: 1,
        state: next,
      });
    }
    return result;
  }

  key(state) {
    return state.join(",");
  }

  format(state) {
    const n = this.size;
    const zeilen = [];
    for (let i = 0; i < state.length; i += n) {
      zeilen.push(
        state
          .slice(i, i + n)
          .map((v) => (v === 0 ? "·" : v))
          .join(" "),
      );
    }
    return zeilen.join(" / ");
  }
}

export { ZIEL };
