import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { fill, useLang } from '../i18n/LanguageContext.jsx';
import { siteConfig } from '../config/siteConfig.js';
import { PROGRAM_THEME } from './ProgramsSection.jsx';
import { CalendarIcon, CheckIcon, ChevronLeft, CloseIcon, ExternalIcon, PhoneIcon, WhatsAppIcon } from './Icons.jsx';

const EMPTY = { program: null, day: null, window: null, name: '', phone: '', notes: '' };

const slide = {
  enter: (d) => ({ opacity: 0, x: d * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (d) => ({ opacity: 0, x: d * -40 }),
};

/** Format digits as (123) 456-7890 while typing. */
function formatPhone(v) {
  const d = v.replace(/\D/g, '').replace(/^1(?=\d{10})/, '').slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

function Choice({ selected, onClick, children, className = '', hideCheck = false }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileTap={{ scale: 0.96 }}
      className={`relative rounded-2xl p-4 text-left transition-all ${
        selected
          ? 'bg-white shadow-card ring-[3px] ring-sun-deep'
          : 'bg-white/70 ring-1 ring-cream-200 hover:bg-white hover:ring-cream-200'
      } ${className}`}
    >
      {children}
      {selected && !hideCheck && (
        <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-sun-deep text-white">
          <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
      )}
    </motion.button>
  );
}

export default function BookingModal({ open, initialProgram, onClose }) {
  const { t, lang } = useLang();
  const b = t.booking;
  const [step, setStep] = useState(0); // 0..2 form steps, 3 = done
  const [dir, setDir] = useState(1);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const dialogRef = useRef(null);

  // Reset each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setStep(0);
    setDir(1);
    setErrors({});
    setData({ ...EMPTY, program: initialProgram });
  }, [open, initialProgram]);

  // Scroll lock, Esc to close, focus management + simple focus trap.
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const raf = requestAnimationFrame(() => dialogRef.current?.focus());
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && dialogRef.current) {
        const els = dialogRef.current.querySelectorAll(
          'button:not([disabled]), a[href], input, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open, onClose]);

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const go = (to) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const canNext = step === 0 ? !!data.program : step === 1 ? !!(data.day && data.window) : true;

  const submit = () => {
    const errs = {};
    if (data.name.trim().length < 2) errs.name = b.errName;
    if (data.phone.replace(/\D/g, '').length < 10) errs.phone = b.errPhone;
    setErrors(errs);
    if (Object.keys(errs).length === 0) go(3);
  };

  const program = t.programs.list.find((p) => p.id === data.program);
  const windowObj = b.windows.find((w) => w.id === data.window);

  const waHref = useMemo(() => {
    if (step !== 3) return siteConfig.contact.whatsappHref;
    const msg = fill(b.waMsg, {
      name: data.name.trim(),
      phone: data.phone,
      program: program ? `${program.name} (${program.ages})` : '',
      day: data.day ? b.daysLong[data.day] : '',
      window: windowObj ? `${windowObj.label}, ${windowObj.range}` : '',
      notes: data.notes.trim() ? fill(b.waNotes, { notes: data.notes.trim() }) : '',
    });
    return `${siteConfig.contact.whatsappHref}?text=${encodeURIComponent(msg)}`;
  }, [step, data, b, program, windowObj]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/40 backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            tabIndex={-1}
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="relative flex max-h-[94svh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] bg-cream shadow-2xl outline-none sm:rounded-[2rem]"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-sun-soft via-cream to-sky-soft px-6 pb-5 pt-6 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold text-ink-mute">
                    <CalendarIcon className="h-4 w-4" />
                    {step < 3 ? fill(b.stepOf, { n: step + 1 }) : siteConfig.name}
                  </p>
                  <h2 id="booking-title" className="mt-1 text-3xl font-bold text-ink">
                    {b.title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={b.close}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white shadow-soft transition hover:scale-105"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              {step < 3 && (
                <ol className="mt-5 grid grid-cols-3 gap-2">
                  {b.steps.map((label, i) => (
                    <li key={label}>
                      <div className="h-2 overflow-hidden rounded-full bg-white">
                        <motion.div
                          className="h-full rounded-full bg-sun-deep"
                          initial={false}
                          animate={{ width: i <= step ? '100%' : '0%' }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                      <span className={`mt-1.5 block text-xs font-semibold ${i <= step ? 'text-ink' : 'text-ink-mute'}`}>
                        {label}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </div>

            {/* Body */}
            <div className="relative flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 sm:px-8">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {step === 0 && (
                    <fieldset>
                      <legend className="font-display text-xl font-semibold text-ink">{b.ageQ}</legend>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {t.programs.list.map((p) => {
                          const th = PROGRAM_THEME[p.id];
                          return (
                            <Choice key={p.id} selected={data.program === p.id} onClick={() => set('program', p.id)}>
                              <span className={`grid h-11 w-11 place-items-center rounded-xl text-2xl ${th.bg}`} aria-hidden="true">
                                {th.emoji}
                              </span>
                              <span className="mt-3 block pr-5 font-display font-semibold leading-tight text-ink">{p.name}</span>
                              <span className={`mt-0.5 block text-sm font-semibold ${th.text}`}>{p.ages}</span>
                            </Choice>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}

                  {step === 1 && (
                    <div className="space-y-7">
                      <fieldset>
                        <legend className="font-display text-xl font-semibold text-ink">{b.dayQ}</legend>
                        <div className="mt-4 grid grid-cols-5 gap-2">
                          {siteConfig.hours.weekdays.map((d) => (
                            <Choice
                              key={d}
                              selected={data.day === d}
                              onClick={() => set('day', d)}
                              hideCheck
                              className="!px-0 !py-4 text-center"
                            >
                              <span className="block text-center font-display text-lg font-semibold">{b.days[d]}</span>
                            </Choice>
                          ))}
                        </div>
                      </fieldset>
                      <fieldset>
                        <legend className="font-display text-xl font-semibold text-ink">{b.timeQ}</legend>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          {b.windows.map((w) => (
                            <Choice key={w.id} selected={data.window === w.id} onClick={() => set('window', w.id)}>
                              <span className="block font-display font-semibold text-ink">{w.label}</span>
                              <span className="text-sm text-ink-mute">{w.range}</span>
                            </Choice>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  )}

                  {step === 2 && (
                    <form
                      className="space-y-4"
                      noValidate
                      onSubmit={(e) => {
                        e.preventDefault();
                        submit();
                      }}
                    >
                      <div>
                        <label htmlFor="bk-name" className="text-sm font-semibold text-ink">
                          {b.name}
                        </label>
                        <input
                          id="bk-name"
                          type="text"
                          autoComplete="name"
                          value={data.name}
                          onChange={(e) => set('name', e.target.value)}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'bk-name-err' : undefined}
                          className="mt-1.5 w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-base shadow-soft ring-1 ring-cream-200 focus:outline-none focus:ring-[3px] focus:ring-sky"
                        />
                        {errors.name && (
                          <p id="bk-name-err" className="mt-1.5 text-sm font-semibold text-coral-deep">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="bk-phone" className="text-sm font-semibold text-ink">
                          {b.phone}
                        </label>
                        <input
                          id="bk-phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="(646) 555-0123"
                          value={data.phone}
                          onChange={(e) => set('phone', formatPhone(e.target.value))}
                          aria-invalid={!!errors.phone}
                          aria-describedby={errors.phone ? 'bk-phone-err' : undefined}
                          className="mt-1.5 w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-base shadow-soft ring-1 ring-cream-200 focus:outline-none focus:ring-[3px] focus:ring-sky"
                        />
                        {errors.phone && (
                          <p id="bk-phone-err" className="mt-1.5 text-sm font-semibold text-coral-deep">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="bk-notes" className="text-sm font-semibold text-ink">
                          {b.notes}
                        </label>
                        <textarea
                          id="bk-notes"
                          rows={3}
                          placeholder={b.notesPh}
                          value={data.notes}
                          onChange={(e) => set('notes', e.target.value)}
                          className="mt-1.5 w-full resize-none rounded-2xl border-0 bg-white px-4 py-3.5 text-base shadow-soft ring-1 ring-cream-200 focus:outline-none focus:ring-[3px] focus:ring-sky"
                        />
                      </div>
                      <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
                    </form>
                  )}

                  {step === 3 && (
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                        className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-mint text-ink shadow-card ring-8 ring-mint-soft"
                      >
                        <CheckIcon className="h-10 w-10" strokeWidth={3} />
                      </motion.div>
                      <h3 className="mt-5 text-2xl font-bold text-ink">{b.doneTitle}</h3>
                      <p className="mx-auto mt-2 max-w-sm text-ink-soft">{b.doneText}</p>

                      <dl className="mt-6 space-y-2 rounded-2xl bg-white p-5 text-left text-sm shadow-soft ring-1 ring-cream-200">
                        <dt className="sr-only">{b.summary}</dt>
                        {[
                          [b.steps[0], program ? `${program.name} · ${program.ages}` : ''],
                          [b.steps[1], `${b.daysLong[data.day] ?? ''} · ${windowObj?.range ?? ''}`],
                          [b.name, data.name],
                          [b.phone, data.phone],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between gap-4">
                            <dt className="text-ink-mute">{k}</dt>
                            <dd className="text-right font-semibold text-ink">{v}</dd>
                          </div>
                        ))}
                      </dl>

                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-push mt-6 w-full bg-[#25D366] text-white shadow-[0_6px_0_0_#128C7E] hover:-translate-y-0.5 active:shadow-[0_2px_0_0_#128C7E]"
                      >
                        <WhatsAppIcon className="h-6 w-6" />
                        {b.sendWa}
                      </a>
                      <p className="mt-4 text-sm text-ink-soft">
                        {b.orCall}{' '}
                        <a href={siteConfig.contact.phoneHref} className="inline-flex items-center gap-1 font-semibold text-sky-deep underline-offset-2 hover:underline">
                          <PhoneIcon className="h-3.5 w-3.5" />
                          {siteConfig.contact.phoneDisplay}
                        </a>
                      </p>
                      <a
                        href={siteConfig.contact.onlineBookingHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-ink-mute underline-offset-2 hover:text-ink hover:underline"
                      >
                        {b.orOnline}
                        <ExternalIcon className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-cream-200 bg-white/60 px-6 py-4 sm:px-8">
              {step > 0 && step < 3 ? (
                <button type="button" onClick={() => go(step - 1)} className="inline-flex items-center gap-1 rounded-xl px-3 py-2 font-semibold text-ink-soft hover:bg-cream-100">
                  <ChevronLeft className="h-5 w-5" />
                  {b.back}
                </button>
              ) : (
                <span />
              )}
              {step < 2 && (
                <button type="button" onClick={() => go(step + 1)} disabled={!canNext} className="btn-sun !py-3 disabled:pointer-events-none disabled:opacity-40">
                  {b.next}
                </button>
              )}
              {step === 2 && (
                <button type="button" onClick={submit} className="btn-sun !py-3">
                  {b.submit}
                </button>
              )}
              {step === 3 && (
                <button type="button" onClick={onClose} className="btn-white !py-3">
                  {b.done}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
