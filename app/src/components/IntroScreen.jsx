const INK = '#1a1a1a';

export default function IntroScreen({ onStart }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 36, background: '#1d2a1f', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: 640, background: '#fff', borderRadius: 4, boxShadow: '0 18px 50px rgba(0,0,0,.45)', overflow: 'hidden', border: `5px solid ${INK}`, padding: '32px 36px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Bangers', cursive", fontSize: 42, letterSpacing: '.04em', color: '#2a8f4a', WebkitTextStroke: `1.5px ${INK}`, marginBottom: 6 }}>
          INVASION: SOUTH AMERICA
        </div>
        <div style={{ fontSize: 15, color: '#3a3733', lineHeight: 1.6, margin: '14px 0 22px' }}>
          A rift has torn open above the Andes. Wave after wave of alien soldiers are pouring
          into the jungle below, each one carrying a type of elemental power passed down
          through their own kind — pure, unevolving, and fiercely territorial.
          <br /><br />
          You command a line of <b>42 human volunteers</b>, every one of them starting unarmed
          and untrained, fighting bare-handed with karate alone. Earn bounty for every alien
          you defeat, spend it on better weapons and fresh recruits between engagements, and
          push the invaders back one line at a time.
          <br /><br />
          Each line of soldiers fights it out together — when the fighting pauses, sort out
          your front line's weapons before sending the next one in.
        </div>
        <button
          type="button"
          onClick={onStart}
          style={{ padding: '12px 28px', background: INK, color: '#ffe44d', border: 'none', borderRadius: 9, fontFamily: "'Bangers', cursive", fontSize: 19, letterSpacing: '.04em', cursor: 'pointer' }}
        >
          ⚔ START THE DEFENSE
        </button>
        <div style={{ fontSize: 12, color: '#7a7773', marginTop: 10 }}>or press Enter / Space</div>
      </div>
    </div>
  );
}
