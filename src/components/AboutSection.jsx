import { motion } from 'framer-motion';
import { useLang } from '../i18n/LanguageContext.jsx';
import { siteConfig } from '../config/siteConfig.js';
import SectionHeading from './SectionHeading.jsx';
import TiltCard from './TiltCard.jsx';
import { BlocksIcon, CameraIcon, HeartIcon, ShieldIcon } from './Icons.jsx';

const PILLAR_STYLE = [
  { icon: ShieldIcon, bg: 'bg-mint-soft', fg: 'text-mint-deep', ring: 'ring-mint/40', blob: 'bg-mint' },
  { icon: CameraIcon, bg: 'bg-coral-soft', fg: 'text-coral-deep', ring: 'ring-coral/40', blob: 'bg-coral' },
  { icon: BlocksIcon, bg: 'bg-sky-soft', fg: 'text-sky-deep', ring: 'ring-sky/40', blob: 'bg-sky' },
  { icon: HeartIcon, bg: 'bg-sun-soft', fg: 'text-sun-deep', ring: 'ring-sun/50', blob: 'bg-sun' },
];

export default function AboutSection() {
  const { t, lang } = useLang();
  const a = t.about;

  return (
    <section id="about" className="section-y relative">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Photo collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-3xl bg-sun/60" aria-hidden="true" />
            <div className="absolute -bottom-5 -right-3 h-32 w-32 rounded-full bg-sky/40" aria-hidden="true" />
            <figure className="relative overflow-hidden rounded-[2.25rem] shadow-card ring-8 ring-white">
              <img
                src={siteConfig.aboutImage}
                alt={siteConfig.gallery[0].alt[lang]}
                loading="lazy"
                width="1050"
                height="1400"
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold text-ink backdrop-blur">
                {a.photoCaption}
              </figcaption>
            </figure>
          </motion.div>

          <div>
            <SectionHeading eyebrow={a.eyebrow} title={a.title} align="left" dot="bg-coral" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-5 space-y-4 text-lg leading-relaxed text-ink-soft"
            >
              <p>{a.p1}</p>
              <p>{a.p2}</p>
            </motion.div>
            <dl className="mt-8 grid grid-cols-3 gap-3 sm:gap-4">
              {a.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="card px-3 py-4 text-center sm:px-4"
                >
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="font-display text-2xl font-bold text-ink sm:text-3xl">{s.value}</dd>
                  <dd className="mt-1 text-xs font-semibold text-ink-mute sm:text-sm">{s.label}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>

        {/* Why parents love us */}
        <div className="mt-24">
          <SectionHeading title={a.whyTitle} sub={a.whySub} />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {a.pillars.map((p, i) => {
              const s = PILLAR_STYLE[i];
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard className="card overflow-hidden p-7">
                    <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${s.blob} opacity-20`} aria-hidden="true" />
                    <div style={{ transform: 'translateZ(40px)' }}>
                      <span className={`grid h-14 w-14 place-items-center rounded-2xl ${s.bg} ${s.fg} ring-4 ${s.ring}`}>
                        <Icon className="h-7 w-7" />
                      </span>
                      <h3 className="mt-5 text-xl font-semibold leading-snug text-ink">{p.title}</h3>
                      <p className="mt-2.5 leading-relaxed text-ink-soft">{p.text}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
