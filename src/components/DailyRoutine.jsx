import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '../i18n/LanguageContext.jsx';
import SectionHeading from './SectionHeading.jsx';
import {
  AppleIcon,
  BookIcon,
  ChevronLeft,
  ChevronRight,
  CoffeeIcon,
  HeartIcon,
  MoonIcon,
  MusicIcon,
  PaletteIcon,
  TreeIcon,
} from './Icons.jsx';

const SLOT_STYLE = [
  { icon: CoffeeIcon, color: 'bg-sun', soft: 'bg-sun-soft', emoji: '🥣' },
  { icon: BookIcon, color: 'bg-sky', soft: 'bg-sky-soft', emoji: '📚' },
  { icon: PaletteIcon, color: 'bg-coral', soft: 'bg-coral-soft', emoji: '🎨' },
  { icon: AppleIcon, color: 'bg-mint', soft: 'bg-mint-soft', emoji: '🥗' },
  { icon: MoonIcon, color: 'bg-sky', soft: 'bg-sky-soft', emoji: '😴' },
  { icon: TreeIcon, color: 'bg-mint', soft: 'bg-mint-soft', emoji: '🛝' },
  { icon: MusicIcon, color: 'bg-coral', soft: 'bg-coral-soft', emoji: '🎵' },
  { icon: HeartIcon, color: 'bg-sun', soft: 'bg-sun-soft', emoji: '🏡' },
];

export default function DailyRoutine() {
  const { t } = useLang();
  const d = t.day;
  const [i, setI] = useState(0);
  const last = d.slots.length - 1;
  const slot = d.slots[i];
  const style = SLOT_STYLE[i];
  const Icon = style.icon;
  const pct = (i / last) * 100;

  return (
    <section id="routine" className="section-y relative overflow-hidden">
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-sky-soft blur-3xl" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading eyebrow={d.eyebrow} title={d.title} sub={d.sub} dot="bg-mint" />

        <div className="mx-auto mt-14 max-w-5xl">
          {/* Timeline track with clickable stops */}
          <div className="relative sm:px-6">
            <div className="relative">
            {/* track runs between the centers of the first and last stops */}
            <div className="absolute left-[18px] right-[18px] top-[14px] h-2 rounded-full bg-cream-200 sm:left-7 sm:right-7 sm:top-6" aria-hidden="true">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-sun via-coral to-sky"
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              />
            </div>
            <ol className="relative flex justify-between">
              {d.slots.map((s, idx) => {
                const st = SLOT_STYLE[idx];
                const on = idx === i;
                const passed = idx <= i;
                return (
                  <li key={s.time} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => setI(idx)}
                      aria-label={`${s.time}: ${s.title}`}
                      aria-current={on ? 'step' : undefined}
                      className={`relative grid h-9 w-9 place-items-center rounded-full text-base transition-all duration-300 sm:h-14 sm:w-14 sm:text-2xl ${
                        on
                          ? `${st.color} scale-110 shadow-card ring-4 ring-white`
                          : passed
                            ? `${st.soft} ring-2 ring-white`
                            : 'bg-white ring-2 ring-cream-200 hover:scale-105'
                      }`}
                    >
                      <span aria-hidden="true">{st.emoji}</span>
                      {on && (
                        <motion.span
                          layoutId="routine-ring"
                          className="absolute -inset-2 rounded-full border-2 border-dashed border-ink/20"
                          animate={{ rotate: 360 }}
                          transition={{ rotate: { duration: 12, repeat: Infinity, ease: 'linear' } }}
                        />
                      )}
                    </button>
                    <span
                      className={`mt-3 hidden text-xs font-bold sm:block ${on ? 'text-ink' : 'text-ink-mute'}`}
                    >
                      {s.time}
                    </span>
                  </li>
                );
              })}
            </ol>
            </div>
          </div>

          {/* Scrubber */}
          <div className="mt-8 sm:px-6">
            <label htmlFor="routine-scrubber" className="sr-only">
              {d.title}
            </label>
            <input
              id="routine-scrubber"
              type="range"
              min={0}
              max={last}
              step={1}
              value={i}
              onChange={(e) => setI(Number(e.target.value))}
              aria-valuetext={`${slot.time}: ${slot.title}`}
              className="h-3 w-full cursor-pointer appearance-none rounded-full bg-cream-200 accent-sun-deep"
            />
          </div>

          {/* Detail card */}
          <div className="mt-10 grid items-stretch gap-4 sm:grid-cols-[auto_1fr_auto]">
            <button
              type="button"
              onClick={() => setI((v) => Math.max(0, v - 1))}
              disabled={i === 0}
              aria-label={d.prev}
              className="btn-white hidden h-14 w-14 self-center !p-0 disabled:opacity-40 sm:inline-flex"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="relative min-h-[220px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="card flex h-full flex-col gap-6 overflow-hidden p-7 sm:flex-row sm:items-center sm:p-9"
                >
                  <div className={`relative grid h-28 w-28 shrink-0 place-items-center rounded-[2rem] ${style.soft}`}>
                    <motion.span
                      className="text-6xl"
                      aria-hidden="true"
                      initial={{ rotate: -20, scale: 0.6 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 12 }}
                    >
                      {style.emoji}
                    </motion.span>
                    <span className={`absolute -bottom-2 -right-2 grid h-10 w-10 place-items-center rounded-xl ${style.color} text-ink shadow-soft`}>
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-ink-mute">{slot.time}</p>
                    <h3 className="mt-1 text-3xl font-bold text-ink">{slot.title}</h3>
                    <p className="mt-3 max-w-xl text-lg leading-relaxed text-ink-soft">{slot.text}</p>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>

            <div className="flex justify-between gap-4 sm:contents">
              <button
                type="button"
                onClick={() => setI((v) => Math.max(0, v - 1))}
                disabled={i === 0}
                aria-label={d.prev}
                className="btn-white h-14 flex-1 !p-0 disabled:opacity-40 sm:hidden"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => setI((v) => Math.min(last, v + 1))}
                disabled={i === last}
                aria-label={d.next}
                className="btn-white h-14 flex-1 self-center !p-0 disabled:opacity-40 sm:w-14 sm:flex-none"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
