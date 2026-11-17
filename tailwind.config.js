/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FFFDF9', 100: '#FAF6F0', 200: '#F3EBDD' },
        sky: { DEFAULT: '#7CC6FE', soft: '#D9EEFF', deep: '#3B9EE8' },
        sun: { DEFAULT: '#FFD166', soft: '#FFF1CC', deep: '#E8AE2A' },
        coral: { DEFAULT: '#FF9E80', soft: '#FFE3D9', deep: '#F07452' },
        mint: { DEFAULT: '#80ED99', soft: '#DDF9E3', deep: '#3FC468' },
        ink: { DEFAULT: '#1E293B', soft: '#475569', mute: '#64748B' },
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(30,41,59,0.18)',
        card: '0 20px 50px -20px rgba(30,41,59,0.25)',
        'push-sun': '0 6px 0 0 #E8AE2A, 0 14px 24px -8px rgba(232,174,42,0.55)',
        'push-sun-down': '0 2px 0 0 #E8AE2A, 0 6px 12px -6px rgba(232,174,42,0.55)',
        'push-sky': '0 6px 0 0 #3B9EE8, 0 14px 24px -8px rgba(59,158,232,0.45)',
        'push-sky-down': '0 2px 0 0 #3B9EE8, 0 6px 12px -6px rgba(59,158,232,0.45)',
        'push-white': '0 6px 0 0 #E2D8C6, 0 14px 24px -10px rgba(30,41,59,0.2)',
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
