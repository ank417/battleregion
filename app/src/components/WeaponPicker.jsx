import { WEAPONS } from '../data/types';

export default function WeaponPicker({ currentWeapon, onPick }) {
  return (
    <div style={{ position: 'absolute', left: 272, top: 54, width: 222, background: '#fff', border: '4px solid #1a1a1a', borderRadius: 12, boxShadow: '6px 6px 0 #1a1a1a', padding: 13, zIndex: 200 }}>
      <div style={{ fontFamily: "'Bangers', cursive", fontSize: 19, color: '#1a1a1a', letterSpacing: '.03em', marginBottom: 10, whiteSpace: 'nowrap' }}>PICK A WEAPON!</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {WEAPONS.map((w) => {
          const active = w.id === currentWeapon;
          return (
            <button
              key={w.id}
              onClick={() => onPick(w.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                padding: '8px 11px', background: active ? '#ffe44d' : '#f4f3ef',
                border: '3px solid #1a1a1a', borderRadius: 7, cursor: 'pointer', font: 'inherit',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: active ? 800 : 700, color: active ? '#1a1a1a' : '#3a3733', whiteSpace: 'nowrap' }}>{w.icon} {w.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: w.id === 'karate' ? '#e24a4a' : (active ? '#1a1a1a' : '#3a3733'), whiteSpace: 'nowrap' }}>{w.priceLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
