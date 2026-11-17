/**
 * Brilliant Angel Childcare: central site configuration.
 *
 * All business facts, links and images live here so the site can be updated
 * without touching component code. Translatable copy lives in src/i18n/translations.js.
 *
 * IMAGES
 * - Files in /public/images/ are the center's real photos (taken from the current site).
 * - Entries with `placeholder: true` are stock photos. Swap them for real photos
 *   (e.g. from the Google Maps listing) by dropping files into /public/images/
 *   and changing `src`. Keep `placeholder: false` once replaced.
 */

const unsplash = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const siteConfig = {
  name: 'Brilliant Angel Childcare',
  shortName: 'Brilliant Angel',
  logo: '/images/logo.webp',
  logoSmall: '/images/logo-192.webp',
  url: 'https://www.brilliantangelchildcare.com',

  contact: {
    phoneDisplay: '(646) 739-0750',
    phoneHref: 'tel:+16467390750',
    whatsappNumber: '16467390750',
    whatsappHref: 'https://wa.me/16467390750',
    address: {
      street: '1980 Unionport Rd',
      city: 'Bronx',
      state: 'NY',
      zip: '10462',
      full: '1980 Unionport Rd, Bronx, NY 10462',
    },
    mapEmbedSrc:
      'https://www.google.com/maps?q=1980+Unionport+Rd,+Bronx,+NY+10462&z=16&output=embed',
    mapsDirectionsHref:
      'https://www.google.com/maps/dir/?api=1&destination=1980+Unionport+Rd,+Bronx,+NY+10462',
    googleReviewsHref:
      'https://www.google.com/maps/search/?api=1&query=Brilliant+Angel+Childcare+1980+Unionport+Rd+Bronx+NY',
    onlineBookingHref: 'https://brilliantangelchildcare.as.me/',
    instagramHref: 'https://instagram.com/brilliantangeldaycare',
    instagramHandle: '@brilliantangeldaycare',
  },

  // 24h clock values are used by the booking modal to build time windows.
  hours: {
    open: 8,
    close: 18,
    weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    closed: ['sat', 'sun'],
  },

  rating: {
    score: '5.0',
    count: 23,
  },

  // Facility gallery (Bento grid). `span` controls the tile size on desktop:
  // 'tall' = 2 rows, 'wide' = 2 cols, 'big' = 2x2, undefined = 1x1.
  gallery: [
    {
      src: '/images/classroom-main.webp',
      span: 'big',
      placeholder: false,
      alt: {
        en: 'Bright classroom with colorful foam play mats, learning tables and wall charts',
        es: 'Salón luminoso con tapetes de colores, mesas de aprendizaje y carteles educativos',
      },
      caption: { en: 'Our main classroom', es: 'Nuestro salón principal' },
    },
    {
      src: '/images/reading-corner.webp',
      span: 'tall',
      placeholder: false,
      alt: {
        en: 'Cozy reading corner with bookshelves, cushions and a sensory activity center',
        es: 'Rincón de lectura acogedor con libreros, cojines y centro de actividades sensoriales',
      },
      caption: { en: 'Cozy reading nook', es: 'Rincón de lectura' },
    },
    {
      src: unsplash('1564429238817-393bd4286b2d'),
      placeholder: true,
      alt: {
        en: 'Wooden alphabet letters and paint pots on a classroom table',
        es: 'Letras de madera y pinturas sobre una mesa del salón',
      },
      caption: { en: 'Hands-on letters', es: 'Letras para tocar' },
    },
    {
      src: '/images/play-area.webp',
      span: 'tall',
      placeholder: false,
      alt: {
        en: 'Play area with educational posters, toy shelves and soft floor mats',
        es: 'Área de juego con carteles educativos, estantes de juguetes y tapetes suaves',
      },
      caption: { en: 'Play & discovery area', es: 'Área de juego y descubrimiento' },
    },
    {
      src: unsplash('1596464716127-f2a82984de30'),
      placeholder: true,
      alt: {
        en: 'Child drawing with markers at an art table',
        es: 'Niño dibujando con marcadores en la mesa de arte',
      },
      caption: { en: 'Creative arts table', es: 'Mesa de arte' },
    },
    {
      src: '/images/learning-stations.webp',
      placeholder: false,
      alt: {
        en: 'Children working at individual learning stations',
        es: 'Niños trabajando en estaciones de aprendizaje individuales',
      },
      caption: { en: 'Focused learning stations', es: 'Estaciones de aprendizaje' },
    },
    {
      src: unsplash('1515488042361-ee00e0ddd4e4'),
      span: 'wide',
      placeholder: true,
      alt: {
        en: 'Baby exploring soft toys and picture books on a play mat',
        es: 'Bebé explorando juguetes suaves y libros ilustrados',
      },
      caption: { en: 'Infant sensory play', es: 'Juego sensorial para bebés' },
    },
    {
      src: unsplash('1587654780291-39c9404d746b'),
      placeholder: true,
      alt: {
        en: 'Colorful building blocks',
        es: 'Bloques de construcción de colores',
      },
      caption: { en: 'Building & STEM toys', es: 'Bloques y juguetes STEM' },
    },
  ],

  // Photo used in the About section.
  aboutImage: '/images/classroom-main.webp',

  // Verbatim 5-star Google reviews (as shown on the center's current site).
  // Names are shortened to first name + last initial for families' privacy.
  reviews: [
    {
      name: 'Noellia Q.',
      date: '2024-07-08',
      lang: 'en',
      tags: ['photos', 'staff'],
      text: "My baby love it here and doesn't want to go home when it's time for pick up. The staff is so sweet and I love that they send me pictures and updates ❤️",
    },
    {
      name: 'D. B.',
      badge: 'Local Guide',
      date: '',
      lang: 'en',
      tags: ['staff', 'communication'],
      text: "Evimer and her team are absolutely wonderful. They are nurturing, kind and supportive of the children. They are also very communicative and transparent with the parents about children's daily activities and overall development, and do well to provide any advice that would be helpful from a general health and wellness perspective. There are fun activities for the children every day and kids are treated with dignity, respect and genuine care. I would highly recommend to anyone searching for a safe and loving daycare for their little ones.",
    },
    {
      name: 'Estrellita O.',
      date: '2023-04-27',
      lang: 'en',
      tags: ['routine', 'long-term'],
      text: "My son has been attending here for over 3 years, I can honestly say it's one of the best daycares out there, they teach our babies structure by having a routine to help our babies have a smoother day. I love the communication they have with the parents & the patience they have with the children.",
    },
    {
      name: 'Dianna M.',
      date: '2022-09-06',
      lang: 'en',
      tags: ['learning', 'clean'],
      text: 'My son Liam started this daycare around 2 years old, they are just fabulous with the children, my sons academical level is way beyond what I imagine, going to this daycare help him develop his motor skills… They are dedicated to see our children grow and learn at the same time, they feed them very well… our children are well kept all day and never has been a day where they were soiled when coming home or rashes. I love them, I appreciate what they all did for my son and I would always recommend them to anyone.',
    },
    {
      name: 'Lacreta M.',
      date: '2020-12-14',
      lang: 'en',
      tags: ['staff', 'food'],
      text: 'Miss Eve is the best provider my child has ever had she cares about them so much and she will work with you every day! My kid cannot stop talking about her. And he loves and I mean LOVES her food..Thank You TeTe 🥰',
    },
    {
      name: 'Google review',
      date: '',
      lang: 'es',
      tags: ['clean', 'safety'],
      text: 'Muy buenos tratos con los niños, organización y limpieza… pero las importante la seguridad y aprendizaje de los niños.',
    },
  ],
};

export default siteConfig;
