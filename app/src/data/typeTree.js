export const TYPE_NODES = {
  ash: { id: 'ash', name: 'Ash', icon: '🌫️', color: '#9c8f8a' },
  fire: { id: 'fire', name: 'Fire', icon: '🔥', color: '#ff7a3c' },
  sun: { id: 'sun', name: 'Sun', icon: '☀️', color: '#ffce3c' },
  sky: { id: 'sky', name: 'Sky', icon: '🌤️', color: '#7ec8e3' },
  air: { id: 'air', name: 'Air', icon: '💨', color: '#bcd8e8' },
  cloud: { id: 'cloud', name: 'Cloud', icon: '☁️', color: '#5f9fe0' },

  fish: { id: 'fish', name: 'Fish', icon: '🐟', color: '#3ba0c4' },
  crab: { id: 'crab', name: 'Crab', icon: '🦀', color: '#d9633b' },
  tidepool: { id: 'tidepool', name: 'Tide Pool', icon: '🏖️', color: '#2f8fae' },
  ocean: { id: 'ocean', name: 'Ocean', icon: '🌊', color: '#2aa9d9' },

  flower: { id: 'flower', name: 'Flower', icon: '🌸', color: '#e487b0' },
  leaf: { id: 'leaf', name: 'Leaf', icon: '🍂', color: '#9bbf5a' },
  tree: { id: 'tree', name: 'Tree', icon: '🌳', color: '#3f8a48' },
  bush: { id: 'bush', name: 'Bush', icon: '🌿', color: '#4caf5a' },
  plant: { id: 'plant', name: 'Plant', icon: '🍃', color: '#4caf5a' },
  land: { id: 'land', name: 'Land', icon: '⛰️', color: '#c08a4a' },

  earth: { id: 'earth', name: 'Earth', icon: '🌍', color: '#4a8f5a' },
  space: { id: 'space', name: 'Space', icon: '🪐', color: '#9b6cd6' },
  galaxy: { id: 'galaxy', name: 'Galaxy', icon: '🌌', color: '#e05fb0' },
  universe: { id: 'universe', name: 'Universe', icon: '✨', color: '#6a5fd1' },
  multiverse: { id: 'multiverse', name: 'Multiverse', icon: '♾️', color: '#d14fae' },
};

// child -> parent: each type evolves INTO the next tier up.
export const EVOLUTION_EDGES = [
  ['ash', 'sun'], ['fire', 'sun'],
  ['sun', 'sky'], ['sky', 'air'], ['air', 'cloud'],
  ['fish', 'tidepool'], ['crab', 'tidepool'], ['tidepool', 'ocean'],
  ['flower', 'plant'], ['leaf', 'plant'], ['tree', 'plant'], ['bush', 'plant'], ['plant', 'land'],
  ['ocean', 'earth'], ['cloud', 'earth'], ['land', 'earth'],
  ['earth', 'space'], ['earth', 'galaxy'],
  ['galaxy', 'universe'], ['universe', 'multiverse'],
];

// stated head-to-head rules: winner beats loser (and each side's predecessor chain).
export const BASE_BEATS = [
  ['cloud', 'ocean'],
  ['ocean', 'land'],
  ['land', 'air'],
  ['space', 'earth'],
  ['earth', 'galaxy'],
  ['galaxy', 'space'],
  ['multiverse', 'universe'],
];

const FORWARD = {};
const BACKWARD = {};
for (const id of Object.keys(TYPE_NODES)) {
  FORWARD[id] = [];
  BACKWARD[id] = [];
}
for (const [child, parent] of EVOLUTION_EDGES) {
  FORWARD[child].push(parent);
  BACKWARD[parent].push(child);
}

export function getNode(id) {
  return TYPE_NODES[id];
}

export function evolveOptions(id) {
  return FORWARD[id] || [];
}

// every node that evolves (directly or transitively) into `id`.
export function ancestorsOf(id) {
  const seen = new Set();
  const stack = [...(BACKWARD[id] || [])];
  while (stack.length) {
    const cur = stack.pop();
    if (seen.has(cur)) continue;
    seen.add(cur);
    stack.push(...(BACKWARD[cur] || []));
  }
  return seen;
}

function chainOf(id) {
  const chain = ancestorsOf(id);
  chain.add(id);
  return chain;
}

// does `a` (or anything that evolves into it) beat `b` (or anything that evolves into it)?
export function beats(a, b) {
  for (const [winner, loser] of BASE_BEATS) {
    if (chainOf(winner).has(a) && chainOf(loser).has(b)) return true;
  }
  return false;
}

// a single type id that counters `targetId`, or null if none is known.
export function counterFor(targetId) {
  for (const [winner, loser] of BASE_BEATS) {
    if (chainOf(loser).has(targetId)) return winner;
  }
  return null;
}
