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

/** LIFO: der zuletzt gefundene Knoten kommt zuerst dran. */
class Stack {
  constructor() {
    this.items = [];
  }
  get size() {
    return this.items.length;
  }
  push(node) {
    this.items.push(node);
  }
  pop() {
    return this.items.pop();
  }
}

/** Prioritätswarteschlange (Min-Heap): der billigste Knoten kommt zuerst dran. */
class PriorityQueue {
  constructor(priority) {
    this.items = [];
    this.priority = priority;
  }
  get size() {
    return this.items.length;
  }
  push(node) {
    this.items.push(node);
    let i = this.items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.priority(this.items[parent]) <= this.priority(this.items[i])) break;
      [this.items[parent], this.items[i]] = [this.items[i], this.items[parent]];
      i = parent;
    }
  }
  pop() {
    const top = this.items[0];
    const last = this.items.pop();
    if (this.items.length > 0) {
      this.items[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1;
        const r = l + 1;
        let kleinster = i;
        if (l < this.items.length && this.priority(this.items[l]) < this.priority(this.items[kleinster])) kleinster = l;
        if (r < this.items.length && this.priority(this.items[r]) < this.priority(this.items[kleinster])) kleinster = r;
        if (kleinster === i) break;
        [this.items[i], this.items[kleinster]] = [this.items[kleinster], this.items[i]];
        i = kleinster;
      }
    }
    return top;
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
    path.unshift({ state: current.state, action: current.action, g: current.g });
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

/** Tiefensuche: läuft einem Pfad bis ganz nach unten nach. */
export function dfs(problem, options) {
  return search(problem, new Stack(), options);
}

/** Kostensuche (Uniform Cost, Dijkstra): findet den billigsten Weg. */
export function ucs(problem, options) {
  return search(problem, new PriorityQueue((node) => node.g), options);
}

/** Greedy Best-First: schaut nur auf die Schätzung h. Schnell, aber nicht optimal. */
export function greedy(problem, h, options) {
  return search(problem, new PriorityQueue((node) => h(node.state)), options);
}

/** A*: g + h. Optimal, solange h nie überschätzt. */
export function astar(problem, h, options) {
  return search(problem, new PriorityQueue((node) => node.g + h(node.state)), options);
}

export const ALGORITHMS = { bfs, dfs, ucs };
export const HEURISTIC_ALGORITHMS = { greedy, astar };
