export default function RosterBar({ side, members, label, sublabel }) {
  const headerColor = side === 'red' ? '#b23434' : '#2657aa';
  const bg = side === 'red' ? '#fff3f3' : '#eef4ff';
  const borderTop = side === 'red' ? '5px solid #1a1a1a' : '4px solid #1a1a1a';

  return (
    <div style={{ padding: '10px 16px', background: bg, borderTop }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <span style={{ fontFamily: "'Bangers', cursive", fontSize: 15, color: headerColor, letterSpacing: '.04em' }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: headerColor }}>{sublabel}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {members.map((m, i) => (
          <div
            key={i}
            style={{
              position: 'relative', width: 27, height: 31, background: '#fff',
              border: '2px solid #1a1a1a', borderRadius: 5, display: 'flex',
              alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden',
              opacity: m.dead ? 0.45 : 1,
            }}
          >
            <div style={{ position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)', width: 13, height: 13, borderRadius: '50%', background: side === 'red' ? '#f6cda0' : '#3a86e0', border: '2px solid #1a1a1a' }} />
            {side === 'red' ? (
              <div style={{ position: 'absolute', top: 1, left: '50%', transform: 'translateX(-50%)', width: 17, height: 8, borderRadius: '6px 6px 0 0', background: '#e24a4a', border: '2px solid #1a1a1a' }} />
            ) : (
              <>
                <div style={{ position: 'absolute', top: 0, left: 7, width: 2, height: 5, background: '#1a1a1a' }} />
                <div style={{ position: 'absolute', top: 0, right: 7, width: 2, height: 5, background: '#1a1a1a' }} />
              </>
            )}
            <div style={{ width: 14, height: 14, borderRadius: '5px 5px 0 0', background: '#fff', border: `2px solid ${m.type.color}`, borderBottom: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8 }}>{m.type.icon}</div>
            {m.dead && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, color: '#b23434', fontWeight: 900 }}>×</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
