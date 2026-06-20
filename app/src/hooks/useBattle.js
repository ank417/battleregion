import { useCallback, useMemo, useRef, useState } from 'react';
import { TYPES, TOTAL_SOLDIERS, BOUNTY_PER_ALIEN, EXTRA_SOLDIER_COST, TYPE_UPGRADE_COST, WEAPONS, weaponTier, weaponPrice } from '../data/types';
import { beats, counterFor, evolveOptions, getNode } from '../data/typeTree';

export const ROW_CONFIG = [
  { n: 5, scale: 1.0, bottom: 80, detailed: true, z: 60 },
  { n: 8, scale: 0.74, bottom: 138, detailed: false, z: 50 },
  { n: 12, scale: 0.58, bottom: 182, detailed: false, z: 40 },
  { n: 17, scale: 0.46, bottom: 216, detailed: false, z: 30 },
];

const FRONT_COUNT = ROW_CONFIG[0].n;
const INITIAL_BLUE_DEFEATED = 5;

function buildRoster(side, size, weaponForIdx) {
  const offset = side === 'red' ? 0 : 3;
  return Array.from({ length: size }, (_, idx) => ({
    idx,
    type: TYPES[(idx + offset) % TYPES.length],
    dead: side === 'blue' && idx >= size - INITIAL_BLUE_DEFEATED,
    weapon: idx < FRONT_COUNT ? weaponForIdx(idx) : undefined,
  }));
}

const STARTER_RED_WEAPONS = ['rifle', 'bow', 'javelin', 'karate'];

function freshBlueRoster(size, alienWeaponTier, typeOverride) {
  const weaponId = WEAPONS[alienWeaponTier].id;
  return Array.from({ length: size }, (_, idx) => ({
    idx,
    type: typeOverride || TYPES[(idx + 3) % TYPES.length],
    dead: false,
    weapon: idx < FRONT_COUNT ? weaponId : undefined,
  }));
}

export function useBattle() {
  const [money, setMoney] = useState(2480);
  const [redRoster, setRedRoster] = useState(() =>
    buildRoster('red', TOTAL_SOLDIERS, (i) => STARTER_RED_WEAPONS[i % 4])
  );
  const [blueRoster, setBlueRoster] = useState(() =>
    buildRoster('blue', TOTAL_SOLDIERS, () => 'karate')
  );
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [effects, setEffects] = useState([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [roundResult, setRoundResult] = useState(null); // null | 'won' | 'lost'
  const [alienWeaponTierState, setAlienWeaponTier] = useState(0);
  const [toolboxOpen, setToolboxOpen] = useState(false);
  const effectCounter = useRef(0);

  const redAlive = useMemo(() => redRoster.filter((m) => !m.dead).length, [redRoster]);
  const blueAlive = useMemo(() => blueRoster.filter((m) => !m.dead).length, [blueRoster]);
  const blueDefeated = TOTAL_SOLDIERS - blueAlive;

  const selectSoldier = useCallback((idx) => {
    if (roundResult) return;
    setSelectedIdx((cur) => (cur === idx ? null : idx));
  }, [roundResult]);

  const closePicker = useCallback(() => setSelectedIdx(null), []);

  const addEffect = useCallback((effect) => {
    const id = `fx-${effectCounter.current++}`;
    setEffects((cur) => [...cur, { id, ...effect }]);
  }, []);

  const clearEffect = useCallback((id) => {
    setEffects((cur) => cur.filter((e) => e.id !== id));
  }, []);

  const attack = useCallback((weaponId, blueBattlefieldNow) => {
    if (selectedIdx === null || roundResult) return;
    const soldier = redRoster[selectedIdx];
    const price = weaponPrice(weaponId);
    const alreadyEquipped = soldier.weapon === weaponId;
    const canAfford = alreadyEquipped || price === 0 || money >= price;
    const equippedWeapon = canAfford ? weaponId : soldier.weapon;

    if (canAfford && !alreadyEquipped && price > 0) {
      setMoney((m) => m - price);
    }

    setRedRoster((cur) => {
      const next = [...cur];
      next[selectedIdx] = { ...next[selectedIdx], weapon: equippedWeapon };
      return next;
    });

    const targetIdx = blueRoster.findIndex((m) => !m.dead);
    if (targetIdx !== -1) {
      const target = blueRoster[targetIdx];
      const redType = soldier.type.id;
      const blueType = target.type.id;

      let redWins;
      if (beats(redType, blueType)) redWins = true;
      else if (beats(blueType, redType)) redWins = false;
      else {
        const rTier = weaponTier(equippedWeapon);
        const bTier = weaponTier(target.weapon);
        redWins = rTier === bTier ? Math.random() < 0.5 : rTier > bTier;
      }

      const pos = blueBattlefieldNow.find((b) => b.idx === targetIdx);

      if (redWins) {
        addEffect({ kind: 'poof', left: pos?.left ?? 500, bottom: (pos?.bottom ?? 80) + 40 });
        setMoney((m) => m + BOUNTY_PER_ALIEN);
        setBlueRoster((cur) => {
          const next = [...cur];
          next[targetIdx] = { ...next[targetIdx], dead: true };
          return next;
        });
        if (blueRoster.filter((m, i) => !m.dead && i !== targetIdx).length === 0) {
          setRoundResult('won');
        }
      } else {
        addEffect({ kind: 'oof', left: pos?.left ?? 500, bottom: (pos?.bottom ?? 80) + 40, team: 'red', soldierIdx: selectedIdx });
        setRedRoster((cur) => {
          const next = [...cur];
          next[selectedIdx] = { ...next[selectedIdx], dead: true };
          return next;
        });
        if (redRoster.filter((m, i) => !m.dead && i !== selectedIdx).length === 0) {
          setRoundResult('lost');
        }
      }
    }

    setSelectedIdx(null);
  }, [selectedIdx, redRoster, blueRoster, money, roundResult, addEffect]);

  const buyExtraSoldier = useCallback(() => {
    if (money < EXTRA_SOLDIER_COST) return;
    setMoney((m) => m - EXTRA_SOLDIER_COST);
    setRedRoster((cur) => [
      ...cur,
      { idx: cur.length, type: TYPES[cur.length % TYPES.length], dead: false, weapon: undefined },
    ]);
  }, [money]);

  const upgradeArmyTypes = useCallback(() => {
    if (money < TYPE_UPGRADE_COST) return;
    setMoney((m) => m - TYPE_UPGRADE_COST);
    setRedRoster((cur) =>
      cur.map((m) => {
        if (m.dead) return m;
        const options = evolveOptions(m.type.id);
        if (!options.length) return m;
        return { ...m, type: getNode(options[0]) };
      })
    );
  }, [money]);

  const startNextRound = useCallback(() => {
    const tally = {};
    for (const m of redRoster) {
      if (m.dead) continue;
      tally[m.type.id] = (tally[m.type.id] || 0) + 1;
    }
    const mostCommon = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0];
    const counterId = mostCommon ? counterFor(mostCommon) : null;
    const newAlienTier = Math.min(alienWeaponTierState + 1, WEAPONS.length - 1);

    setAlienWeaponTier(newAlienTier);
    setBlueRoster(freshBlueRoster(TOTAL_SOLDIERS, newAlienTier, counterId ? getNode(counterId) : null));
    setRoundNumber((r) => r + 1);
    setRoundResult(null);
  }, [redRoster, alienWeaponTierState]);

  const retryRound = useCallback(() => {
    setRedRoster((cur) => cur.map((m) => ({ ...m, dead: false })));
    setRoundResult(null);
  }, []);

  const openToolbox = useCallback(() => setToolboxOpen(true), []);
  const closeToolbox = useCallback(() => setToolboxOpen(false), []);

  return {
    money,
    redRoster,
    blueRoster,
    redAlive,
    blueAlive,
    blueDefeated,
    selectedIdx,
    effects,
    roundNumber,
    roundResult,
    alienWeaponTier: alienWeaponTierState,
    toolboxOpen,
    selectSoldier,
    closePicker,
    attack,
    clearEffect,
    buyExtraSoldier,
    upgradeArmyTypes,
    startNextRound,
    retryRound,
    openToolbox,
    closeToolbox,
  };
}
