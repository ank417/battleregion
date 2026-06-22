export const FRONT_COUNT = 5;

const FRONT_BOTTOM = 80;
const FRONT_SPAN = 130;
export const FRONT_GAP = 90; // gap between the two front lines before they lunge to clash
export const FRONT_LUNGE = FRONT_GAP / 2; // each side lunges this far, meeting exactly at the centerline

const RESERVE_ROWS = [
  { n: 8, scale: 0.74, bottom: 138, z: 50 },
  { n: 12, scale: 0.58, bottom: 182, z: 40 },
  { n: 17, scale: 0.46, bottom: 216, z: 30 },
];

export function buildBattlefield(side, roster) {
  const isRed = side === 'red';
  const alive = roster.filter((m) => !m.dead);
  const front = alive.slice(0, FRONT_COUNT);
  const rest = alive.slice(FRONT_COUNT);
  const out = [];

  const frontN = front.length;
  const nearEdge = isRed ? 500 - FRONT_GAP / 2 : 500 + FRONT_GAP / 2;
  const startX = isRed ? nearEdge - FRONT_SPAN : nearEdge;
  front.forEach((m, i) => {
    const frac = frontN > 0 ? (i + 0.5) / frontN : 0.5;
    const left = Math.round(startX + frac * FRONT_SPAN);
    out.push({
      idx: m.idx,
      left,
      bottom: FRONT_BOTTOM,
      scale: 1.0,
      flip: !isRed,
      z: 60,
      detailed: true,
      type: m.type,
      weapon: m.weapon,
    });
  });

  const x0 = isRed ? 24 : 548;
  const width = 426;
  let cursor = 0;
  RESERVE_ROWS.forEach((row, rowI) => {
    const isLast = rowI === RESERVE_ROWS.length - 1;
    const end = isLast ? rest.length : cursor + row.n;
    const slice = rest.slice(cursor, end);
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
        flip: !isRed,
        z: row.z,
        detailed: false,
        type: m.type,
        weapon: undefined,
      });
    });
  });

  return out;
}
