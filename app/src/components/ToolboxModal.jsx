import { WEAPONS, ALL_TYPES, EXTRA_SOLDIER_COST } from '../data/types';

const INK = '#1a1a1a';

function RecruitPicker({ onPick, onBack }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <button
          type="button"
          onClick={onBack}
          style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: INK, lineHeight: 1 }}
        >
          ←
        </button>
        <span style={{ fontFamily: "'Bangers', cursive", fontSize: 17, color: INK }}>CHOOSE A TYPE</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
        {ALL_TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onPick(t.id)}
            title={t.name}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '8px 4px',
              background: '#f4f3ef', border: `3px solid ${INK}`, borderRadius: 9, cursor: 'pointer', font: 'inherit',
            }}
          >
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: '#fff', border: `3px solid ${t.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{t.icon}</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#3a3733', textAlign: 'center', lineHeight: 1.1 }}>{t.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ToolboxModal({ money, recruitPickerOpen, onOpenRecruit, onCloseRecruit, onRecruitSoldier, onClose }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.55)' }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: '#fff', border: `5px solid ${INK}`, borderRadius: 14, boxShadow: `8px 8px 0 ${INK}`, padding: '24px 28px', width: 380 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontFamily: "'Bangers', cursive", fontSize: 26, letterSpacing: '.04em', color: INK }}>🛠 TOOLBOX</div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: INK, lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 13px', background: '#ffe44d', border: `3px solid ${INK}`, borderRadius: 9, width: 'fit-content', marginBottom: 16 }}>
          <span style={{ fontFamily: "'Bangers', cursive", fontSize: 18, color: INK }}>${money.toLocaleString()}</span>
        </div>

        {recruitPickerOpen ? (
          <RecruitPicker onPick={onRecruitSoldier} onBack={onCloseRecruit} />
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              <button
                type="button"
                onClick={onOpenRecruit}
                disabled={money < EXTRA_SOLDIER_COST}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px',
                  background: '#f4f3ef', border: `3px solid ${INK}`, borderRadius: 9, cursor: money < EXTRA_SOLDIER_COST ? 'not-allowed' : 'pointer',
                  opacity: money < EXTRA_SOLDIER_COST ? 0.45 : 1, font: 'inherit',
                }}
              >
                <span style={{ fontWeight: 800, fontSize: 14, color: '#3a3733' }}>👤 Recruit Extra Soldier</span>
                <span style={{ fontWeight: 800, fontSize: 13, color: INK }}>${EXTRA_SOLDIER_COST.toLocaleString()}</span>
              </button>
            </div>

            <div style={{ fontFamily: "'Bangers', cursive", fontSize: 15, color: INK, marginBottom: 8 }}>WEAPON PRICES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {WEAPONS.map((w) => (
                <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#3a3733' }}>
                  <span>{w.icon} {w.label}</span>
                  <span>{w.priceLabel}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
