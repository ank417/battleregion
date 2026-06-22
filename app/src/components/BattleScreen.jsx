import { useEffect } from 'react';
import JungleBackdrop from './JungleBackdrop';
import ComicSoldier from './ComicSoldier';
import SimpleSoldier from './SimpleSoldier';
import RosterBar from './RosterBar';
import TypeLegend from './TypeLegend';
import RoundBanner from './RoundBanner';
import ToolboxModal from './ToolboxModal';
import LoadoutPanel from './LoadoutPanel';
import IntroScreen from './IntroScreen';
import { useBattle } from '../hooks/useBattle';
import { buildBattlefield, FRONT_LUNGE } from '../lib/ranks';
import { BOUNTY_PER_ALIEN } from '../data/types';

const INK = '#1a1a1a';

function Effect({ kind, left, bottom, label, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 900);
    return () => clearTimeout(t);
  }, [onDone]);
  const isPoof = kind === 'poof';
  const isEquip = kind === 'equip';
  const text = isPoof ? '✨ POOF! ✨' : isEquip ? (label || 'EQUIPPED!') : 'OOF!';
  const color = isEquip ? '#2a8f4a' : '#fff';
  return (
    <div style={{ position: 'absolute', left, bottom, transform: 'translateX(-50%)', zIndex: 220, textAlign: 'center', pointerEvents: 'none', animation: 'poof-pop .9s ease-out forwards' }}>
      <div style={{ fontFamily: "'Bangers', cursive", fontSize: isEquip ? 17 : 26, color, WebkitTextStroke: '2px #1a1a1a', whiteSpace: 'nowrap' }}>{text}</div>
      {isPoof && <div style={{ fontFamily: "'Bangers', cursive", fontSize: 18, color: '#ffe44d', WebkitTextStroke: '2px #1a1a1a' }}>{`+$${BOUNTY_PER_ALIEN}`}</div>}
    </div>
  );
}

function Clash({ left, bottom }) {
  return (
    <div style={{ position: 'absolute', left, bottom, transform: 'translate(-50%, -50%)', fontSize: 30, zIndex: 70, pointerEvents: 'none', animation: 'clash-pop .48s ease-out' }}>
      💥
    </div>
  );
}

export default function BattleScreen() {
  const battle = useBattle();
  const {
    screen, money, redRoster, blueRoster,
    redAlive, blueAlive, blueDefeated,
    selectedIdx, effects,
    roundNumber, roundResult, toolboxOpen, recruitPickerOpen,
    fighting, canBeginRound, activeRed, activeBlue,
    startGame, selectSoldier, closePicker, setWeapon, clearEffect,
    openRecruit, closeRecruit, recruitSoldier, startNextRound, retryRound,
    openToolbox, closeToolbox, beginRound,
  } = battle;

  const redBattlefield = buildBattlefield('red', redRoster);
  const blueBattlefield = buildBattlefield('blue', blueRoster);

  const clashPoints = activeRed.map((rIdx, i) => {
    const bIdx = activeBlue[i];
    const rPos = redBattlefield.find((p) => p.idx === rIdx);
    const bPos = blueBattlefield.find((p) => p.idx === bIdx);
    if (!rPos || !bPos) return null;
    return { id: `${rIdx}-${bIdx}`, left: (rPos.left + bPos.left) / 2, bottom: rPos.bottom + 50 };
  }).filter(Boolean);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (screen === 'intro') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          startGame();
        }
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        if (selectedIdx !== null) closePicker();
        else if (toolboxOpen) closeToolbox();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (canBeginRound) beginRound();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [screen, selectedIdx, toolboxOpen, canBeginRound, startGame, closePicker, closeToolbox, beginRound]);

  if (screen === 'intro') {
    return <IntroScreen onStart={startGame} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 36, background: '#1d2a1f', fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
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
            disabled={fighting}
            style={{
              flex: 'none', padding: '8px 16px', background: INK, color: '#ffe44d', border: 'none', borderRadius: 9,
              fontFamily: "'Bangers', cursive", fontSize: 17, letterSpacing: '.04em', whiteSpace: 'nowrap',
              cursor: fighting ? 'not-allowed' : 'pointer', opacity: fighting ? 0.5 : 1,
            }}
          >
            🛠 TOOLBOX
          </button>
        </div>

        {/* JUNGLE BATTLEFIELD */}
        <div style={{ position: 'relative', height: 472, overflow: 'hidden', background: 'linear-gradient(#9fdcff 0%, #c4ecf6 30%, #e6f6cf 58%, #d6f0c2 60%)' }}>
          <JungleBackdrop />

          {redBattlefield.map((s) => {
            const lunge = activeRed.includes(s.idx) ? FRONT_LUNGE : 0;
            return (
              <div
                key={`r-${s.idx}`}
                style={{
                  position: 'absolute', left: s.left, bottom: s.bottom,
                  transition: 'left .6s ease, bottom .6s ease, transform .2s ease',
                  transform: `translateX(${lunge}px) scale(${s.scale})`,
                  transformOrigin: 'bottom center', zIndex: s.z,
                }}
              >
                {s.detailed ? (
                  <ComicSoldier
                    team="red"
                    type={s.type}
                    weapon={s.weapon}
                    attacking={activeRed.includes(s.idx)}
                  />
                ) : (
                  <SimpleSoldier team="red" type={s.type} />
                )}
              </div>
            );
          })}
          {blueBattlefield.map((s) => {
            const lunge = activeBlue.includes(s.idx) ? -FRONT_LUNGE : 0;
            return (
              <div
                key={`b-${s.idx}`}
                style={{
                  position: 'absolute', left: s.left, bottom: s.bottom,
                  transition: 'left .6s ease, bottom .6s ease, transform .2s ease',
                  transform: `translateX(${lunge}px) scale(${s.scale})${s.flip ? ' scaleX(-1)' : ''}`,
                  transformOrigin: 'bottom center', zIndex: s.z,
                }}
              >
                {s.detailed ? (
                  <ComicSoldier team="blue" type={s.type} weapon={s.weapon} attacking={activeBlue.includes(s.idx)} />
                ) : (
                  <SimpleSoldier team="blue" type={s.type} />
                )}
              </div>
            );
          })}

          {clashPoints.map((c) => (
            <Clash key={c.id} left={c.left} bottom={c.bottom} />
          ))}

          {effects.map((e) => (
            <Effect key={e.id} kind={e.kind} left={e.left} bottom={e.bottom} label={e.label} onDone={() => clearEffect(e.id)} />
          ))}

          {!fighting && !roundResult && (
            <LoadoutPanel
              roster={redRoster}
              money={money}
              selectedIdx={selectedIdx}
              onSelect={selectSoldier}
              onSetWeapon={setWeapon}
              onClosePicker={closePicker}
              canBegin={canBeginRound}
              onBegin={beginRound}
            />
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
          sublabel={`${redAlive} ready · set loadouts between rounds`}
        />
        <RosterBar
          side="blue"
          members={blueRoster}
          label="ALIEN ARMY"
          sublabel={`${blueAlive} left · ${blueDefeated} defeated`}
        />
      </div>

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
