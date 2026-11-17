import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useBooking } from '../booking.js';
import { siteConfig } from '../config/siteConfig.js';
import { CameraIcon, ShieldIcon, SparkleIcon, StarIcon } from './Icons.jsx';

// The three.js bundle is only downloaded on devices that will render it.
const Scene3D = lazy(() => import('./Scene3D.jsx'));

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

/** Decide whether to render the live 3D scene or the lightweight fallback. */
function use3D() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 768px)');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const gl = supportsWebGL();
    const update = () => setEnabled(gl && wide.matches && !calm.matches);
    update();
    wide.addEventListener('change', update);
    calm.addEventListener('change', update);
    return () => {
      wide.removeEventListener('change', update);
      calm.removeEventListener('change', update);
    };
  }, []);
  return enabled;
}

/** Fall back to the 2D illustration if WebGL throws at runtime. */
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** 2D animated illustration: mobile / reduced-motion / no-WebGL fallback. */
function HeroFallback() {
  const blocks = [
    { ch: 'A', bg: 'bg-sky', x: '8%', y: '62%', r: -12, d: 0 },
    { ch: 'B', bg: 'bg-coral', x: '72%', y: '58%', r: 10, d: 0.6 },
    { ch: '1', bg: 'bg-mint', x: '26%', y: '76%', r: 6, d: 1.1 },
    { ch: 'C', bg: 'bg-sun', x: '56%', y: '76%', r: -8, d: 0.3 },
  ];
  const clouds = [
    { x: '4%', y: '10%', w: 'w-28', d: 0 },
    { x: '64%', y: '6%', w: 'w-32', d: 1.2 },
    { x: '74%', y: '34%', w: 'w-20', d: 0.6 },
  ];
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className={`absolute ${c.w} aspect-[2.2/1]`}
          style={{ left: c.x, top: c.y }}
          animate={{ x: [0, 14, 0] }}
          transition={{ duration: 7 + i, repeat: Infinity, ease: 'easeInOut', delay: c.d }}
        >
          <svg viewBox="0 0 220 100" className="h-full w-full drop-shadow-sm">
            <path
              d="M50 90h120a35 35 0 0 0 0-70 48 48 0 0 0-88-6A38 38 0 0 0 50 90z"
              fill="#fff"
            />
          </svg>
        </motion.div>
      ))}

      <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2">
      <motion.div
        className="relative"
        animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-sun/40 blur-2xl" />
        <svg viewBox="0 0 120 130" className="h-40 w-40 sm:h-48 sm:w-48">
          <ellipse cx="60" cy="14" rx="26" ry="7" fill="none" stroke="#FFD166" strokeWidth="6" />
          <path
            d="M60 28l9.4 19 21 3.1-15.2 14.8 3.6 20.9L60 75.9l-18.8 9.9 3.6-20.9L29.6 50.1l21-3.1z"
            transform="translate(0 6) scale(1.0)"
            fill="#FFD166"
            stroke="#E8AE2A"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
      </div>

      {blocks.map((b) => (
        <motion.div
          key={b.ch}
          className={`absolute grid h-16 w-16 place-items-center rounded-2xl ${b.bg} font-display text-3xl font-bold text-ink shadow-[inset_0_-6px_0_rgba(0,0,0,0.12),0_12px_20px_-10px_rgba(30,41,59,0.4)] ring-4 ring-white/60 sm:h-20 sm:w-20 sm:text-4xl`}
          style={{ left: b.x, top: b.y, rotate: b.r }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: b.d }}
        >
          {b.ch}
        </motion.div>
      ))}
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Hero3D() {
  const { t, lang } = useLang();
  const { openBooking } = useBooking();
  const enable3D = use3D();
  const sceneRef = useRef(null);
  const [inView, setInView] = useState(true);
  const [fontsReady, setFontsReady] = useState(false);

  // Pause the render loop when the hero scrolls out of view.
  useEffect(() => {
    if (!sceneRef.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(sceneRef.current);
    return () => io.disconnect();
  }, []);

  // Wait (briefly) for Fredoka so block letters render in the brand font.
  useEffect(() => {
    let done = false;
    const finish = () => !done && (done = true, setFontsReady(true));
    const timer = setTimeout(finish, 1500);
    document.fonts?.load('700 150px Fredoka').then(finish, finish) ?? finish();
    return () => clearTimeout(timer);
  }, []);

  const words = [t.hero.titleA, t.hero.titleB, t.hero.titleC];

  return (
    <section id="home" className="relative overflow-hidden pt-[76px]">
      {/* soft background shapes */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-sky-soft blur-3xl" />
        <div className="absolute -right-24 top-40 h-[28rem] w-[28rem] rounded-full bg-sun-soft blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-coral-soft/70 blur-3xl" />
        <div className="bg-dots absolute inset-0 opacity-60" />
      </div>

      <div className="container-x grid items-center gap-10 pb-16 pt-8 sm:pt-12 lg:min-h-[calc(100svh-76px)] lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:pb-20">
        {/* Left column */}
        <div className="relative z-10">
          <motion.span variants={fadeUp} initial="hidden" animate="show" className="eyebrow">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint-deep" />
            </span>
            {t.hero.badge}
          </motion.span>

          <h1 key={lang} className="mt-6 text-[2.6rem] font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl xl:text-7xl">
            {words.map((w, i) => (
              <motion.span key={w} custom={i + 1} variants={fadeUp} initial="hidden" animate="show" className="block">
                {i === 1 ? (
                  <span className="relative inline-block">
                    <span className="relative z-10">{w}</span>
                    <motion.span
                      aria-hidden="true"
                      className="absolute -bottom-1 left-0 -z-0 h-4 w-full origin-left rounded-full bg-sun/70 sm:h-5"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </span>
                ) : i === 2 ? (
                  <span className="bg-gradient-to-r from-sky-deep via-coral-deep to-sun-deep bg-clip-text text-transparent">
                    {w}
                  </span>
                ) : (
                  w
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft sm:text-xl"
          >
            {t.hero.mission}
          </motion.p>

          <motion.ul custom={5} variants={fadeUp} initial="hidden" animate="show" className="mt-6 flex flex-wrap gap-2.5">
            <li className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold shadow-soft ring-1 ring-cream-200">
              <span className="flex text-sun-deep">
                {[0, 1, 2, 3, 4].map((i) => (
                  <StarIcon key={i} className="h-4 w-4" />
                ))}
              </span>
              {t.hero.pillRating}
            </li>
            <li className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold shadow-soft ring-1 ring-cream-200">
              <CameraIcon className="h-4 w-4 text-coral-deep" />
              {t.hero.pillPhotos}
            </li>
            <li className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold shadow-soft ring-1 ring-cream-200">
              <ShieldIcon className="h-4 w-4 text-mint-deep" />
              {t.hero.pillSecure}
            </li>
          </motion.ul>

          <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="mt-9 flex flex-col gap-4 sm:flex-row">
            <button type="button" onClick={() => openBooking()} className="btn-sun">
              <SparkleIcon className="h-5 w-5" />
              {t.hero.ctaTour}
            </button>
            <a href="#programs" className="btn-sky">
              {t.hero.ctaPrograms}
            </a>
          </motion.div>
        </div>

        {/* Right column: 3D scene */}
        <motion.div
          ref={sceneRef}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative aspect-square w-full sm:aspect-[5/4] lg:aspect-square"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-sky-soft via-cream to-sun-soft shadow-card ring-1 ring-white">
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-mint-soft/80 to-transparent" />
            {enable3D && fontsReady ? (
              <SceneBoundary fallback={<HeroFallback />}>
                <Suspense fallback={<HeroFallback />}>
                  <Scene3D active={inView} label={t.a11y.scene} />
                </Suspense>
              </SceneBoundary>
            ) : (
              <HeroFallback />
            )}
          </div>

          {/* floating info chips */}
          <motion.div
            className="absolute -left-2 top-8 hidden items-center gap-3 rounded-2xl bg-white/95 p-3 pr-4 shadow-card ring-1 ring-cream-200 backdrop-blur sm:flex"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-sun-soft font-display text-lg font-bold">
              {siteConfig.rating.score}
            </span>
            <span className="text-sm leading-tight">
              <span className="block font-semibold">{t.trust.rating}</span>
              <span className="text-ink-mute">{t.trust.ratingSub}</span>
            </span>
          </motion.div>
          <motion.div
            className="absolute -right-2 bottom-10 hidden items-center gap-2 rounded-2xl bg-white/95 px-4 py-3 text-sm font-semibold shadow-card ring-1 ring-cream-200 backdrop-blur sm:flex"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-xl" aria-hidden="true">👶</span>
            {t.hero.ages}
          </motion.div>
          {enable3D && (
            <p className="pointer-events-none absolute inset-x-0 bottom-4 text-center text-xs font-semibold text-ink-mute">
              {t.hero.sceneHint}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
