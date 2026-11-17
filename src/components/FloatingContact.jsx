import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { siteConfig } from '../config/siteConfig.js';
import { useLang } from '../i18n/LanguageContext.jsx';
import { WhatsAppIcon } from './Icons.jsx';

/** Floating WhatsApp quick-chat button, shown after the hero. */
export default function FloatingContact() {
  const { t } = useLang();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={siteConfig.contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.contact.whatsapp}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.6)] ring-4 ring-white sm:bottom-7 sm:right-7 sm:h-16 sm:w-16"
        >
          <WhatsAppIcon className="h-7 w-7 sm:h-8 sm:w-8" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
