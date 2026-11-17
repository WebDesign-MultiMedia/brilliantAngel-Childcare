import { useLang } from '../i18n/LanguageContext.jsx';
import { siteConfig } from '../config/siteConfig.js';
import { InstagramIcon, MapPinIcon, PhoneIcon, StarIcon, WhatsAppIcon } from './Icons.jsx';

const LINKS = ['home', 'about', 'programs', 'facility', 'reviews', 'contact'];

export default function Footer() {
  const { t } = useLang();
  const f = t.footer;
  const info = siteConfig.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink pt-20 text-white">
      {/* wavy top edge */}
      <svg className="absolute inset-x-0 top-0 h-10 w-full text-cream-100" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true">
        <path fill="currentColor" d="M0 0h1440v16c-120 18-240 24-360 12S840 0 720 8 480 36 360 34 120 14 0 22z" />
      </svg>
      <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky/10 blur-3xl" aria-hidden="true" />

      <div className="container-x relative grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <img src={siteConfig.logoSmall} alt="" width="72" height="72" className="h-[72px] w-[72px] rounded-2xl object-cover ring-2 ring-white/20" />
            <p className="font-display text-xl font-bold leading-tight">
              Brilliant Angel
              <span className="block text-sm font-medium tracking-[0.18em] text-white/60">CHILDCARE</span>
            </p>
          </div>
          <p className="mt-4 max-w-xs text-white/70">{f.tagline}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">
            <span className="flex text-sun">
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} className="h-4 w-4" />
              ))}
            </span>
            {t.trust.rating}
          </p>
        </div>

        <nav aria-label={f.quick}>
          <h2 className="font-display text-lg font-semibold text-sun">{f.quick}</h2>
          <ul className="mt-4 space-y-2.5">
            {LINKS.map((id) => (
              <li key={id}>
                <a href={`#${id}`} className="text-white/75 transition hover:text-white">
                  {t.nav[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-lg font-semibold text-sun">{f.visit}</h2>
          <ul className="mt-4 space-y-3 text-white/75">
            <li>
              <a href={info.mapsDirectionsHref} target="_blank" rel="noopener noreferrer" className="flex gap-2.5 transition hover:text-white">
                <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
                {info.address.full}
              </a>
            </li>
            <li>
              <a href={info.phoneHref} className="flex gap-2.5 transition hover:text-white">
                <PhoneIcon className="h-5 w-5 shrink-0 text-sky" />
                {info.phoneDisplay}
              </a>
            </li>
            <li className="text-sm">
              {t.contact.weekdays}: {t.contact.weekdaysHours}
              <br />
              {t.contact.weekend}: {t.contact.closed}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-sun">{f.follow}</h2>
          <div className="mt-4 flex gap-3">
            <a
              href={info.instagramHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${info.instagramHandle}`}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 transition hover:-translate-y-1 hover:bg-coral hover:text-ink"
            >
              <InstagramIcon className="h-6 w-6" />
            </a>
            <a
              href={info.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 transition hover:-translate-y-1 hover:bg-mint hover:text-ink"
            >
              <WhatsAppIcon className="h-6 w-6" />
            </a>
            <a
              href={info.phoneHref}
              aria-label={info.phoneDisplay}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 transition hover:-translate-y-1 hover:bg-sky hover:text-ink"
            >
              <PhoneIcon className="h-6 w-6" />
            </a>
          </div>
          <p className="mt-3 text-sm text-white/60">{info.instagramHandle}</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-sm text-white/60 sm:flex-row">
          <p>
            © {year} {siteConfig.name}. {f.rights}
          </p>
          <p>{f.madeWith} 💛</p>
        </div>
      </div>
    </footer>
  );
}
