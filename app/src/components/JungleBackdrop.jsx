export default function JungleBackdrop() {
  return (
    <>
      {/* sun + haze */}
      <div style={{ position: 'absolute', right: 120, top: 30, width: 78, height: 78, borderRadius: '50%', background: '#fff1b8', boxShadow: '0 0 0 16px rgba(255,241,184,.35), 0 0 0 32px rgba(255,241,184,.18)', zIndex: 1 }} />

      {/* far Andes mountains */}
      <div style={{ position: 'absolute', left: 60, bottom: 248, width: 300, height: 185, background: '#9ec4c0', clipPath: 'polygon(0 100%, 38% 8%, 64% 100%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', left: 160, bottom: 248, width: 280, height: 150, background: '#a9cfc8', clipPath: 'polygon(0 100%, 50% 14%, 100% 100%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', right: 90, bottom: 248, width: 320, height: 165, background: '#9ec4c0', clipPath: 'polygon(0 100%, 46% 10%, 100% 100%)', zIndex: 1 }} />
      {/* snow caps */}
      <div style={{ position: 'absolute', left: 150, bottom: 368, width: 60, height: 34, background: '#f3fbff', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)', zIndex: 2 }} />
      <div style={{ position: 'absolute', right: 206, bottom: 380, width: 54, height: 30, background: '#f3fbff', clipPath: 'polygon(0 100%, 50% 0, 100% 100%)', zIndex: 2 }} />

      {/* stepped stone pyramid */}
      <div style={{ position: 'absolute', left: 428, bottom: 248, zIndex: 4 }}>
        <div style={{ width: 46, height: 18, margin: '0 auto', background: '#c7a779', border: '3px solid #7a5a36', borderBottom: 'none' }} />
        <div style={{ width: 78, height: 18, margin: '0 auto', background: '#bd9b6a', border: '3px solid #7a5a36', borderBottom: 'none' }} />
        <div style={{ width: 112, height: 18, margin: '0 auto', background: '#c7a779', border: '3px solid #7a5a36', borderBottom: 'none' }} />
        <div style={{ width: 148, height: 20, margin: '0 auto', background: '#bd9b6a', border: '3px solid #7a5a36', borderBottom: 'none' }} />
        <div style={{ position: 'absolute', left: '50%', bottom: 0, transform: 'translateX(-50%)', width: 14, height: 54, background: '#8f7048', borderLeft: '2px solid #5f4628', borderRight: '2px solid #5f4628' }} />
      </div>

      {/* back jungle canopy */}
      <div style={{ position: 'absolute', left: -30, bottom: 230, width: 260, height: 130, borderRadius: '50%', background: '#4aa257', zIndex: 3 }} />
      <div style={{ position: 'absolute', left: 150, bottom: 236, width: 240, height: 120, borderRadius: '50%', background: '#3f9a52', zIndex: 3 }} />
      <div style={{ position: 'absolute', right: 120, bottom: 232, width: 280, height: 135, borderRadius: '50%', background: '#4aa257', zIndex: 3 }} />
      <div style={{ position: 'absolute', right: -40, bottom: 230, width: 240, height: 120, borderRadius: '50%', background: '#3f9a52', zIndex: 3 }} />

      {/* palm trees */}
      <div style={{ position: 'absolute', left: 36, bottom: 236, zIndex: 4 }}>
        <div style={{ width: 16, height: 96, margin: '0 auto', background: '#9c6b3f', border: '3px solid #5f4226', borderRadius: '0 0 6px 6px', transform: 'rotate(-5deg)', transformOrigin: 'bottom' }} />
        <div style={{ position: 'absolute', left: -22, top: -14 }}>
          <div style={{ position: 'absolute', width: 62, height: 24, background: '#3f9a52', border: '3px solid #2a7038', borderRadius: '50%', transform: 'rotate(-28deg)' }} />
          <div style={{ position: 'absolute', width: 62, height: 24, background: '#4aa257', border: '3px solid #2a7038', borderRadius: '50%', transform: 'rotate(18deg)', left: 6 }} />
          <div style={{ position: 'absolute', width: 58, height: 22, background: '#46a35a', border: '3px solid #2a7038', borderRadius: '50%', transform: 'rotate(-6deg)', left: 0, top: -8 }} />
        </div>
      </div>
      <div style={{ position: 'absolute', right: 48, bottom: 238, zIndex: 4 }}>
        <div style={{ width: 16, height: 84, margin: '0 auto', background: '#9c6b3f', border: '3px solid #5f4226', borderRadius: '0 0 6px 6px', transform: 'rotate(5deg)', transformOrigin: 'bottom' }} />
        <div style={{ position: 'absolute', left: -24, top: -12 }}>
          <div style={{ position: 'absolute', width: 60, height: 22, background: '#3f9a52', border: '3px solid #2a7038', borderRadius: '50%', transform: 'rotate(28deg)', left: 8 }} />
          <div style={{ position: 'absolute', width: 60, height: 22, background: '#4aa257', border: '3px solid #2a7038', borderRadius: '50%', transform: 'rotate(-18deg)' }} />
          <div style={{ position: 'absolute', width: 56, height: 20, background: '#46a35a', border: '3px solid #2a7038', borderRadius: '50%', transform: 'rotate(6deg)', left: 4, top: -8 }} />
        </div>
      </div>

      {/* ground */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 250, background: 'linear-gradient(#74c06f 0%, #5aa657 55%, #4f9a4f 100%)', zIndex: 5 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 246, height: 10, background: '#86cf7d', borderBottom: '3px solid #3f7d3f', zIndex: 5 }} />
      {/* winding river */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 30, height: 34, background: '#6fc6e8', borderTop: '3px solid #4a9fc4', borderBottom: '3px solid #4a9fc4', opacity: .55, zIndex: 5, transform: 'skewY(-1deg)' }} />
      {/* grass tufts */}
      <div style={{ position: 'absolute', left: 120, bottom: 236, width: 26, height: 14, background: '#4f9a4f', borderRadius: '50% 50% 0 0', zIndex: 6 }} />
      <div style={{ position: 'absolute', right: 200, bottom: 232, width: 30, height: 16, background: '#4f9a4f', borderRadius: '50% 50% 0 0', zIndex: 6 }} />
      <div style={{ position: 'absolute', left: 460, bottom: 228, width: 24, height: 13, background: '#4f9a4f', borderRadius: '50% 50% 0 0', zIndex: 6 }} />

      {/* hanging vines */}
      <div style={{ position: 'absolute', left: 240, top: 0, width: 4, height: 84, background: '#3f8a48', transformOrigin: 'top', animation: 'vinesway 5s ease-in-out infinite', zIndex: 7 }}>
        <div style={{ position: 'absolute', bottom: -6, left: -6, width: 16, height: 10, background: '#4aa257', borderRadius: '50%' }} />
      </div>
      <div style={{ position: 'absolute', right: 300, top: 0, width: 4, height: 62, background: '#3f8a48', transformOrigin: 'top', animation: 'vinesway 6s ease-in-out infinite .5s', zIndex: 7 }}>
        <div style={{ position: 'absolute', bottom: -6, left: -6, width: 14, height: 9, background: '#4aa257', borderRadius: '50%' }} />
      </div>

      {/* foreground framing leaves */}
      <div style={{ position: 'absolute', left: -30, bottom: -26, width: 150, height: 130, background: '#2f7a3e', border: '4px solid #1f5a2c', borderRadius: '60% 0 60% 60%', transform: 'rotate(20deg)', animation: 'sway 6s ease-in-out infinite', zIndex: 80 }}>
        <div style={{ position: 'absolute', left: '50%', top: 14, width: 3, height: 80, background: '#1f5a2c', transform: 'translateX(-50%) rotate(-12deg)' }} />
      </div>
      <div style={{ position: 'absolute', right: -34, bottom: -30, width: 150, height: 130, background: '#2f7a3e', border: '4px solid #1f5a2c', borderRadius: '0 60% 60% 60%', transform: 'rotate(-20deg)', animation: 'sway 6.5s ease-in-out infinite .4s', zIndex: 80 }}>
        <div style={{ position: 'absolute', left: '50%', top: 14, width: 3, height: 80, background: '#1f5a2c', transform: 'translateX(-50%) rotate(12deg)' }} />
      </div>
    </>
  );
}
