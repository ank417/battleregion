export const ROW_CONFIG = [
  { n: 5, scale: 1.0, bottom: 80, detailed: true, z: 60 },
  { n: 8, scale: 0.74, bottom: 138, detailed: false, z: 50 },
  { n: 12, scale: 0.58, bottom: 182, detailed: false, z: 40 },
  { n: 17, scale: 0.46, bottom: 216, detailed: false, z: 30 },
];

export function buildBattlefield(side, roster) {
  const x0 = side === 'red' ? 24 : 548;
  const width = 426;
  const out = [];
  const alive = roster.filter((m) => !m.dead);
  let cursor = 0;

  ROW_CONFIG.forEach((row, rowI) => {
    const isLast = rowI === ROW_CONFIG.length - 1;
    const end = isLast ? alive.length : cursor + row.n;
    const slice = alive.slice(cursor, end);
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
