import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useLang } from '../i18n/LanguageContext.jsx';
import { siteConfig } from '../config/siteConfig.js';
import SectionHeading from './SectionHeading.jsx';
import { ChevronLeft, ChevronRight, CloseIcon, EyeIcon, LockIcon, ShieldIcon } from './Icons.jsx';

const SPAN = {
  big: 'col-span-2 row-span-2',
  tall: 'row-span-2',
  wide: 'col-span-2',
};

function Lightbox({ index, onClose, onNav }) {
  const { t, lang } = useLang();
  const f = t.facility;
  const img = siteConfig.gallery[index];
  const total = siteConfig.gallery.length;
  const closeRef = useRef(null);

  useEffect(() => {
    const prevFocus = document.activeElement;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNav(1);
      if (e.key === 'ArrowLeft') onNav(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose, onNav]);

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={img.caption[lang]}
      className="fixed inset-0 z-[80] flex flex-col bg-ink/90 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between p-4 text-white sm:p-6">
        <p className="font-display text-lg font-semibold">
          {index + 1} {f.of} {total}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={f.close}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 transition hover:bg-white/20"
        >
          <CloseIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 sm:px-20" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={index}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) onNav(1);
              else if (info.offset.x > 80) onNav(-1);
            }}
            className="flex max-h-full flex-col items-center"
          >
            <img
              src={img.src}
              alt={img.alt[lang]}
              draggable={false}
              className="max-h-[72vh] w-auto max-w-full select-none rounded-3xl object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center font-display text-xl font-semibold text-white">
              {img.caption[lang]}
              {img.placeholder && <span className="ml-2 text-sm font-normal text-white/60">({f.sample})</span>}
            </figcaption>
          </motion.figure>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => onNav(-1)}
          aria-label={f.prev}
          className="absolute left-2 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-2xl bg-white/10 text-white transition hover:bg-white/25 sm:grid"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
        <button
          type="button"
          onClick={() => onNav(1)}
          aria-label={f.next}
          className="absolute right-2 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center rounded-2xl bg-white/10 text-white transition hover:bg-white/25 sm:grid"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      </div>

      <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto p-4" onClick={(e) => e.stopPropagation()}>
        {siteConfig.gallery.map((g, i) => (
          <button
            key={g.src}
            type="button"
            onClick={() => onNav(i - index)}
            aria-label={`${f.viewLabel} ${i + 1}`}
            aria-current={i === index || undefined}
            className={`h-14 w-14 shrink-0 overflow-hidden rounded-xl transition ${
              i === index ? 'ring-4 ring-sun' : 'opacity-50 hover:opacity-100'
            }`}
          >
            <img src={g.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </motion.div>,
    document.body,
  );
}

export default function FacilityGallery() {
  const { t, lang } = useLang();
  const f = t.facility;
  const [open, setOpen] = useState(null);
  const total = siteConfig.gallery.length;

  const nav = useCallback((delta) => setOpen((i) => (i === null ? i : (i + delta + total) % total)), [total]);
  const close = useCallback(() => setOpen(null), []);

  const features = [
    { icon: LockIcon, label: t.trust.secure, c: 'text-sky-deep bg-sky-soft' },
    { icon: ShieldIcon, label: t.trust.childproof, c: 'text-mint-deep bg-mint-soft' },
    { icon: EyeIcon, label: t.trust.supervision, c: 'text-coral-deep bg-coral-soft' },
  ];

  return (
    <section id="facility" className="section-y relative bg-cream-100">
      <div className="container-x">
        <SectionHeading eyebrow={f.eyebrow} title={f.title} sub={f.sub} dot="bg-coral" />

        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          {features.map(({ icon: Icon, label, c }) => (
            <li key={label} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-soft ring-1 ring-cream-200">
              <span className={`grid h-7 w-7 place-items-center rounded-full ${c}`}>
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-12 grid auto-rows-[150px] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[190px] sm:gap-4 md:grid-cols-4 lg:auto-rows-[220px]">
          {siteConfig.gallery.map((img, i) => (
            <motion.button
              key={img.src}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${f.viewLabel}: ${img.caption[lang]}`}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: (i % 4) * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-3xl bg-cream-200 shadow-soft ring-1 ring-white ${SPAN[img.span] ?? ''}`}
            >
              <img
                src={img.src}
                alt={img.alt[lang]}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-3 left-3 right-3 text-left font-display text-base font-semibold text-white sm:bottom-4 sm:left-4 sm:text-lg">
                {img.caption[lang]}
              </span>
              <span className="absolute right-3 top-3 grid h-9 w-9 scale-75 place-items-center rounded-full bg-white/90 text-ink opacity-0 transition group-hover:scale-100 group-hover:opacity-100">
                <EyeIcon className="h-4 w-4" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>{open !== null && <Lightbox index={open} onClose={close} onNav={nav} />}</AnimatePresence>
    </section>
  );
}
