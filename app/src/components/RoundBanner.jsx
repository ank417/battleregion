const INK = '#1a1a1a';

export default function RoundBanner({ result, roundNumber, onNext, onRetry, onToolbox }) {
  const won = result === 'won';
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.55)' }}>
      <div style={{ background: '#fff', border: `5px solid ${INK}`, borderRadius: 14, boxShadow: `8px 8px 0 ${INK}`, padding: '26px 34px', textAlign: 'center', minWidth: 320 }}>
        <div style={{ fontFamily: "'Bangers', cursive", fontSize: 34, letterSpacing: '.04em', color: won ? '#2a8f4a' : '#e24a4a', WebkitTextStroke: `1.5px ${INK}` }}>
          {won ? `ROUND ${roundNumber} WON!` : `ROUND ${roundNumber} LOST`}
        </div>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 15, color: '#3a3733', margin: '10px 0 18px' }}>
          {won
            ? 'The aliens are regrouping with stronger weapons. Onward!'
            : 'The aliens hold their ground. Visit the toolbox to upgrade before you retry.'}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {!won && (
            <button
              type="button"
              onClick={onToolbox}
              style={{ padding: '10px 18px', background: '#fff', color: INK, border: `3px solid ${INK}`, borderRadius: 9, fontFamily: "'Bangers', cursive", fontSize: 16, cursor: 'pointer' }}
            >
              🛠 TOOLBOX
            </button>
          )}
          <button
            type="button"
            onClick={won ? onNext : onRetry}
            style={{ padding: '10px 22px', background: INK, color: '#ffe44d', border: 'none', borderRadius: 9, fontFamily: "'Bangers', cursive", fontSize: 16, letterSpacing: '.03em', cursor: 'pointer' }}
          >
            {won ? 'NEXT ROUND ▶' : 'RETRY ROUND ↻'}
          </button>
        </div>
      </div>
    </div>
  );
}
