import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2dbf6a',
        'primary-dark': '#22c55e',
      },
      maxWidth: {
        'container': '1600px',
      },
      fontSize: {
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],      // 13px (was 12px)
        'sm': ['0.9375rem', { lineHeight: '1.5rem' }],       // 15px (was 14px)
        'base': ['1.0625rem', { lineHeight: '1.75rem' }],    // 17px (was 16px)
        'lg': ['1.1875rem', { lineHeight: '1.875rem' }],     // 19px (was 18px)
        'xl': ['1.3125rem', { lineHeight: '2rem' }],         // 21px (was 20px)
        '2xl': ['1.5625rem', { lineHeight: '2.25rem' }],     // 25px (was 24px)
        '3xl': ['1.9375rem', { lineHeight: '2.5rem' }],      // 31px (was 30px)
        '4xl': ['2.3125rem', { lineHeight: '2.75rem' }],     // 37px (was 36px)
        '5xl': ['3.0625rem', { lineHeight: '1' }],           // 49px (was 48px)
        '6xl': ['3.8125rem', { lineHeight: '1' }],           // 61px (was 60px)
        '7xl': ['4.8125rem', { lineHeight: '1' }],           // 77px (was 72px)
        '8xl': ['6.0625rem', { lineHeight: '1' }],           // 97px (was 96px)
        '9xl': ['8.0625rem', { lineHeight: '1' }],           // 129px (was 128px)
      },
    },
  },
  plugins: [],
}
export default config
