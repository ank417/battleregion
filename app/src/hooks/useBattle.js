import { useCallback, useMemo, useRef, useState } from 'react';
import { TYPES, TOTAL_SOLDIERS, BOUNTY_PER_ALIEN } from '../data/types';

export const ROW_CONFIG = [
  { n: 5, scale: 1.0, bottom: 80, detailed: true, z: 60 },
  { n: 8, scale: 0.74, bottom: 138, detailed: false, z: 50 },
  { n: 12, scale: 0.58, bottom: 182, detailed: false, z: 40 },
  { n: 17, scale: 0.46, bottom: 216, detailed: false, z: 30 },
];

const FRONT_WEAPONS = ['rifle', 'bow', 'javelin', 'karate'];
const INITIAL_BLUE_DEFEATED = 5;

function buildRoster(side) {
  const offset = side === 'red' ? 0 : 3;
  return Array.from({ length: TOTAL_SOLDIERS }, (_, idx) => ({
    idx,
    type: TYPES[(idx + offset) % TYPES.length],
    dead: side === 'blue' && idx >= TOTAL_SOLDIERS - INITIAL_BLUE_DEFEATED,
  }));
}

export function useBattle() {
  const [money, setMoney] = useState(2480);
  const [redRoster] = useState(() => buildRoster('red'));
  const [blueRoster, setBlueRoster] = useState(() => buildRoster('blue'));
  const [redFrontWeapons, setRedFrontWeapons] = useState(() =>
    Array.from({ length: 5 }, (_, i) => FRONT_WEAPONS[i % 4])
  );
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [poofs, setPoofs] = useState([]);
  const poofCounter = useRef(0);

  const blueAlive = useMemo(() => blueRoster.filter((m) => !m.dead).length, [blueRoster]);
  const redAlive = redRoster.length;
  const blueDefeated = TOTAL_SOLDIERS - blueAlive;

  const selectSoldier = useCallback((idx) => {
    setSelectedIdx((cur) => (cur === idx ? null : idx));
  }, []);

  const closePicker = useCallback(() => setSelectedIdx(null), []);

  const pickWeapon = useCallback((weaponId, blueBattlefieldNow) => {
    if (selectedIdx === null) return;
    setRedFrontWeapons((cur) => {
      const next = [...cur];
      next[selectedIdx] = weaponId;
      return next;
    });

    const targetIdx = blueRoster.findIndex((m) => !m.dead);
    if (targetIdx !== -1) {
      const pos = blueBattlefieldNow.find((b) => b.idx === targetIdx);
      setPoofs((p) => [
        ...p,
        { id: `poof-${poofCounter.current++}`, left: pos?.left ?? 500, bottom: (pos?.bottom ?? 80) + 40 },
      ]);
      setMoney((m) => m + BOUNTY_PER_ALIEN);
      setBlueRoster((cur) => {
        const next = [...cur];
        next[targetIdx] = { ...next[targetIdx], dead: true };
        return next;
      });
    }

    setSelectedIdx(null);
  }, [selectedIdx, blueRoster]);

  const clearPoof = useCallback((id) => {
    setPoofs((p) => p.filter((poof) => poof.id !== id));
  }, []);

  return {
    money,
    redRoster,
    blueRoster,
    redFrontWeapons,
    redAlive,
    blueAlive,
    blueDefeated,
    selectedIdx,
    poofs,
    selectSoldier,
    closePicker,
    pickWeapon,
    clearPoof,
  };
}
