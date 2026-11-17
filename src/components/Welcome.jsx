import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang } from '../i18n/LanguageContext.jsx';
import { siteConfig } from '../config/siteConfig.js';
import './welcome.css';

// Ported from the CSdsgn admin welcome intro, restyled for Brilliant Angel.
// How long the intro plays before it hands over to the site (ms).
// The exit animation (EXIT) runs at the end of TOTAL.
const TOTAL = 3500;
const EXIT = 550;
const REDUCED_TOTAL = 1100;

const COLORS = ['sky', 'sun', 'coral', 'mint'];
const ROW_A = 'BRILLIANT'.split('');
const ROW_B = 'ANGEL'.split('');

const reducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

/** Remember for this browser tab that the intro has already played. */
const SEEN_KEY = 'ba_welcome_seen';
export function welcomeSeen() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1';
  } catch {
    return false;
  }
}
function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    /* private mode: the intro may play again, which is fine */
  }
}

/** First visit on this device says "Welcome", later visits "Welcome back". */
const VISITED_KEY = 'ba_visited';
function hasVisited() {
  try {
    return localStorage.getItem(VISITED_KEY) === '1';
  } catch {
    return false;
  }
}
function markVisited() {
  try {
    localStorage.setItem(VISITED_KEY, '1');
  } catch {
    /* ignore */
  }
}

/**
 * Full-screen 3D welcome shown on the first page view of a session.
 * It sits on top of the site, so everything loads underneath while it plays.
 */
export default function Welcome({ onDone }) {
  const { t } = useLang();
  const w = t.welcome;
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const reduced = useRef(reducedMotion()).current;
  const returning = useRef(hasVisited()).current;

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    setTimeout(onDone, reduced ? 250 : EXIT);
  }, [onDone, reduced]);

  useEffect(() => {
    markSeen();
    markVisited();
    const timer = setTimeout(finish, (reduced ? REDUCED_TOTAL : TOTAL) - (reduced ? 250 : EXIT));
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') finish();
    };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('is-welcome');
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('is-welcome');
    };
  }, [finish, reduced]);

  return (
    <div
      className={`wl${leaving ? ' is-leaving' : ''}${reduced ? ' is-reduced' : ''}`}
      style={{ '--wl-total': `${TOTAL - EXIT}ms` }}
      onClick={finish}
      role="status"
      aria-live="polite"
    >
      <div className="wl-stage" aria-hidden="true">
        <div className="wl-floor" />
        <div className="wl-glow" />
      </div>

      <div className="wl-center">
        <div className="wl-badge" aria-hidden="true">
          <div className="wl-halo" />
          <img src={siteConfig.logo} alt="" width="512" height="512" decoding="async" />
        </div>
        <div className="wl-scene" aria-hidden="true">
          <div className="wl-logo">
            <div className="wl-row wl-row--a">
              {ROW_A.map((ch, i) => (
                <span key={i} className={`wl-l wl-l--${COLORS[i % COLORS.length]}`} style={{ '--i': i }}>
                  {ch}
                </span>
              ))}
            </div>
            <div className="wl-row wl-row--b">
              {ROW_B.map((ch, i) => (
                <span key={i} className="wl-l" style={{ '--i': ROW_A.length + i }}>
                  {ch}
                </span>
              ))}
            </div>
          </div>
          <div className="wl-shadow" />
        </div>

        <p className="wl-title">
          {returning ? w.back : w.first} <span>{w.name}</span>
        </p>
        <p className="wl-sub">{w.sub}</p>
        <div className="wl-bar" aria-hidden="true">
          <span />
        </div>
      </div>

      <button
        type="button"
        className="wl-skip"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
      >
        {w.skip}
      </button>
    </div>
  );
}
