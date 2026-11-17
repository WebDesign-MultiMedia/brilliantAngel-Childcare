import { motion } from 'framer-motion';

export default function SectionHeading({ eyebrow, title, sub, align = 'center', dot = 'bg-sun' }) {
  const centered = align === 'center';
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}
    >
      {eyebrow && (
        <span className="eyebrow">
          <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-balance text-4xl font-bold leading-[1.1] text-ink sm:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-pretty text-lg leading-relaxed text-ink-soft">{sub}</p>}
    </motion.div>
  );
}
