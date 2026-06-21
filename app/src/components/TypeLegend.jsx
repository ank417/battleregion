const INK = '#1a1a1a';

import { ALL_TYPES } from '../data/types';

export default function TypeLegend() {
  return (
    <div style={{
      width: 200, flex: 'none', background: '#ffe44d', border: `5px solid ${INK}`, borderRadius: 4,
      boxShadow: '0 18px 50px rgba(0,0,0,.45)', padding: '14px 14px', maxHeight: '90vh', overflowY: 'auto',
    }}>
      <div style={{ fontFamily: "'Bangers', cursive", fontSize: 17, color: INK, letterSpacing: '.04em', marginBottom: 10 }}>TYPE LEGEND</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {ALL_TYPES.map((t) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 24, height: 24, flex: 'none', borderRadius: '50%', background: '#fff', border: `2px solid ${t.color}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{t.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: INK }}>{t.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
