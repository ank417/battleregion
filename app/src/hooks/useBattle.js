import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { ALL_TYPES, TOTAL_SOLDIERS, BOUNTY_PER_ALIEN, EXTRA_SOLDIER_COST, WEAPONS, weaponTier, weaponPrice } from '../data/types';
import { beats, getNode } from '../data/typeTree';
import { buildBattlefield, ROW_CONFIG } from '../lib/ranks';

const FRONT_COUNT = ROW_CONFIG[0].n;
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
    redRoster: buildTypedRoster(TOTAL_SOLDIERS, 'karate', 0),
    blueRoster: buildTypedRoster(TOTAL_SOLDIERS, 'karate', BLUE_TYPE_OFFSET),
    selectedIdx: null,
    highlightIdx: null,
    effects: [],
    effectSeq: 0,
    roundNumber: 1,
    roundResult: null, // null | 'won' | 'lost'
    alienWeaponTier: 0,
    toolboxOpen: false,
    recruitPickerOpen: false,
    lineFighting: false,
    lineRedIdx: [],
    lineBlueIdx: [],
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
      if (state.roundResult || state.lineFighting) return state;
      return { ...state, selectedIdx: state.selectedIdx === action.idx ? null : action.idx, highlightIdx: null };
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

    case 'HIGHLIGHT_MOVE': {
      if (state.roundResult || state.lineFighting || state.toolboxOpen || state.selectedIdx !== null) return state;
      const frontRed = frontLine(state.redRoster, FRONT_COUNT);
      if (frontRed.length === 0) return state;
      const cur = state.highlightIdx === null ? -1 : state.highlightIdx;
      const next = Math.min(frontRed.length - 1, Math.max(0, cur + action.dir));
      return { ...state, highlightIdx: next };
    }

    case 'ENTER_SELECT': {
      if (state.roundResult || state.lineFighting || state.highlightIdx === null) return state;
      const frontRed = frontLine(state.redRoster, FRONT_COUNT);
      const target = frontRed[state.highlightIdx];
      if (!target) return state;
      return { ...state, selectedIdx: target.idx };
    }

    case 'START_LINE': {
      if (state.lineFighting || state.roundResult || state.toolboxOpen || state.selectedIdx !== null) return state;
      const redFront = frontLine(state.redRoster, FRONT_COUNT);
      const blueFront = frontLine(state.blueRoster, FRONT_COUNT);
      if (redFront.length === 0 || blueFront.length === 0) return state;
      return {
        ...state,
        lineFighting: true,
        lineRedIdx: redFront.map((m) => m.idx),
        lineBlueIdx: blueFront.map((m) => m.idx),
        highlightIdx: null,
      };
    }

    case 'ENGAGE': {
      if (!state.lineFighting || state.pendingOutcome || state.roundResult) return state;
      const redAliveSet = new Set(state.redRoster.filter((m) => !m.dead).map((m) => m.idx));
      const blueAliveSet = new Set(state.blueRoster.filter((m) => !m.dead).map((m) => m.idx));
      const liveLineRed = state.lineRedIdx.filter((i) => redAliveSet.has(i));
      const liveLineBlue = state.lineBlueIdx.filter((i) => blueAliveSet.has(i));
      if (liveLineRed.length === 0 || liveLineBlue.length === 0) {
        return { ...state, lineFighting: false, lineRedIdx: [], lineBlueIdx: [] };
      }

      const redByIdx = new Map(state.redRoster.map((m) => [m.idx, m]));
      const blueByIdx = new Map(state.blueRoster.map((m) => [m.idx, m]));
      const redPositions = buildBattlefield('red', state.redRoster);
      const bluePositions = buildBattlefield('blue', state.blueRoster);
      const pairs = Math.min(liveLineRed.length, liveLineBlue.length);
      const deadRedIdx = [];
      const deadBlueIdx = [];
      const effectsToAdd = [];
      let moneyGain = 0;

      for (let i = 0; i < pairs; i++) {
        const r = redByIdx.get(liveLineRed[i]);
        const b = blueByIdx.get(liveLineBlue[i]);
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
        activeRed: liveLineRed.slice(0, pairs),
        activeBlue: liveLineBlue.slice(0, pairs),
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
      if (!blueAlive || !redAlive) {
        return {
          ...state,
          redRoster, blueRoster, money, effects, effectSeq,
          roundResult: !blueAlive ? 'won' : 'lost',
          lineFighting: false,
          activeRed: [], activeBlue: [], pendingOutcome: null,
          lineRedIdx: [], lineBlueIdx: [],
        };
      }

      const redAliveSet = new Set(redRoster.filter((m) => !m.dead).map((m) => m.idx));
      const blueAliveSet = new Set(blueRoster.filter((m) => !m.dead).map((m) => m.idx));
      const lineRedAlive = state.lineRedIdx.filter((i) => redAliveSet.has(i));
      const lineBlueAlive = state.lineBlueIdx.filter((i) => blueAliveSet.has(i));
      const lineResolved = lineRedAlive.length === 0 || lineBlueAlive.length === 0;

      return {
        ...state,
        redRoster, blueRoster, money, effects, effectSeq,
        activeRed: [], activeBlue: [], pendingOutcome: null,
        lineFighting: !lineResolved,
        lineRedIdx: lineResolved ? [] : state.lineRedIdx,
        lineBlueIdx: lineResolved ? [] : state.lineBlueIdx,
      };
    }

    case 'CLEAR_EFFECT':
      return { ...state, effects: state.effects.filter((e) => e.id !== action.id) };

    case 'OPEN_TOOLBOX':
      if (state.lineFighting) return state;
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
        selectedIdx: null,
        highlightIdx: null,
        lineFighting: false,
        lineRedIdx: [],
        lineBlueIdx: [],
        activeRed: [],
        activeBlue: [],
        pendingOutcome: null,
      };
    }

    case 'RETRY_ROUND': {
      if (state.roundResult !== 'lost') return state;
      return {
        ...state,
        redRoster: state.redRoster.map((m) => ({ ...m, dead: false })),
        blueRoster: buildTypedRoster(TOTAL_SOLDIERS, WEAPONS[state.alienWeaponTier].id, BLUE_TYPE_OFFSET),
        roundResult: null,
        selectedIdx: null,
        highlightIdx: null,
        lineFighting: false,
        lineRedIdx: [],
        lineBlueIdx: [],
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

  const frontRedNow = useMemo(() => frontLine(state.redRoster, FRONT_COUNT), [state.redRoster]);
  const frontBlueNow = useMemo(() => frontLine(state.blueRoster, FRONT_COUNT), [state.blueRoster]);
  const highlightedIdx = state.highlightIdx !== null && frontRedNow[state.highlightIdx]
    ? frontRedNow[state.highlightIdx].idx
    : null;

  const canStartLine = !state.lineFighting && !state.roundResult && !state.toolboxOpen
    && state.selectedIdx === null && frontRedNow.length > 0 && frontBlueNow.length > 0;

  const paused = state.toolboxOpen || state.selectedIdx !== null || !!state.roundResult || !state.lineFighting;

  // drives each line's clash forward automatically once started, pausing again once it's resolved
  useEffect(() => {
    if (!state.lineFighting || state.pendingOutcome || state.roundResult) return;
    const t = setTimeout(() => dispatch({ type: 'ENGAGE' }), GAP_MS);
    return () => clearTimeout(t);
  }, [state.lineFighting, state.pendingOutcome, state.roundResult]);

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
  const startLine = useCallback(() => dispatch({ type: 'START_LINE' }), []);
  const moveHighlight = useCallback((dir) => dispatch({ type: 'HIGHLIGHT_MOVE', dir }), []);
  const enterSelect = useCallback(() => dispatch({ type: 'ENTER_SELECT' }), []);

  return {
    ...state,
    redAlive,
    blueAlive,
    blueDefeated,
    highlightedIdx,
    canStartLine,
    paused,
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
    startLine,
    moveHighlight,
    enterSelect,
  };
}
