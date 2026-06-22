import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { ALL_TYPES, TOTAL_SOLDIERS, BOUNTY_PER_ALIEN, EXTRA_SOLDIER_COST, WEAPONS, weaponTier, weaponPrice } from '../data/types';
import { beats, getNode } from '../data/typeTree';
import { buildBattlefield, FRONT_COUNT } from '../lib/ranks';

const GAP_MS = 380;
const ANIM_MS = 480;
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

function shuffle(list) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
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
    screen: 'intro', // 'intro' | 'battle'
    money: 0,
    redRoster: shuffle(buildTypedRoster(TOTAL_SOLDIERS, 'karate', 0)),
    blueRoster: shuffle(buildTypedRoster(TOTAL_SOLDIERS, 'karate', BLUE_TYPE_OFFSET)),
    selectedIdx: null,
    effects: [],
    effectSeq: 0,
    roundNumber: 1,
    roundResult: null, // null | 'won' | 'lost'
    fighting: false,
    alienWeaponTier: 0,
    toolboxOpen: false,
    recruitPickerOpen: false,
    activeRed: [],
    activeBlue: [],
    pendingOutcome: null,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, screen: 'battle' };

    case 'SELECT': {
      if (state.roundResult || state.fighting) return state;
      return { ...state, selectedIdx: state.selectedIdx === action.idx ? null : action.idx };
    }

    case 'CLOSE_PICKER':
      return { ...state, selectedIdx: null };

    case 'SET_WEAPON': {
      if (state.selectedIdx === null || state.fighting) return state;
      const soldier = state.redRoster.find((m) => m.idx === state.selectedIdx);
      if (!soldier) return state;
      const price = weaponPrice(action.weaponId);
      const alreadyEquipped = soldier.weapon === action.weaponId;
      const canAfford = alreadyEquipped || price === 0 || state.money >= price;
      if (!canAfford) return state;
      const money = alreadyEquipped || price === 0 ? state.money : state.money - price;
      const redRoster = state.redRoster.map((m) =>
        m.idx === state.selectedIdx ? { ...m, weapon: action.weaponId } : m
      );
      let effects = state.effects;
      let effectSeq = state.effectSeq;
      if (!alreadyEquipped) {
        const pos = buildBattlefield('red', redRoster).find((p) => p.idx === soldier.idx);
        const weaponDef = WEAPONS.find((w) => w.id === action.weaponId);
        effects = [
          ...state.effects,
          { id: `fx-${state.effectSeq}`, kind: 'equip', left: pos?.left ?? 80, bottom: (pos?.bottom ?? 80) + 100, label: `${weaponDef.icon} EQUIPPED!` },
        ];
        effectSeq = state.effectSeq + 1;
      }
      return { ...state, money, redRoster, selectedIdx: null, effects, effectSeq };
    }

    case 'BEGIN_ROUND': {
      if (state.fighting || state.roundResult || state.toolboxOpen || state.selectedIdx !== null) return state;
      if (frontLine(state.redRoster, FRONT_COUNT).length === 0 || frontLine(state.blueRoster, FRONT_COUNT).length === 0) return state;
      return { ...state, fighting: true };
    }

    case 'ENGAGE': {
      if (!state.fighting || state.pendingOutcome || state.roundResult) return state;
      const redFront = frontLine(state.redRoster, FRONT_COUNT);
      const blueFront = frontLine(state.blueRoster, FRONT_COUNT);
      const pairs = Math.min(redFront.length, blueFront.length);
      if (pairs === 0) return state;

      const redPositions = buildBattlefield('red', state.redRoster);
      const bluePositions = buildBattlefield('blue', state.blueRoster);
      const deadRedIdx = [];
      const deadBlueIdx = [];
      const effectsToAdd = [];
      let moneyGain = 0;

      for (let i = 0; i < pairs; i++) {
        const r = redFront[i];
        const b = blueFront[i];
        if (resolveDuel(r, b)) {
          deadBlueIdx.push(b.idx);
          moneyGain += BOUNTY_PER_ALIEN;
          const pos = bluePositions.find((p) => p.idx === b.idx);
          effectsToAdd.push({ kind: 'poof', left: pos?.left ?? 500, bottom: (pos?.bottom ?? 80) + 40 });
        } else {
          deadRedIdx.push(r.idx);
          const pos = redPositions.find((p) => p.idx === r.idx);
          effectsToAdd.push({ kind: 'oof', left: pos?.left ?? 500, bottom: (pos?.bottom ?? 80) + 40 });
        }
      }

      return {
        ...state,
        activeRed: redFront.slice(0, pairs).map((m) => m.idx),
        activeBlue: blueFront.slice(0, pairs).map((m) => m.idx),
        pendingOutcome: { deadRedIdx, deadBlueIdx, moneyGain, effectsToAdd },
      };
    }

    case 'RESOLVE_ENGAGE': {
      if (!state.pendingOutcome) return state;
      const { deadRedIdx, deadBlueIdx, moneyGain, effectsToAdd } = state.pendingOutcome;
      const deadRedSet = new Set(deadRedIdx);
      const deadBlueSet = new Set(deadBlueIdx);
      const redRoster = deadRedSet.size
        ? state.redRoster.map((m) => (deadRedSet.has(m.idx) ? { ...m, dead: true } : m))
        : state.redRoster;
      const blueRoster = deadBlueSet.size
        ? state.blueRoster.map((m) => (deadBlueSet.has(m.idx) ? { ...m, dead: true } : m))
        : state.blueRoster;
      const money = state.money + moneyGain;
      const effects = [
        ...state.effects,
        ...effectsToAdd.map((e, i) => ({ id: `fx-${state.effectSeq + i}`, ...e })),
      ];
      const effectSeq = state.effectSeq + effectsToAdd.length;

      const redAlive = redRoster.some((m) => !m.dead);
      const blueAlive = blueRoster.some((m) => !m.dead);

      return {
        ...state,
        redRoster, blueRoster, money, effects, effectSeq,
        activeRed: [], activeBlue: [], pendingOutcome: null,
        roundResult: !redAlive || !blueAlive ? (!blueAlive ? 'won' : 'lost') : state.roundResult,
        fighting: redAlive && blueAlive,
      };
    }

    case 'CLEAR_EFFECT':
      return { ...state, effects: state.effects.filter((e) => e.id !== action.id) };

    case 'OPEN_TOOLBOX':
      if (state.fighting) return state;
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
        redRoster: shuffle(state.redRoster.map((m) => ({ ...m, dead: false }))),
        blueRoster: shuffle(buildTypedRoster(TOTAL_SOLDIERS, WEAPONS[alienWeaponTier].id, BLUE_TYPE_OFFSET)),
        alienWeaponTier,
        roundNumber: state.roundNumber + 1,
        roundResult: null,
        fighting: false,
        selectedIdx: null,
        activeRed: [],
        activeBlue: [],
        pendingOutcome: null,
      };
    }

    case 'RETRY_ROUND': {
      if (state.roundResult !== 'lost') return state;
      return {
        ...state,
        redRoster: shuffle(state.redRoster.map((m) => ({ ...m, dead: false }))),
        blueRoster: shuffle(buildTypedRoster(TOTAL_SOLDIERS, WEAPONS[state.alienWeaponTier].id, BLUE_TYPE_OFFSET)),
        roundResult: null,
        fighting: false,
        selectedIdx: null,
        activeRed: [],
        activeBlue: [],
        pendingOutcome: null,
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

  const canBeginRound = !state.fighting && !state.roundResult && !state.toolboxOpen
    && state.selectedIdx === null && redAlive > 0 && blueAlive > 0;

  // drives combat forward continuously: each resolved clash immediately queues the next one
  useEffect(() => {
    if (!state.fighting || state.pendingOutcome || state.roundResult) return;
    const t = setTimeout(() => dispatch({ type: 'ENGAGE' }), GAP_MS);
    return () => clearTimeout(t);
  }, [state.fighting, state.pendingOutcome, state.roundResult, state.redRoster, state.blueRoster]);

  useEffect(() => {
    if (!state.pendingOutcome) return;
    const t = setTimeout(() => dispatch({ type: 'RESOLVE_ENGAGE' }), ANIM_MS);
    return () => clearTimeout(t);
  }, [state.pendingOutcome]);

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
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
  const beginRound = useCallback(() => dispatch({ type: 'BEGIN_ROUND' }), []);

  return {
    ...state,
    redAlive,
    blueAlive,
    blueDefeated,
    canBeginRound,
    startGame,
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
    beginRound,
  };
}
