import { ALL_TYPES } from '../data/types';

export default function TypeLegend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 18px', background: '#ffe44d', borderTop: '5px solid #1a1a1a' }}>
      <span style={{ fontFamily: "'Bangers', cursive", fontSize: 16, color: '#1a1a1a', letterSpacing: '.04em' }}>TYPES</span>
      {ALL_TYPES.map((t) => (
        <span key={t.id} title={t.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <span style={{ width: 19, height: 19, borderRadius: '50%', background: '#fff', border: `2px solid ${t.color}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>{t.icon}</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#1a1a1a' }}>{t.name}</span>
        </span>
      ))}
    </div>
  );
}
