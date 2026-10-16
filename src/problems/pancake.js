import { Problem } from "../problem.js";

/**
 * AUFGABE: Das Pancake-Problem (Pfannkuchen sortieren)
 *
 * Ein Stapel Pfannkuchen unterschiedlicher Grösse, z.B. [3, 1, 4, 2].
 * Die Zahl ganz links ist der oberste Pfannkuchen.
 *
 * Erlaubter Zug: einen Wendeheber an irgendeiner Stelle einschieben und
 * alles darüber umdrehen ("flip k" dreht die ersten k Pfannkuchen um).
 *
 *   [3, 1, 4, 2]  --flip 3-->  [4, 1, 3, 2]
 *
 * Ziel: der Stapel ist sortiert, der grösste zuunterst: [1, 2, 3, 4].
 *
 * TODO: Implementieren Sie die vier Methoden unten.
 */
export class Pancake extends Problem {
  constructor(start = [3, 1, 4, 2]) {
    super();
    this.start = start;
  }

  startState() {
    // TODO: den Startstapel zurückgeben
    return this.start;
  }

  isGoal(_state) {
    // TODO: true, wenn der Stapel aufsteigend sortiert ist
    throw new Error("isGoal() ist noch nicht implementiert");
  }

  successors(_state) {
    // TODO: für jedes k von 2 bis state.length einen Nachfolger erzeugen:
    //   { action: `flip ${k}`, cost: 1, state: <neuer Stapel> }
    throw new Error("successors() ist noch nicht implementiert");
  }

  key(state) {
    return state.join(",");
  }

  format(state) {
    return state.join(" ");
  }
}
