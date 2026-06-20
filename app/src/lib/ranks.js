import { ROW_CONFIG } from '../hooks/useBattle';

const FRONT_WEAPONS = ['rifle', 'bow', 'javelin', 'karate'];

export function buildBattlefield(side, roster, frontWeapons) {
  const x0 = side === 'red' ? 24 : 548;
  const width = 426;
  const out = [];
  let cursor = 0;

  ROW_CONFIG.forEach((row) => {
    const slice = roster.slice(cursor, cursor + row.n).filter((m) => !m.dead);
    cursor += row.n;
    const n = slice.length;
    slice.forEach((m, i) => {
      const frac = n > 0 ? (i + 0.5) / n : 0.5;
      const left = Math.round(x0 + frac * width);
      const weapon = row.detailed
        ? (side === 'red' ? frontWeapons[m.idx] : FRONT_WEAPONS[(m.idx + 3) % 4])
        : undefined;
      out.push({
        idx: m.idx,
        left,
        bottom: row.bottom,
        scale: row.scale,
        flip: side === 'blue',
        z: row.z,
        detailed: row.detailed,
        type: m.type,
        weapon,
      });
    });
  });

  return out;
}
