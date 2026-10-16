import { Problem } from "../problem.js";

/**
 * Wolf, Ziege und Kohl.
 *
 * Zustand: { boot: "links" | "rechts", links: [...], rechts: [...] }
 * Wir speichern die Objekte sortiert, damit der Schlüssel eindeutig ist.
 */
export class WolfGoatCabbage extends Problem {
  startState() {
    return {
      boot: "links",
      links: ["Bauer", "Wolf", "Ziege", "Kohl"],
      rechts: [],
    };
  }

  isGoal(state) {
    return state.rechts.length === 4;
  }

  /** Verboten: Wolf+Ziege oder Ziege+Kohl ohne Bauer. */
  isSafe(state) {
    for (const ufer of ["links", "rechts"]) {
      const s = state[ufer];
      if (s.includes("Bauer")) continue;
      if (s.includes("Wolf") && s.includes("Ziege")) return false;
      if (s.includes("Ziege") && s.includes("Kohl")) return false;
    }
    return true;
  }

  successors(state) {
    const hier = state.boot;
    const dort = hier === "links" ? "rechts" : "links";
    const mitnehmbar = state[hier].filter((x) => x !== "Bauer");

    // Der Bauer fährt alleine oder mit genau einem Passagier.
    const ladungen = [null, ...mitnehmbar];

    return ladungen
      .map((ladung) => {
        const weg = ladung ? ["Bauer", ladung] : ["Bauer"];
        const next = {
          boot: dort,
          [hier]: state[hier].filter((x) => !weg.includes(x)).sort(),
          [dort]: [...state[dort], ...weg].sort(),
        };
        return {
          action: ladung
            ? `Bauer fährt mit ${ladung} nach ${dort}`
            : `Bauer fährt alleine nach ${dort}`,
          cost: 1,
          state: next,
        };
      })
      .filter((edge) => this.isSafe(edge.state));
  }

  key(state) {
    return `${state.boot}|${state.links.join(",")}`;
  }

  format(state) {
    return `[${state.links.join(" ")}] ${state.boot === "links" ? "<B~~~" : "~~~B>"} [${state.rechts.join(" ")}]`;
  }
}
