# Brilliant Angel Childcare: website

React (Vite) + Tailwind CSS + Framer Motion + React Three Fiber.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Deploy
Static SPA, so any static host works:
- **Vercel / Netlify / Cloudflare Pages:** build command `npm run build`, output directory `dist`.
- `public/_redirects` is included for Netlify/Cloudflare SPA fallback.

## Editing content
| What | Where |
|---|---|
| Phone, WhatsApp, address, map, hours, booking & Instagram links | `src/config/siteConfig.js` → `contact`, `hours` |
| Gallery photos | `src/config/siteConfig.js` → `gallery` (drop files in `public/images/`) |
| Google reviews | `src/config/siteConfig.js` → `reviews` |
| All English / Spanish text | `src/i18n/translations.js` |

Gallery entries marked `placeholder: true` are stock photos. Replace them with real
photos (e.g. from the Google Maps listing) and set `placeholder: false`.

## Structure
```
src/
  config/siteConfig.js        business data + images
  i18n/                       EN/ES dictionary + LanguageContext
  components/
    Navbar.jsx  Hero3D.jsx  Scene3D.jsx (lazy-loaded R3F scene)
    TrustBar.jsx  AboutSection.jsx  TiltCard.jsx  ProgramsSection.jsx
    DailyRoutine.jsx  FacilityGallery.jsx  ReviewsCarousel.jsx
    BookingModal.jsx  ContactSection.jsx  Footer.jsx  FloatingContact.jsx
```

The 3D scene only loads on screens ≥768px with WebGL and no reduced-motion preference;
otherwise an animated 2D illustration renders instead. The render loop pauses when the
hero scrolls out of view.

## Tour requests
The booking modal has no backend: it composes a pre-filled WhatsApp message to
(646) 739-0750 and also links to the center's existing online scheduler
(brilliantangelchildcare.as.me). To capture requests server-side, post `data`
from `BookingModal.jsx` → `submit()` to a form service or API.
