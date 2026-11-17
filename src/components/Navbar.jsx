import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { siteConfig } from '../config/siteConfig.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useBooking } from '../booking.js';
import LanguageToggle from './LanguageToggle.jsx';
import { CloseIcon, MenuIcon, PhoneIcon, SparkleIcon } from './Icons.jsx';

const SECTIONS = ['home', 'about', 'programs', 'facility', 'reviews', 'contact'];

export default function Navbar() {
  const { t } = useLang();
  const { openBooking } = useBooking();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the section currently in view.
  useEffect(() => {
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const book = () => {
    setOpen(false);
    openBooking();
  };

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/85 shadow-soft backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-[76px] items-center justify-between gap-4" aria-label="Main">
        <a href="#home" className="flex shrink-0 items-center gap-2.5" aria-label={siteConfig.name}>
          <img
            src={siteConfig.logoSmall}
            alt=""
            width="64"
            height="64"
            className="h-16 w-16 rounded-2xl object-cover shadow-soft ring-2 ring-white transition-transform duration-300 hover:-rotate-3 hover:scale-105"
          />
          <span className="font-display text-lg font-bold leading-[1.05] text-ink">
            Brilliant Angel
            <span className="block text-xs font-medium tracking-[0.18em] text-ink-mute">CHILDCARE</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`relative rounded-full px-3 py-2 text-[15px] font-semibold transition-colors xl:px-4 ${
                  active === id ? 'text-ink' : 'text-ink-mute hover:text-ink'
                }`}
              >
                {active === id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-sun-soft"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                {t.nav[id]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageToggle className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={book}
            className="hidden animate-glow items-center gap-2 rounded-2xl bg-sun px-5 py-2.5 font-display font-semibold text-ink transition-transform hover:-translate-y-0.5 active:translate-y-0.5 md:inline-flex"
          >
            <SparkleIcon className="h-4 w-4" />
            {t.nav.bookTour}
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-soft ring-1 ring-cream-200 lg:hidden"
            aria-label={t.nav.menu}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>
    </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={t.nav.menu}
              className="fixed inset-y-0 right-0 z-[60] flex w-[86%] max-w-sm flex-col bg-cream p-6 shadow-card lg:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <div className="flex items-center justify-between">
                <LanguageToggle />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-2xl bg-white shadow-soft"
                  aria-label={t.nav.close}
                >
                  <CloseIcon className="h-6 w-6" />
                </button>
              </div>
              <ul className="mt-8 space-y-1">
                {SECTIONS.map((id, i) => (
                  <motion.li
                    key={id}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                  >
                    <a
                      href={`#${id}`}
                      onClick={() => setOpen(false)}
                      className={`block rounded-2xl px-4 py-3 font-display text-2xl font-semibold ${
                        active === id ? 'bg-sun-soft text-ink' : 'text-ink-soft'
                      }`}
                    >
                      {t.nav[id]}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-auto space-y-3">
                <button type="button" onClick={book} className="btn-sun w-full">
                  <SparkleIcon className="h-5 w-5" />
                  {t.nav.bookTour}
                </button>
                <a href={siteConfig.contact.phoneHref} className="btn-white w-full">
                  <PhoneIcon className="h-5 w-5" />
                  {siteConfig.contact.phoneDisplay}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
