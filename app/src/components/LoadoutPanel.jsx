import { WEAPONS } from '../data/types';
import WeaponPicker from './WeaponPicker';

const INK = '#1a1a1a';

export default function LoadoutPanel({ roster, money, selectedIdx, onSelect, onSetWeapon, onClosePicker, canBegin, onBegin }) {
  const selectedSoldier = selectedIdx !== null ? roster.find((m) => m.idx === selectedIdx) : null;

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.55)' }}>
      <div style={{ background: '#fff', border: `5px solid ${INK}`, borderRadius: 14, boxShadow: `8px 8px 0 ${INK}`, padding: '20px 24px', width: 560, maxHeight: 420, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ fontFamily: "'Bangers', cursive", fontSize: 24, letterSpacing: '.04em', color: INK }}>⚔ PICK YOUR LOADOUT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: '#ffe44d', border: `3px solid ${INK}`, borderRadius: 9 }}>
            <span style={{ fontFamily: "'Bangers', cursive", fontSize: 16, color: INK }}>${money.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 7, paddingRight: 4 }}>
          {roster.map((m) => {
            const weaponDef = WEAPONS.find((w) => w.id === m.weapon);
            return (
              <button
                key={m.idx}
                type="button"
                onClick={() => onSelect(m.idx)}
                title={m.type.name}
                style={{
                  position: 'relative', width: 56, height: 56, padding: 0, cursor: 'pointer',
                  background: '#f4f3ef', border: `3px solid ${INK}`, borderRadius: 9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'inherit',
                }}
              >
                <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: `3px solid ${m.type.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{m.type.icon}</span>
                <span style={{ position: 'absolute', right: -4, bottom: -4, width: 18, height: 18, borderRadius: '50%', background: '#fff', border: `2px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 }}>{weaponDef?.icon}</span>
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onBegin}
            disabled={!canBegin}
            style={{
              padding: '10px 22px', background: INK, color: '#ffe44d', border: 'none', borderRadius: 9,
              fontFamily: "'Bangers', cursive", fontSize: 17, letterSpacing: '.03em',
              cursor: canBegin ? 'pointer' : 'not-allowed', opacity: canBegin ? 1 : 0.5,
            }}
          >
            ⚔ BEGIN BATTLE
          </button>
        </div>

        {selectedSoldier && (
          <>
            <div onClick={onClosePicker} style={{ position: 'fixed', inset: 0, zIndex: 250 }} />
            <WeaponPicker
              currentWeapon={selectedSoldier.weapon}
              money={money}
              onPick={onSetWeapon}
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 260 }}
            />
          </>
        )}
      </div>
    </div>
  );
}
