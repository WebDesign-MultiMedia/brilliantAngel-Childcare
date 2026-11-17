import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../i18n/LanguageContext.jsx';
import { useBooking } from '../booking.js';
import { siteConfig } from '../config/siteConfig.js';
import SectionHeading from './SectionHeading.jsx';
import { ClockIcon, ExternalIcon, MapPinIcon, PhoneIcon, SparkleIcon, WhatsAppIcon } from './Icons.jsx';

/** Is the center open right now (New York time)? */
function isOpenNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(new Date());
  const day = parts.find((p) => p.type === 'weekday')?.value.toLowerCase().slice(0, 3);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value) % 24;
  const { weekdays, open, close } = siteConfig.hours;
  return weekdays.includes(day) && hour >= open && hour < close;
}

export default function ContactSection() {
  const { t } = useLang();
  const { openBooking } = useBooking();
  const c = t.contact;
  const info = siteConfig.contact;
  const [openNow, setOpenNow] = useState(isOpenNow);

  useEffect(() => {
    const id = setInterval(() => setOpenNow(isOpenNow()), 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="contact" className="section-y relative bg-cream-100">
      <div className="container-x">
        <SectionHeading eyebrow={c.eyebrow} title={c.title} sub={c.sub} dot="bg-mint" />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.25fr]">
          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="card flex flex-col gap-6 p-7 sm:p-9"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <a href={info.phoneHref} className="btn-sky w-full !text-base">
                <PhoneIcon className="h-5 w-5" />
                {c.call}
              </a>
              <a
                href={info.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-push w-full bg-[#25D366] !text-base text-white shadow-[0_6px_0_0_#128C7E] hover:-translate-y-0.5 active:shadow-[0_2px_0_0_#128C7E]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                {c.whatsapp}
              </a>
            </div>

            <div className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-coral-soft text-coral-deep">
                <MapPinIcon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink-mute">{c.addressLabel}</h3>
                <address className="mt-1 not-italic font-display text-xl font-semibold leading-snug text-ink">
                  {info.address.street}
                  <br />
                  {info.address.city}, {info.address.state} {info.address.zip}
                </address>
                <a
                  href={info.mapsDirectionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-sm font-semibold text-sky-deep underline-offset-2 hover:underline"
                >
                  {c.directions}
                  <ExternalIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sun-soft text-sun-deep">
                <ClockIcon className="h-6 w-6" />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-ink-mute">{c.hoursLabel}</h3>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      openNow ? 'bg-emerald-100 text-emerald-700' : 'bg-coral-soft text-coral-deep'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${openNow ? 'bg-emerald-600' : 'bg-coral-deep'}`} />
                    {openNow ? c.openNow : c.closedNow}
                  </span>
                </div>
                <dl className="mt-2 space-y-1.5 text-[15px]">
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-ink">{c.weekdays}</dt>
                    <dd className="text-ink-soft">{c.weekdaysHours}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-semibold text-ink">{c.weekend}</dt>
                    <dd className="text-ink-soft">{c.closed}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <div className="mt-auto rounded-2xl bg-gradient-to-br from-sun-soft to-coral-soft p-5">
              <p className="font-display text-lg font-semibold text-ink">{t.trust.tours}</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => openBooking()} className="btn-sun flex-1 !text-base">
                  <SparkleIcon className="h-5 w-5" />
                  {t.nav.bookTour}
                </button>
                <a
                  href={info.onlineBookingHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-white flex-1 !text-base"
                >
                  {c.bookOnline}
                  <ExternalIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative min-h-[380px] overflow-hidden rounded-3xl shadow-card ring-8 ring-white"
          >
            <iframe
              title={c.mapTitle}
              src={info.mapEmbedSrc}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
