# graph-search

Klassische KI im EF Informatik: Probleme lösen mit **Graphensuche**.

Ein Problem ist ein Graph, den wir nie ganz aufzeichnen. Wir kennen nur den
Startzustand und die Regel, welche Züge erlaubt sind. Die Suche baut den
Graphen genau so weit auf, wie sie ihn braucht.

## Starten

```bash
npm start                      # Hilfe
node index.js wzk bfs          # Wolf, Ziege, Kohl mit Breitensuche
node index.js puzzle ucs       # Schiebepuzzle mit Kostensuche
node index.js puzzle astar manhattan   # Woche 2
```

Es braucht keine Installation, nur Node.js.

## Aufbau

```
index.js                 Kommandozeile
src/problem.js           Was ein Problem können muss
src/search.js            BFS, DFS, UCS, Greedy, A*
src/heuristics.js        Heuristiken (Woche 2, teilweise TODO)
src/problems/
  wolf-goat-cabbage.js   fertig
  sliding-puzzle.js      fertig
  pancake.js             TODO — Ihre Aufgabe
```

## Ein eigenes Problem schreiben

Ein Problem braucht vier Methoden:

| Methode             | Bedeutung                                          |
| ------------------- | -------------------------------------------------- |
| `startState()`      | Wo fangen wir an?                                   |
| `isGoal(state)`     | Sind wir am Ziel?                                   |
| `successors(state)` | Welche Züge gibt es? `[{ action, cost, state }]`    |
| `key(state)`        | Eindeutiger String — damit nichts doppelt besucht wird |

```js
import { Problem } from "../problem.js";

export class MeinProblem extends Problem {
  startState() {
    return 1;
  }
  isGoal(state) {
    return state === 100;
  }
  successors(state) {
    return [
      { action: "+1", cost: 1, state: state + 1 },
      { action: "*2", cost: 1, state: state * 2 },
    ];
  }
  key(state) {
    return String(state);
  }
}
```

Danach in `index.js` bei `PROBLEME` eintragen.

## Wichtig

`successors` darf den übergebenen Zustand **nie verändern**. Immer eine Kopie
erzeugen (`[...state]`), sonst zerstört die Suche ihre eigene Vergangenheit.
