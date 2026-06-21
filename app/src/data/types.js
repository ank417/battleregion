import { TYPE_NODES } from './typeTree';

// every type in the tree, in a fixed order; used for the 2-per-type roster split.
export const ALL_TYPES = Object.values(TYPE_NODES);

// weak -> strong; index is also used as combat power when type matchup is neutral.
export const WEAPONS = [
  { id: 'karate', label: 'Karate', icon: '🥋', price: 0, priceLabel: 'FREE' },
  { id: 'javelin', label: 'Javelin', icon: '🔱', price: 5, priceLabel: '$5' },
  { id: 'bow', label: 'Bow', icon: '🏹', price: 200, priceLabel: '$200' },
  { id: 'rifle', label: 'Rifle', icon: '⚡', price: 2000, priceLabel: '$2,000' },
];

export function weaponTier(weaponId) {
  return WEAPONS.findIndex((w) => w.id === weaponId);
}

export function weaponPrice(weaponId) {
  return WEAPONS.find((w) => w.id === weaponId)?.price ?? 0;
}

export const TOTAL_SOLDIERS = 42;
export const BOUNTY_PER_ALIEN = 40;
export const EXTRA_SOLDIER_COST = 5000;
