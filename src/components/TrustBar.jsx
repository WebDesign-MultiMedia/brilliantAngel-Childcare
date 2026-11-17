import { useLang } from '../i18n/LanguageContext.jsx';
import { CalendarIcon, CameraIcon, EyeIcon, HomeIcon, LockIcon, StarIcon } from './Icons.jsx';

const TONES = ['text-sun-deep', 'text-sky-deep', 'text-coral-deep', 'text-mint-deep', 'text-sky-deep', 'text-coral-deep'];

export default function TrustBar() {
  const { t } = useLang();
  const items = [
    { icon: StarIcon, label: `${t.trust.rating} · ${t.trust.ratingSub}` },
    { icon: LockIcon, label: t.trust.secure },
    { icon: HomeIcon, label: t.trust.childproof },
    { icon: EyeIcon, label: t.trust.supervision },
    { icon: CameraIcon, label: t.trust.photos },
    { icon: CalendarIcon, label: t.trust.tours },
  ];

  const Row = ({ hidden }) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map(({ icon: Icon, label }, i) => (
        <li key={label} className="flex items-center gap-2.5 whitespace-nowrap font-display text-lg font-semibold text-ink">
          <Icon className={`h-5 w-5 ${TONES[i]}`} />
          {label}
          <span className="ml-8 h-2 w-2 rounded-full bg-cream-200" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Trust badges" className="relative border-y border-cream-200 bg-white/70 py-5">
      <div className="group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex animate-[marquee_38s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <Row />
          <Row hidden />
        </div>
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </section>
  );
}
