const INK = '#1a1a1a';

export default function SimpleSoldier({ team, type }) {
  const isRed = team === 'red';
  return (
    <div style={{ position: 'relative', width: 30, height: 46 }}>
      {isRed ? (
        <>
          <div style={{ position: 'absolute', left: 8, top: 38, width: 6, height: 9, background: '#b23434', border: `2px solid ${INK}` }} />
          <div style={{ position: 'absolute', left: 17, top: 38, width: 6, height: 9, background: '#b23434', border: `2px solid ${INK}` }} />
          <div style={{ position: 'absolute', left: 5, top: 18, width: 20, height: 24, borderRadius: 6, background: '#e24a4a', border: `3px solid ${INK}` }} />
          <div style={{ position: 'absolute', left: 9, top: 24, width: 12, height: 12, borderRadius: '50%', background: '#fff', border: `3px solid ${type.color}` }} />
          <div style={{ position: 'absolute', left: 7, top: 2, width: 16, height: 16, borderRadius: '50%', background: '#f6cda0', border: `3px solid ${INK}` }} />
          <div style={{ position: 'absolute', left: 4, top: -2, width: 22, height: 11, borderRadius: '9px 9px 0 0', background: '#e24a4a', border: `3px solid ${INK}` }} />
        </>
      ) : (
        <>
          <div style={{ position: 'absolute', left: 8, top: 38, width: 6, height: 9, background: '#2657aa', border: `2px solid ${INK}` }} />
          <div style={{ position: 'absolute', left: 17, top: 38, width: 6, height: 9, background: '#2657aa', border: `2px solid ${INK}` }} />
          <div style={{ position: 'absolute', left: 5, top: 18, width: 20, height: 24, borderRadius: 6, background: '#3a86e0', border: `3px solid ${INK}` }} />
          <div style={{ position: 'absolute', left: 9, top: 24, width: 12, height: 12, borderRadius: '50%', background: '#fff', border: `3px solid ${type.color}` }} />
          <div style={{ position: 'absolute', left: 7, top: 3, width: 16, height: 16, borderRadius: '50%', background: '#3a86e0', border: `3px solid ${INK}` }} />
          <div style={{ position: 'absolute', left: 9, top: -3, width: 3, height: 7, background: INK }} />
          <div style={{ position: 'absolute', left: 18, top: -3, width: 3, height: 7, background: INK }} />
        </>
      )}
    </div>
  );
}
