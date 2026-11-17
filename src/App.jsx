import { useCallback, useMemo, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero3D from './components/Hero3D.jsx';
import TrustBar from './components/TrustBar.jsx';
import AboutSection from './components/AboutSection.jsx';
import ProgramsSection from './components/ProgramsSection.jsx';
import DailyRoutine from './components/DailyRoutine.jsx';
import FacilityGallery from './components/FacilityGallery.jsx';
import ReviewsCarousel from './components/ReviewsCarousel.jsx';
import ContactSection from './components/ContactSection.jsx';
import Footer from './components/Footer.jsx';
import BookingModal from './components/BookingModal.jsx';
import FloatingContact from './components/FloatingContact.jsx';
import Welcome, { welcomeSeen } from './components/Welcome.jsx';
import { BookingContext } from './booking.js';
import { useLang } from './i18n/LanguageContext.jsx';

export default function App() {
  const { t } = useLang();
  const [booking, setBooking] = useState({ open: false, program: null });
  // Intro plays once per browser session (same behavior as the CSdsgn admin welcome).
  const [welcome, setWelcome] = useState(() => !welcomeSeen());
  const endWelcome = useCallback(() => setWelcome(false), []);

  const openBooking = useCallback((program = null) => setBooking({ open: true, program }), []);
  const closeBooking = useCallback(() => setBooking((b) => ({ ...b, open: false })), []);
  const ctx = useMemo(() => ({ openBooking }), [openBooking]);

  return (
    <MotionConfig reducedMotion="user">
      <BookingContext.Provider value={ctx}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          {t.a11y.skip}
        </a>
        <Navbar />
        <main id="main">
          <Hero3D />
          <TrustBar />
          <AboutSection />
          <ProgramsSection />
          <DailyRoutine />
          <FacilityGallery />
          <ReviewsCarousel />
          <ContactSection />
        </main>
        <Footer />
        <FloatingContact />
        <BookingModal open={booking.open} initialProgram={booking.program} onClose={closeBooking} />
        {welcome && <Welcome onDone={endWelcome} />}
      </BookingContext.Provider>
    </MotionConfig>
  );
}
