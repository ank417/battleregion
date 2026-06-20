import { ROW_CONFIG } from '../hooks/useBattle';

export function buildBattlefield(side, roster) {
  const x0 = side === 'red' ? 24 : 548;
  const width = 426;
  const out = [];
  let cursor = 0;

  ROW_CONFIG.forEach((row, rowI) => {
    const isLast = rowI === ROW_CONFIG.length - 1;
    const end = isLast ? roster.length : cursor + row.n;
    const slice = roster.slice(cursor, end).filter((m) => !m.dead);
    cursor = end;
    const n = slice.length;
    slice.forEach((m, i) => {
      const frac = n > 0 ? (i + 0.5) / n : 0.5;
      const left = Math.round(x0 + frac * width);
      out.push({
        idx: m.idx,
        left,
        bottom: row.bottom,
        scale: row.scale,
        flip: side === 'blue',
        z: row.z,
        detailed: row.detailed,
        type: m.type,
        weapon: row.detailed ? m.weapon : undefined,
      });
    });
  });

  return out;
}
