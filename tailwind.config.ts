import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: { colors: { bg: { DEFAULT: '#04081a', 2: '#080f24', 3: '#0d1633' }, card: { DEFAULT: '#0f1d3a', 2: '#132040' }, blue: { DEFAULT: '#2563eb', 2: '#3b82f6', 3: '#60a5fa' }, gold: { DEFAULT: '#f59e0b', 2: '#fbbf24' }, purple: { DEFAULT: '#7c3aed', 2: '#a78bfa' } } } },
  plugins: [],
}
export default config
