/**
 * Die Suchalgorithmen.
 *
 * Alle Algorithmen hier sind derselbe Algorithmus. Sie unterscheiden sich
 * nur in einer einzigen Frage: welchen Knoten nehme ich als nächstes aus
 * der Grenze (frontier)?
 *
 *   BFS    -> den ältesten Knoten     (Warteschlange, FIFO)
 *   DFS    -> den neuesten Knoten     (Stapel, LIFO)
 *   UCS    -> den mit kleinstem g     (Prioritätswarteschlange)
 *   Greedy -> den mit kleinstem h     (Woche 2)
 *   A*     -> den mit kleinstem g + h (Woche 2)
 */

// ── Die drei Grenzen ────────────────────────────────────────────────────

/** FIFO: wer zuerst kommt, kommt zuerst dran. */
class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
  }
  get size() {
    return this.items.length - this.head;
  }
  push(node) {
    this.items.push(node);
  }
  pop() {
    return this.items[this.head++];
  }
}

/**
 * LIFO: der zuletzt gefundene Knoten kommt zuerst dran.
 *
 * AUFGABE: Implementieren Sie diese Klasse. Schauen Sie sich Queue oben an —
 * es ist fast dasselbe. Nur pop() nimmt am anderen Ende heraus.
 */
class Stack {
  constructor() {
    this.items = [];
  }
  get size() {
    // TODO: wie viele Knoten liegen auf dem Stapel?
    throw new Error("Stack.size ist noch nicht implementiert");
  }
  push(_node) {
    // TODO: Knoten oben auf den Stapel legen
    throw new Error("Stack.push() ist noch nicht implementiert");
  }
  pop() {
    // TODO: den obersten Knoten herausnehmen und zurückgeben
    throw new Error("Stack.pop() ist noch nicht implementiert");
  }
}

/**
 * Prioritätswarteschlange: der billigste Knoten kommt zuerst dran.
 *
 * AUFGABE: Implementieren Sie diese Klasse. Der Konstruktor bekommt eine
 * Funktion priority(node); pop() gibt den Knoten mit dem KLEINSTEN Wert
 * zurück.
 *
 * Fangen Sie einfach an: push() hängt hinten an, pop() sucht das Minimum
 * linear und entfernt es mit splice(). Das ist langsam, aber korrekt.
 * Einen Min-Heap bauen Sie erst, wenn der Rest läuft.
 */
class PriorityQueue {
  constructor(priority) {
    this.items = [];
    this.priority = priority;
  }
  get size() {
    // TODO: wie viele Knoten warten in der Grenze?
    throw new Error("PriorityQueue.size ist noch nicht implementiert");
  }
  push(_node) {
    // TODO: Knoten aufnehmen
    throw new Error("PriorityQueue.push() ist noch nicht implementiert");
  }
  pop() {
    // TODO: den Knoten mit der kleinsten Priorität herausnehmen
    throw new Error("PriorityQueue.pop() ist noch nicht implementiert");
  }
}

// ── Knoten und Weg ──────────────────────────────────────────────────────

/** Ein Knoten im Suchbaum: Zustand plus die Erinnerung, wie wir hinkamen. */
function makeNode(state, parent = null, action = null, cost = 0) {
  return {
    state,
    parent,
    action,
    g: parent ? parent.g + cost : 0,
    depth: parent ? parent.depth + 1 : 0,
  };
}

/** Baut aus einem Zielknoten den Weg vom Start her zusammen. */
function buildPath(node) {
  const path = [];
  let current = node;
  while (current) {
    path.unshift({
      state: current.state,
      action: current.action,
      g: current.g,
    });
    current = current.parent;
  }
  return path;
}

// ── Der allgemeine Algorithmus ──────────────────────────────────────────

/**
 * @param {Problem} problem
 * @param {Queue|Stack|PriorityQueue} frontier
 * @param {object} options { maxExpansions }
 */
export function search(problem, frontier, options = {}) {
  const maxExpansions = options.maxExpansions ?? 300000;

  frontier.push(makeNode(problem.startState()));

  const visited = new Set();
  let expanded = 0;
  let generated = 1;
  let maxFrontier = 1;

  while (frontier.size > 0) {
    const node = frontier.pop();

    const k = problem.key(node.state);
    if (visited.has(k)) continue; // schon abgehakt
    visited.add(k);

    if (problem.isGoal(node.state)) {
      return {
        found: true,
        path: buildPath(node),
        cost: node.g,
        depth: node.depth,
        expanded,
        generated,
        maxFrontier,
        visited: visited.size,
      };
    }

    expanded++;
    if (expanded >= maxExpansions) break;

    for (const edge of problem.successors(node.state)) {
      if (visited.has(problem.key(edge.state))) continue;
      frontier.push(makeNode(edge.state, node, edge.action, edge.cost ?? 1));
      generated++;
    }
    if (frontier.size > maxFrontier) maxFrontier = frontier.size;
  }

  return {
    found: false,
    path: [],
    cost: Infinity,
    expanded,
    generated,
    maxFrontier,
    visited: visited.size,
  };
}

// ── Die konkreten Algorithmen ───────────────────────────────────────────

/** Breitensuche: findet immer den kürzesten Weg (in Anzahl Zügen). */
export function bfs(problem, options) {
  return search(problem, new Queue(), options);
}

/** Tiefensuche: läuft einem Pfad bis ganz nach unten nach. Braucht Stack. */
export function dfs(problem, options) {
  return search(problem, new Stack(), options);
}

/** Kostensuche (Uniform Cost, Dijkstra): findet den billigsten Weg.
 *  Braucht PriorityQueue. */
export function ucs(problem, options) {
  return search(problem, new PriorityQueue((node) => node.g), options);
}

/** Greedy Best-First: schaut nur auf die Schätzung h. Schnell, aber nicht optimal. */
export function greedy(problem, h, options) {
  return search(problem, new PriorityQueue((node) => h(node.state)), options);
}

/** A*: g + h. Optimal, solange h nie überschätzt. */
export function astar(problem, h, options) {
  return search(
    problem,
    new PriorityQueue((node) => node.g + h(node.state)),
    options,
  );
}

export const ALGORITHMS = { bfs, dfs, ucs };
export const HEURISTIC_ALGORITHMS = { greedy, astar };
