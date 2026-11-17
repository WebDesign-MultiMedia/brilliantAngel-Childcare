import { motion } from 'framer-motion';
import { useLang } from '../i18n/LanguageContext.jsx';

export default function LanguageToggle({ className = '' }) {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="radiogroup"
      aria-label={t.nav.langLabel}
      className={`relative inline-flex rounded-full bg-cream-100 p-1 ring-1 ring-cream-200 ${className}`}
    >
      {['en', 'es'].map((code) => {
        const active = lang === code;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLang(code)}
            className={`relative z-10 w-11 rounded-full py-1.5 font-display text-sm font-semibold uppercase transition-colors ${
              active ? 'text-ink' : 'text-ink-mute hover:text-ink'
            }`}
          >
            {active && (
              <motion.span
                layoutId="lang-thumb"
                className="absolute inset-0 -z-10 rounded-full bg-white shadow-soft ring-1 ring-cream-200"
                transition={{ type: 'spring', stiffness: 500, damping: 32 }}
              />
            )}
            {code}
          </button>
        );
      })}
    </div>
  );
}
