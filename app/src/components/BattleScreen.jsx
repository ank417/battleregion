import { useEffect } from 'react';
import JungleBackdrop from './JungleBackdrop';
import ComicSoldier from './ComicSoldier';
import SimpleSoldier from './SimpleSoldier';
import WeaponPicker from './WeaponPicker';
import RosterBar from './RosterBar';
import TypeLegend from './TypeLegend';
import RoundBanner from './RoundBanner';
import ToolboxModal from './ToolboxModal';
import { useBattle } from '../hooks/useBattle';
import { buildBattlefield } from '../lib/ranks';

const INK = '#1a1a1a';

function Effect({ kind, left, bottom, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, [onDone]);
  const isPoof = kind === 'poof';
  return (
    <div style={{ position: 'absolute', left, bottom, transform: 'translateX(-50%)', zIndex: 220, textAlign: 'center', pointerEvents: 'none', animation: 'poof-pop .9s ease-out forwards' }}>
      <div style={{ fontFamily: "'Bangers', cursive", fontSize: 26, color: '#fff', WebkitTextStroke: '2px #1a1a1a' }}>{isPoof ? 'POOF!' : 'OOF!'}</div>
      {isPoof && <div style={{ fontFamily: "'Bangers', cursive", fontSize: 18, color: '#ffe44d', WebkitTextStroke: '2px #1a1a1a' }}>+$100</div>}
    </div>
  );
}

export default function BattleScreen() {
  const battle = useBattle();
  const {
    money, redRoster, blueRoster,
    redAlive, blueAlive, blueDefeated,
    selectedIdx, effects,
    roundNumber, roundResult, toolboxOpen, recruitPickerOpen,
    selectSoldier, closePicker, setWeapon, clearEffect,
    openRecruit, closeRecruit, recruitSoldier, startNextRound, retryRound,
    openToolbox, closeToolbox,
  } = battle;

  const redBattlefield = buildBattlefield('red', redRoster);
  const blueBattlefield = buildBattlefield('blue', blueRoster);

  const handlePick = (weaponId) => setWeapon(weaponId);

  const selectedSoldier = selectedIdx !== null ? redRoster[selectedIdx] : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 36, background: '#1d2a1f', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ width: 1000, background: '#fff', borderRadius: 4, boxShadow: '0 18px 50px rgba(0,0,0,.45)', overflow: 'hidden', border: `5px solid ${INK}`, position: 'relative' }}>

        {/* HUD */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: '#ffe44d', borderBottom: `5px solid ${INK}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 15px', background: '#fff', border: `3px solid ${INK}`, borderRadius: 9, boxShadow: `3px 3px 0 ${INK}` }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#ffd34d', border: `3px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: '#7a5a12', fontFamily: "'Nunito', sans-serif" }}>$</div>
            <div style={{ fontFamily: "'Bangers', cursive", fontSize: 20, color: INK, letterSpacing: '.04em' }}>{money.toLocaleString()}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 13px', background: '#e24a4a', border: `3px solid ${INK}`, borderRadius: 9 }}>
            <div style={{ width: 13, height: 13, background: '#fff', border: `2px solid ${INK}` }} />
            <div style={{ fontFamily: "'Bangers', cursive", fontSize: 19, color: '#fff' }}>{redAlive}</div>
          </div>
          <div style={{ fontFamily: "'Bangers', cursive", fontSize: 21, color: INK }}>VS</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 13px', background: '#2a6fdb', border: `3px solid ${INK}`, borderRadius: 9 }}>
            <div style={{ width: 13, height: 13, background: '#fff', border: `2px solid ${INK}` }} />
            <div style={{ fontFamily: "'Bangers', cursive", fontSize: 19, color: '#fff' }}>{blueAlive}</div>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 7, padding: '5px 12px', background: '#fff', border: `3px solid ${INK}`, borderRadius: 9 }}>
            <span style={{ fontFamily: "'Bangers', cursive", fontSize: 15, color: INK, letterSpacing: '.03em', whiteSpace: 'nowrap' }}>ROUND {roundNumber} · SOUTH AMERICA</span>
          </div>
          <button
            type="button"
            onClick={openToolbox}
            style={{ flex: 'none', padding: '8px 16px', background: INK, color: '#ffe44d', border: 'none', borderRadius: 9, fontFamily: "'Bangers', cursive", fontSize: 17, letterSpacing: '.04em', whiteSpace: 'nowrap', cursor: 'pointer' }}
          >
            🛠 TOOLBOX
          </button>
        </div>

        {/* JUNGLE BATTLEFIELD */}
        <div style={{ position: 'relative', height: 472, overflow: 'hidden', background: 'linear-gradient(#9fdcff 0%, #c4ecf6 30%, #e6f6cf 58%, #d6f0c2 60%)' }}>
          <JungleBackdrop />

          {redBattlefield.map((s) => (
            <div key={`r-${s.idx}`} style={{ position: 'absolute', left: s.left, bottom: s.bottom, transform: `scale(${s.scale})`, transformOrigin: 'bottom center', zIndex: s.z }}>
              {s.detailed ? (
                <ComicSoldier team="red" type={s.type} weapon={s.weapon} selected={selectedIdx === s.idx} onClick={() => selectSoldier(s.idx)} />
              ) : (
                <SimpleSoldier team="red" type={s.type} />
              )}
            </div>
          ))}
          {blueBattlefield.map((s) => (
            <div key={`b-${s.idx}`} style={{ position: 'absolute', left: s.left, bottom: s.bottom, transform: `scale(${s.scale})${s.flip ? ' scaleX(-1)' : ''}`, transformOrigin: 'bottom center', zIndex: s.z }}>
              {s.detailed ? (
                <ComicSoldier team="blue" type={s.type} weapon={s.weapon} />
              ) : (
                <SimpleSoldier team="blue" type={s.type} />
              )}
            </div>
          ))}

          {effects.map((e) => (
            <Effect key={e.id} kind={e.kind} left={e.left} bottom={e.bottom} onDone={() => clearEffect(e.id)} />
          ))}

          {selectedIdx !== null && (
            <>
              <div onClick={closePicker} style={{ position: 'absolute', inset: 0, zIndex: 150 }} />
              <div style={{ position: 'absolute', left: 18, top: 16, padding: '6px 13px', background: INK, color: '#ffe44d', borderRadius: 7, fontFamily: "'Bangers', cursive", fontSize: 16, letterSpacing: '.05em', zIndex: 200 }}>
                ❙❙ PAUSED · PICK A WEAPON
              </div>
              <WeaponPicker currentWeapon={selectedSoldier?.weapon} money={money} onPick={handlePick} />
            </>
          )}

          {roundResult && (
            <RoundBanner
              result={roundResult}
              roundNumber={roundNumber}
              onNext={startNextRound}
              onRetry={retryRound}
              onToolbox={openToolbox}
            />
          )}
        </div>

        {/* ROSTER BARS */}
        <RosterBar
          side="red"
          members={redRoster}
          label="YOUR ARMY"
          sublabel={`${redAlive} ready · tap a soldier to send them to the front`}
        />
        <RosterBar
          side="blue"
          members={blueRoster}
          label="ALIEN ARMY"
          sublabel={`${blueAlive} left · ${blueDefeated} defeated`}
        />

        <TypeLegend />
      </div>

      {toolboxOpen && (
        <ToolboxModal
          money={money}
          recruitPickerOpen={recruitPickerOpen}
          onOpenRecruit={openRecruit}
          onCloseRecruit={closeRecruit}
          onRecruitSoldier={recruitSoldier}
          onClose={closeToolbox}
        />
      )}
    </div>
  );
}
