import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLang } from '../i18n/LanguageContext.jsx';
import { siteConfig } from '../config/siteConfig.js';
import SectionHeading from './SectionHeading.jsx';
import { ChevronLeft, ChevronRight, ExternalIcon, StarIcon } from './Icons.jsx';

const AVATAR = ['bg-sky', 'bg-coral', 'bg-mint', 'bg-sun', 'bg-sky', 'bg-coral'];

function GoogleG({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function formatDate(iso, lang) {
  if (!iso) return '';
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(lang === 'es' ? 'es-US' : 'en-US', { month: 'short', year: 'numeric' });
}

export default function ReviewsCarousel() {
  const { t, lang } = useLang();
  const r = t.reviews;
  const reviews = siteConfig.reviews;
  const [[index, dir], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (delta) => setState(([i]) => [(i + delta + reviews.length) % reviews.length, delta]),
    [reviews.length],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => go(1), 7000);
    return () => clearInterval(id);
  }, [paused, go]);

  const review = reviews[index];
  const initials = review.name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('');

  return (
    <section id="reviews" className="section-y relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-sun-soft/70 blur-3xl" aria-hidden="true" />
      <div className="container-x relative">
        <SectionHeading eyebrow={r.eyebrow} title={r.title} sub={r.sub} dot="bg-sun" />

        {/* Rating summary */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mx-auto mt-10 flex w-fit items-center gap-4 rounded-3xl bg-white px-6 py-4 shadow-card ring-1 ring-cream-200"
        >
          <GoogleG className="h-9 w-9" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-3xl font-bold">{siteConfig.rating.score}</span>
              <span className="flex text-sun-deep">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 300 }}
                  >
                    <StarIcon className="h-6 w-6" />
                  </motion.span>
                ))}
              </span>
            </div>
            <p className="text-sm font-semibold text-ink-mute">{t.trust.ratingSub}</p>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative mx-auto mt-10 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label={r.title}
        >
          <div className="relative min-h-[360px] sm:min-h-[320px]" style={{ perspective: 1200 }}>
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.figure
                key={index}
                custom={dir}
                variants={{
                  enter: (d) => ({ opacity: 0, x: d * 80, rotateY: d * 12 }),
                  center: { opacity: 1, x: 0, rotateY: 0 },
                  exit: (d) => ({ opacity: 0, x: d * -80, rotateY: d * -12 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.5}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) go(1);
                  else if (info.offset.x > 70) go(-1);
                }}
                aria-roledescription="slide"
                aria-label={`${index + 1} / ${reviews.length}`}
                className="card relative cursor-grab p-8 active:cursor-grabbing sm:p-10"
              >
                <span className="absolute -top-6 left-8 font-display text-8xl leading-none text-sun" aria-hidden="true">
                  “
                </span>
                <div className="flex text-sun-deep" aria-label="5 / 5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <StarIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
                <blockquote
                  lang={review.lang}
                  className="mt-4 text-lg leading-relaxed text-ink sm:text-xl"
                >
                  {review.text}
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-3">
                  <span
                    className={`grid h-12 w-12 place-items-center rounded-full font-display text-lg font-bold text-ink ${AVATAR[index % AVATAR.length]}`}
                    aria-hidden="true"
                  >
                    {review.name === 'Google review' ? 'G' : initials}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-semibold">
                      {review.name === 'Google review' ? r.verified : review.name}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-ink-mute">
                      <GoogleG className="h-4 w-4" />
                      {r.verified}
                      {review.badge && ` · ${review.badge}`}
                      {review.date && ` · ${formatDate(review.date, lang)}`}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <button type="button" onClick={() => go(-1)} aria-label={r.prev} className="btn-white h-12 w-12 !p-0">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setState([i, i > index ? 1 : -1])}
                  aria-label={`${r.goTo} ${i + 1}`}
                  aria-current={i === index || undefined}
                  className={`h-3 rounded-full transition-all duration-300 ${i === index ? 'w-8 bg-sun-deep' : 'w-3 bg-cream-200 hover:bg-sun'}`}
                />
              ))}
            </div>
            <button type="button" onClick={() => go(1)} aria-label={r.next} className="btn-white h-12 w-12 !p-0">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-8 text-center">
            <a
              href={siteConfig.contact.googleReviewsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-semibold text-sky-deep underline-offset-4 hover:underline"
            >
              {r.readAll}
              <ExternalIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
