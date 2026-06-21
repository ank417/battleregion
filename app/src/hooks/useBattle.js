import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { ALL_TYPES, TOTAL_SOLDIERS, BOUNTY_PER_ALIEN, EXTRA_SOLDIER_COST, WEAPONS, weaponTier, weaponPrice } from '../data/types';
import { beats, getNode } from '../data/typeTree';
import { buildBattlefield, ROW_CONFIG } from '../lib/ranks';

const FRONT_COUNT = ROW_CONFIG[0].n;
const TICK_MS = 1200;
const BLUE_TYPE_OFFSET = 7;

// each side gets exactly 2 soldiers of every type (21 types x 2 = 42) — equal power distribution.
function buildTypedRoster(size, weaponId, typeOffset = 0) {
  return Array.from({ length: size }, (_, idx) => ({
    idx,
    type: ALL_TYPES[(idx + typeOffset) % ALL_TYPES.length],
    weapon: weaponId,
    dead: false,
  }));
}

function frontLine(roster, n) {
  return roster.filter((m) => !m.dead).slice(0, n);
}

function resolveDuel(red, blue) {
  if (beats(red.type.id, blue.type.id)) return true;
  if (beats(blue.type.id, red.type.id)) return false;
  const rTier = weaponTier(red.weapon);
  const bTier = weaponTier(blue.weapon);
  return rTier === bTier ? Math.random() < 0.5 : rTier > bTier;
}

function createInitialState() {
  return {
    money: 2480,
    redRoster: buildTypedRoster(TOTAL_SOLDIERS, 'karate', 0),
    blueRoster: buildTypedRoster(TOTAL_SOLDIERS, 'karate', BLUE_TYPE_OFFSET),
    selectedIdx: null,
    effects: [],
    effectSeq: 0,
    roundNumber: 1,
    roundResult: null, // null | 'won' | 'lost'
    alienWeaponTier: 0,
    toolboxOpen: false,
    recruitPickerOpen: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT': {
      if (state.roundResult) return state;
      return { ...state, selectedIdx: state.selectedIdx === action.idx ? null : action.idx };
    }

    case 'CLOSE_PICKER':
      return { ...state, selectedIdx: null };

    case 'SET_WEAPON': {
      if (state.selectedIdx === null) return state;
      const soldier = state.redRoster[state.selectedIdx];
      const price = weaponPrice(action.weaponId);
      const alreadyEquipped = soldier.weapon === action.weaponId;
      const canAfford = alreadyEquipped || price === 0 || state.money >= price;
      if (!canAfford) return state;
      const money = alreadyEquipped || price === 0 ? state.money : state.money - price;
      const redRoster = state.redRoster.map((m, i) =>
        i === state.selectedIdx ? { ...m, weapon: action.weaponId } : m
      );
      return { ...state, money, redRoster, selectedIdx: null };
    }

    case 'TICK': {
      if (state.roundResult) return state;
      const redFront = frontLine(state.redRoster, FRONT_COUNT);
      const blueFront = frontLine(state.blueRoster, FRONT_COUNT);
      const pairs = Math.min(redFront.length, blueFront.length);
      if (pairs === 0) return state;

      const redPositions = buildBattlefield('red', state.redRoster);
      const bluePositions = buildBattlefield('blue', state.blueRoster);
      const deadRed = new Set();
      const deadBlue = new Set();
      let money = state.money;
      const newEffects = [];

      for (let i = 0; i < pairs; i++) {
        const r = redFront[i];
        const b = blueFront[i];
        if (resolveDuel(r, b)) {
          deadBlue.add(b.idx);
          money += BOUNTY_PER_ALIEN;
          const pos = bluePositions.find((p) => p.idx === b.idx);
          newEffects.push({ kind: 'poof', left: pos?.left ?? 500, bottom: (pos?.bottom ?? 80) + 40 });
        } else {
          deadRed.add(r.idx);
          const pos = redPositions.find((p) => p.idx === r.idx);
          newEffects.push({ kind: 'oof', left: pos?.left ?? 500, bottom: (pos?.bottom ?? 80) + 40 });
        }
      }

      const redRoster = deadRed.size
        ? state.redRoster.map((m) => (deadRed.has(m.idx) ? { ...m, dead: true } : m))
        : state.redRoster;
      const blueRoster = deadBlue.size
        ? state.blueRoster.map((m) => (deadBlue.has(m.idx) ? { ...m, dead: true } : m))
        : state.blueRoster;

      const redAlive = redRoster.some((m) => !m.dead);
      const blueAlive = blueRoster.some((m) => !m.dead);
      const roundResult = !blueAlive ? 'won' : !redAlive ? 'lost' : null;

      return {
        ...state,
        money,
        redRoster,
        blueRoster,
        roundResult,
        effects: [
          ...state.effects,
          ...newEffects.map((e, i) => ({ id: `fx-${state.effectSeq + i}`, ...e })),
        ],
        effectSeq: state.effectSeq + newEffects.length,
      };
    }

    case 'CLEAR_EFFECT':
      return { ...state, effects: state.effects.filter((e) => e.id !== action.id) };

    case 'OPEN_TOOLBOX':
      return { ...state, toolboxOpen: true };

    case 'CLOSE_TOOLBOX':
      return { ...state, toolboxOpen: false, recruitPickerOpen: false };

    case 'OPEN_RECRUIT':
      if (state.money < EXTRA_SOLDIER_COST) return state;
      return { ...state, recruitPickerOpen: true };

    case 'CLOSE_RECRUIT':
      return { ...state, recruitPickerOpen: false };

    case 'RECRUIT': {
      if (state.money < EXTRA_SOLDIER_COST) return state;
      const newSoldier = {
        idx: state.redRoster.length,
        type: getNode(action.typeId),
        weapon: 'karate',
        dead: false,
      };
      return {
        ...state,
        money: state.money - EXTRA_SOLDIER_COST,
        redRoster: [...state.redRoster, newSoldier],
        recruitPickerOpen: false,
      };
    }

    case 'NEXT_ROUND': {
      if (state.roundResult !== 'won') return state;
      const alienWeaponTier = Math.min(state.alienWeaponTier + 1, WEAPONS.length - 1);
      return {
        ...state,
        redRoster: state.redRoster.map((m) => ({ ...m, dead: false })),
        blueRoster: buildTypedRoster(TOTAL_SOLDIERS, WEAPONS[alienWeaponTier].id, BLUE_TYPE_OFFSET),
        alienWeaponTier,
        roundNumber: state.roundNumber + 1,
        roundResult: null,
      };
    }

    case 'RETRY_ROUND': {
      if (state.roundResult !== 'lost') return state;
      return {
        ...state,
        redRoster: state.redRoster.map((m) => ({ ...m, dead: false })),
        blueRoster: buildTypedRoster(TOTAL_SOLDIERS, WEAPONS[state.alienWeaponTier].id, BLUE_TYPE_OFFSET),
        roundResult: null,
      };
    }

    default:
      return state;
  }
}

export function useBattle() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);

  const redAlive = useMemo(() => state.redRoster.filter((m) => !m.dead).length, [state.redRoster]);
  const blueAlive = useMemo(() => state.blueRoster.filter((m) => !m.dead).length, [state.blueRoster]);
  const blueDefeated = state.blueRoster.length - blueAlive;

  const paused = state.toolboxOpen || state.selectedIdx !== null || !!state.roundResult;

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), TICK_MS);
    return () => clearInterval(id);
  }, [paused]);

  const selectSoldier = useCallback((idx) => dispatch({ type: 'SELECT', idx }), []);
  const closePicker = useCallback(() => dispatch({ type: 'CLOSE_PICKER' }), []);
  const setWeapon = useCallback((weaponId) => dispatch({ type: 'SET_WEAPON', weaponId }), []);
  const clearEffect = useCallback((id) => dispatch({ type: 'CLEAR_EFFECT', id }), []);
  const openToolbox = useCallback(() => dispatch({ type: 'OPEN_TOOLBOX' }), []);
  const closeToolbox = useCallback(() => dispatch({ type: 'CLOSE_TOOLBOX' }), []);
  const openRecruit = useCallback(() => dispatch({ type: 'OPEN_RECRUIT' }), []);
  const closeRecruit = useCallback(() => dispatch({ type: 'CLOSE_RECRUIT' }), []);
  const recruitSoldier = useCallback((typeId) => dispatch({ type: 'RECRUIT', typeId }), []);
  const startNextRound = useCallback(() => dispatch({ type: 'NEXT_ROUND' }), []);
  const retryRound = useCallback(() => dispatch({ type: 'RETRY_ROUND' }), []);

  return {
    ...state,
    redAlive,
    blueAlive,
    blueDefeated,
    paused,
    selectSoldier,
    closePicker,
    setWeapon,
    clearEffect,
    openToolbox,
    closeToolbox,
    openRecruit,
    closeRecruit,
    recruitSoldier,
    startNextRound,
    retryRound,
  };
}
