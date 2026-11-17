import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useBooking } from '../booking.js';
import SectionHeading from './SectionHeading.jsx';
import { CheckIcon, SparkleIcon } from './Icons.jsx';

export const PROGRAM_THEME = {
  infants: { emoji: '🍼', bg: 'bg-coral-soft', solid: 'bg-coral', bar: 'bg-coral', text: 'text-coral-deep' },
  toddlers: { emoji: '🧸', bg: 'bg-sun-soft', solid: 'bg-sun', bar: 'bg-sun', text: 'text-sun-deep' },
  preschool: { emoji: '🎨', bg: 'bg-sky-soft', solid: 'bg-sky', bar: 'bg-sky', text: 'text-sky-deep' },
  schoolage: { emoji: '🚀', bg: 'bg-mint-soft', solid: 'bg-mint', bar: 'bg-mint', text: 'text-mint-deep' },
};

export default function ProgramsSection() {
  const { t } = useLang();
  const { openBooking } = useBooking();
  const p = t.programs;
  const [active, setActive] = useState(0);
  const tabsRef = useRef([]);
  const prog = p.list[active];
  const theme = PROGRAM_THEME[prog.id];

  // Arrow-key navigation between tabs (WAI-ARIA tabs pattern).
  const onKeyDown = (e) => {
    const n = p.list.length;
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (active + 1) % n;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (active - 1 + n) % n;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = n - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabsRef.current[next]?.focus();
    }
  };

  return (
    <section id="programs" className="section-y relative bg-cream-100">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading eyebrow={p.eyebrow} title={p.title} sub={p.sub} dot="bg-sky" />

        <div
          role="tablist"
          aria-label={p.title}
          onKeyDown={onKeyDown}
          className="no-scrollbar mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
        >
          {p.list.map((item, i) => {
            const th = PROGRAM_THEME[item.id];
            const selected = i === active;
            return (
              <motion.button
                key={item.id}
                ref={(el) => (tabsRef.current[i] = el)}
                id={`tab-${item.id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${item.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className={`relative rounded-3xl p-4 text-left transition-colors sm:p-5 ${
                  selected ? 'bg-white shadow-card ring-2 ring-ink/10' : 'bg-white/60 ring-1 ring-cream-200 hover:bg-white'
                }`}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl transition-transform ${th.bg} ${
                    selected ? 'scale-110' : ''
                  }`}
                  aria-hidden="true"
                >
                  {th.emoji}
                </span>
                <span className="mt-3 block font-display text-lg font-semibold leading-tight text-ink">{item.name}</span>
                <span className={`mt-1 block text-sm font-semibold ${th.text}`}>{item.ages}</span>
                {selected && (
                  <motion.span
                    layoutId="program-underline"
                    className={`absolute inset-x-5 bottom-0 h-1.5 rounded-t-full ${th.solid}`}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mx-auto mt-8 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={prog.id}
              id={`panel-${prog.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${prog.id}`}
              initial={{ opacity: 0, y: 20, rotateX: -6 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1200 }}
              className="card grid overflow-hidden lg:grid-cols-[1.1fr_1fr]"
            >
              <div className="p-7 sm:p-10">
                <div className="flex items-center gap-4">
                  <span className={`grid h-16 w-16 place-items-center rounded-3xl text-4xl ${theme.bg}`} aria-hidden="true">
                    {theme.emoji}
                  </span>
                  <div>
                    <h3 className="text-3xl font-bold text-ink">{prog.name}</h3>
                    <p className={`font-semibold ${theme.text}`}>{prog.ages}</p>
                  </div>
                </div>
                <p className="mt-5 text-lg leading-relaxed text-ink-soft">{prog.blurb}</p>

                <h4 className="mt-7 text-sm font-bold uppercase tracking-wider text-ink-mute">{p.includesLabel}</h4>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                  {prog.features.map((f, i) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.04 }}
                      className="flex items-start gap-2.5 text-[15px] text-ink"
                    >
                      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${theme.solid}`}>
                        <CheckIcon className="h-3 w-3 text-ink" strokeWidth={3} />
                      </span>
                      {f}
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className={`flex flex-col justify-between gap-8 p-7 sm:p-10 ${theme.bg}`}>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-ink-soft">{p.focusLabel}</h4>
                  <ul className="mt-5 space-y-5">
                    {Object.entries(prog.focus).map(([key, val], i) => (
                      <li key={key}>
                        <div className="flex justify-between text-sm font-semibold text-ink">
                          <span>{p.focus[key]}</span>
                        </div>
                        <div className="mt-2 h-3.5 overflow-hidden rounded-full bg-white/80 ring-1 ring-white">
                          <motion.div
                            className={`h-full rounded-full ${theme.solid} shadow-[inset_0_-3px_0_rgba(0,0,0,0.1)]`}
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <button type="button" onClick={() => openBooking(prog.id)} className="btn-white w-full">
                  <SparkleIcon className="h-5 w-5" />
                  {p.cta}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
