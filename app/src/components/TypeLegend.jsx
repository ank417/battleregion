import { TYPES } from '../data/types';

export default function TypeLegend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', padding: '11px 18px', background: '#ffe44d', borderTop: '5px solid #1a1a1a' }}>
      <span style={{ fontFamily: "'Bangers', cursive", fontSize: 16, color: '#1a1a1a', letterSpacing: '.04em' }}>TYPES</span>
      {TYPES.map((t) => (
        <span key={t.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 23, height: 23, borderRadius: '50%', background: '#fff', border: `3px solid ${t.color}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{t.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#1a1a1a' }}>{t.name}</span>
        </span>
      ))}
    </div>
  );
}
