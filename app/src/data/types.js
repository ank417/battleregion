import { getNode } from './typeTree';

const STARTER_TYPE_IDS = ['fire', 'ocean', 'plant', 'cloud', 'land', 'space', 'galaxy'];

export const TYPES = STARTER_TYPE_IDS.map((id) => getNode(id));

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
export const BOUNTY_PER_ALIEN = 100;
export const EXTRA_SOLDIER_COST = 5000;
export const TYPE_UPGRADE_COST = 1000;
