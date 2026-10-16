import { ALGORITHMS, HEURISTIC_ALGORITHMS } from "./src/search.js";
import * as heuristiken from "./src/heuristics.js";
import { Pancake } from "./src/problems/pancake.js";
import { SlidingPuzzle } from "./src/problems/sliding-puzzle.js";
import { WolfGoatCabbage } from "./src/problems/wolf-goat-cabbage.js";

const PROBLEME = {
  puzzle: () => new SlidingPuzzle(),
  wzk: () => new WolfGoatCabbage(),
  pancake: () => new Pancake(),
};

function hilfe() {
  console.log(`
Verwendung: node index.js <problem> <algorithmus> [heuristik]

  problem:      ${Object.keys(PROBLEME).join(" | ")}
  algorithmus:  ${[...Object.keys(ALGORITHMS), ...Object.keys(HEURISTIC_ALGORITHMS)].join(" | ")}
  heuristik:    ${Object.keys(heuristiken).join(" | ")}

Beispiele:
  node index.js wzk bfs
  node index.js puzzle ucs
  node index.js puzzle astar manhattan
`);
}

const [, , problemName = "wzk", algoName = "bfs", heuristikName] = process.argv;

const bauProblem = PROBLEME[problemName];
if (!bauProblem) {
  console.error(`Unbekanntes Problem: ${problemName}`);
  hilfe();
  process.exit(1);
}

const problem = bauProblem();

let ergebnis;
if (ALGORITHMS[algoName]) {
  ergebnis = ALGORITHMS[algoName](problem);
} else if (HEURISTIC_ALGORITHMS[algoName]) {
  const h = heuristiken[heuristikName ?? "nullHeuristik"];
  if (!h) {
    console.error(`Unbekannte Heuristik: ${heuristikName}`);
    hilfe();
    process.exit(1);
  }
  ergebnis = HEURISTIC_ALGORITHMS[algoName](problem, h);
} else {
  console.error(`Unbekannter Algorithmus: ${algoName}`);
  hilfe();
  process.exit(1);
}

console.log(`\nProblem:     ${problem.name}`);
console.log(`Algorithmus: ${algoName}${heuristikName ? ` + ${heuristikName}` : ""}`);

if (!ergebnis.found) {
  console.log("\nKeine Lösung gefunden.");
} else {
  console.log(`\nLösung in ${ergebnis.path.length - 1} Zügen, Kosten ${ergebnis.cost}:\n`);
  for (const schritt of ergebnis.path) {
    const aktion = schritt.action ? `${schritt.action}` : "START";
    console.log(`  ${aktion.padEnd(32)} ${problem.format(schritt.state)}`);
  }
}

console.log(`\nStatistik:`);
console.log(`  expandierte Knoten: ${ergebnis.expanded}`);
console.log(`  erzeugte Knoten:    ${ergebnis.generated}`);
console.log(`  grösste Grenze:     ${ergebnis.maxFrontier}\n`);
