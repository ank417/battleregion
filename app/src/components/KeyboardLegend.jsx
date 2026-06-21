const INK = '#1a1a1a';

const KEYS = [
  { key: '←  →', label: 'Highlight a front-line soldier' },
  { key: 'Enter', label: 'Open weapon picker for highlighted soldier' },
  { key: 'Esc', label: 'Close weapon picker / toolbox' },
  { key: 'Space', label: "Start the next line's fight" },
];

function Key({ children }) {
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', background: '#fff', color: INK,
      border: `2px solid ${INK}`, borderRadius: 5, fontFamily: 'monospace', fontWeight: 700, fontSize: 12,
    }}>
      {children}
    </span>
  );
}

export default function KeyboardLegend() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap', padding: '9px 18px', background: '#2a2a2a', borderTop: '4px solid #1a1a1a' }}>
      <span style={{ fontFamily: "'Bangers', cursive", fontSize: 14, color: '#ffe44d', letterSpacing: '.04em' }}>KEYS</span>
      {KEYS.map((k) => (
        <span key={k.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
          <Key>{k.key}</Key>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#e8e6e0' }}>{k.label}</span>
        </span>
      ))}
    </div>
  );
}
