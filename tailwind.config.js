/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Palette taken from their current Squarespace theme + logo.
        // Token names kept from the first build: coral = their rose, mint = their lavender.
        cream: { DEFAULT: '#FFF7E5', 100: '#FDEED0', 200: '#F3DFBA' },
        sky: { DEFAULT: '#8FC8EE', soft: '#DCEEFA', deep: '#3E6EAC' },
        sun: { DEFAULT: '#FFD166', soft: '#FFF0C7', deep: '#E8AE2A' },
        coral: { DEFAULT: '#E5A4B1', soft: '#F9E2E7', deep: '#C46A7E' },
        mint: { DEFAULT: '#D7B2F7', soft: '#F2E6FD', deep: '#9563C9' },
        ink: { DEFAULT: '#23406A', soft: '#3F5B82', mute: '#677C9A' },
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(35,64,106,0.18)',
        card: '0 20px 50px -20px rgba(35,64,106,0.25)',
        'push-sun': '0 6px 0 0 #E8AE2A, 0 14px 24px -8px rgba(232,174,42,0.55)',
        'push-sun-down': '0 2px 0 0 #E8AE2A, 0 6px 12px -6px rgba(232,174,42,0.55)',
        'push-sky': '0 6px 0 0 #3E6EAC, 0 14px 24px -8px rgba(62,110,172,0.4)',
        'push-sky-down': '0 2px 0 0 #3E6EAC, 0 6px 12px -6px rgba(62,110,172,0.4)',
        'push-white': '0 6px 0 0 #EAD3A8, 0 14px 24px -10px rgba(35,64,106,0.2)',
      },
      keyframes: {
        glow: {
          '0%,100%': { boxShadow: '0 4px 0 0 #E8AE2A, 0 0 0 0 rgba(255,209,102,0.7)' },
          '50%': { boxShadow: '0 4px 0 0 #E8AE2A, 0 0 22px 6px rgba(255,209,102,0.55)' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        glow: 'glow 2.6s ease-in-out infinite',
        floaty: 'floaty 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
