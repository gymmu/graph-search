/**
 * Ein Problem beschreibt einen Graphen, ohne ihn jemals ganz zu bauen.
 *
 * Jedes Problem muss diese vier Methoden anbieten:
 *
 *   startState()        -> der Zustand, in dem wir starten
 *   isGoal(state)       -> true, wenn dieser Zustand das Ziel ist
 *   successors(state)   -> [{ action, cost, state }, ...] (die Kanten)
 *   key(state)          -> ein String, der den Zustand eindeutig beschreibt
 *
 * Optional:
 *   format(state)       -> hübsche Ausgabe für die Konsole
 *   heuristics          -> { name: (state) => zahl } (Woche 2)
 */
export class Problem {
  get name() {
    return this.constructor.name;
  }

  startState() {
    throw new Error("startState() muss implementiert werden");
  }

  isGoal(_state) {
    throw new Error("isGoal(state) muss implementiert werden");
  }

  successors(_state) {
    throw new Error("successors(state) muss implementiert werden");
  }

  key(state) {
    return JSON.stringify(state);
  }

  format(state) {
    return this.key(state);
  }
}
