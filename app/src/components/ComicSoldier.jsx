const SKIN = '#f6cda0';
const INK = '#1a1a1a';

export default function ComicSoldier({ team, type, weapon, selected = false, onClick }) {
  const isRed = team === 'red';
  const uniform = isRed ? '#e24a4a' : '#3a86e0';
  const uniformDark = isRed ? '#b23434' : '#2657aa';

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        width: 64,
        height: 104,
        fontFamily: "'Nunito', sans-serif",
        cursor: onClick ? 'pointer' : 'default',
        filter: selected ? 'drop-shadow(0 0 0 3px #ffe44d) drop-shadow(0 0 10px #ffe44d)' : 'none',
      }}
    >
      {/* back arm */}
      <div style={{ position: 'absolute', left: 7, top: 46, width: 10, height: 26, borderRadius: 6, background: uniformDark, border: `3px solid ${INK}`, zIndex: 1 }} />

      {/* legs */}
      <div style={{ position: 'absolute', left: 19, top: 74, width: 11, height: 24, borderRadius: '0 0 4px 4px', background: uniformDark, border: `3px solid ${INK}`, zIndex: 2 }} />
      <div style={{ position: 'absolute', left: 34, top: 74, width: 11, height: 24, borderRadius: '0 0 4px 4px', background: uniformDark, border: `3px solid ${INK}`, zIndex: 2 }} />
      {/* boots */}
      <div style={{ position: 'absolute', left: 13, top: 93, width: 19, height: 9, borderRadius: 5, background: '#2a2a2a', border: `2px solid ${INK}`, zIndex: 3 }} />
      <div style={{ position: 'absolute', left: 32, top: 93, width: 19, height: 9, borderRadius: 5, background: '#2a2a2a', border: `2px solid ${INK}`, zIndex: 3 }} />

      {/* torso */}
      <div style={{ position: 'absolute', left: 15, top: 42, width: 34, height: 36, borderRadius: 11, background: uniform, border: `3px solid ${INK}`, zIndex: 4 }} />
      {/* chest type shield */}
      <div style={{ position: 'absolute', left: 22, top: 49, width: 20, height: 23, borderRadius: '6px 6px 10px 10px', background: '#fff', border: `3px solid ${type.color}`, zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, lineHeight: 1 }}>{type.icon}</div>

      {/* front arm */}
      <div style={{ position: 'absolute', left: 44, top: 46, width: 10, height: 22, borderRadius: 6, background: uniform, border: `3px solid ${INK}`, zIndex: 6 }} />
      {/* hand */}
      <div style={{ position: 'absolute', left: 45, top: 62, width: 13, height: 13, borderRadius: '50%', background: SKIN, border: `3px solid ${INK}`, zIndex: 9 }} />

      {/* WEAPONS */}
      {weapon === 'rifle' && (
        <>
          <div style={{ position: 'absolute', left: 40, top: 56, width: 36, height: 9, borderRadius: 2, background: '#2f2f2f', border: `2px solid ${INK}`, transform: 'rotate(-7deg)', zIndex: 8 }} />
          <div style={{ position: 'absolute', left: 44, top: 64, width: 7, height: 12, borderRadius: '0 0 3px 3px', background: '#5a3a22', border: `2px solid ${INK}`, zIndex: 7 }} />
        </>
      )}
      {weapon === 'bow' && (
        <>
          <div style={{ position: 'absolute', left: 54, top: 44, width: 18, height: 44, border: '4px solid #7a4a26', borderRadius: '50%', borderRightColor: 'transparent', zIndex: 8 }} />
          <div style={{ position: 'absolute', left: 57, top: 46, width: 2, height: 40, background: '#caa86a', zIndex: 8 }} />
        </>
      )}
      {weapon === 'javelin' && (
        <>
          <div style={{ position: 'absolute', left: 34, top: 28, width: 5, height: 58, background: '#9c6b3f', border: '2px solid #5a3a1a', transform: 'rotate(-40deg)', transformOrigin: 'center', zIndex: 8 }} />
          <div style={{ position: 'absolute', left: 62, top: 30, width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '13px solid #c7c7c7', transform: 'rotate(50deg)', zIndex: 8 }} />
        </>
      )}
      {weapon === 'karate' && (
        <>
          <div style={{ position: 'absolute', left: 6, top: 40, width: 13, height: 13, borderRadius: '50%', background: SKIN, border: `3px solid ${INK}`, zIndex: 9 }} />
          <div style={{ position: 'absolute', left: 50, top: 30, fontSize: 13, zIndex: 9, transform: 'rotate(12deg)' }}>✨</div>
        </>
      )}

      {/* HEAD: red soldier */}
      {isRed && (
        <>
          <div style={{ position: 'absolute', left: 18, top: 16, width: 28, height: 28, borderRadius: '50%', background: SKIN, border: `3px solid ${INK}`, zIndex: 5 }} />
          <div style={{ position: 'absolute', left: 24, top: 28, width: 4, height: 4, borderRadius: '50%', background: INK, zIndex: 6 }} />
          <div style={{ position: 'absolute', left: 33, top: 28, width: 4, height: 4, borderRadius: '50%', background: INK, zIndex: 6 }} />
          <div style={{ position: 'absolute', left: 14, top: 6, width: 36, height: 20, borderRadius: '18px 18px 2px 2px', background: uniform, border: `3px solid ${INK}`, zIndex: 6 }} />
          <div style={{ position: 'absolute', left: 12, top: 23, width: 40, height: 6, borderRadius: 3, background: uniformDark, border: `2px solid ${INK}`, zIndex: 7 }} />
        </>
      )}
      {/* HEAD: blue alien */}
      {!isRed && (
        <>
          <div style={{ position: 'absolute', left: 21, top: 0, width: 3, height: 13, background: INK, transformOrigin: 'bottom', animation: 'wig 2s ease-in-out infinite', zIndex: 4 }} />
          <div style={{ position: 'absolute', left: 18, top: -4, width: 9, height: 9, borderRadius: '50%', background: '#7fd4ff', border: `2px solid ${INK}`, zIndex: 5 }} />
          <div style={{ position: 'absolute', left: 40, top: 0, width: 3, height: 13, background: INK, transformOrigin: 'bottom', animation: 'wig 2s ease-in-out infinite .3s', zIndex: 4 }} />
          <div style={{ position: 'absolute', left: 37, top: -4, width: 9, height: 9, borderRadius: '50%', background: '#7fd4ff', border: `2px solid ${INK}`, zIndex: 5 }} />
          <div style={{ position: 'absolute', left: 17, top: 12, width: 30, height: 30, borderRadius: '50%', background: uniform, border: `3px solid ${INK}`, zIndex: 5 }} />
          <div style={{ position: 'absolute', left: 22, top: 22, width: 9, height: 9, borderRadius: '50%', background: '#fff', border: `2px solid ${INK}`, zIndex: 6 }} />
          <div style={{ position: 'absolute', left: 33, top: 22, width: 9, height: 9, borderRadius: '50%', background: '#fff', border: `2px solid ${INK}`, zIndex: 6 }} />
          <div style={{ position: 'absolute', left: 25, top: 25, width: 4, height: 4, borderRadius: '50%', background: '#1a2a44', zIndex: 7 }} />
          <div style={{ position: 'absolute', left: 36, top: 25, width: 4, height: 4, borderRadius: '50%', background: '#1a2a44', zIndex: 7 }} />
        </>
      )}
    </div>
  );
}
