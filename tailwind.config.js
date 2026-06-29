/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — Sharkode visual tokens
        'shark-bg': '#07070f',
        'shark-blue': '#1a80f8',
        'shark-cyan': '#19c7f7',
        'shark-indigo': '#3f19f7',
        'shark-amber': '#f59e0b',
        'shark-border': '#1e293b',
        'shark-text-pri': '#D1D5DB',
        'shark-text-sec': '#FFFFFF',
        'shark-card': 'rgba(255,255,255,0.025)',
        'shark-bd': 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        manrope: ['Manrope', 'sans-serif'],
        geist: ['Geist', 'sans-serif'],
        syncopate: ['Syncopate', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
