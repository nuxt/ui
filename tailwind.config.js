export default {
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography')
  ],
  content: [
    resolve(runtimeDir, 'components/**/*.{vue,js,ts}'),
    resolve(runtimeDir, 'presets/*.{mjs,js,ts}')
  ],
  safelist: [
    'dark',
    {
      pattern: /rounded-(sm|md|lg|xl|2xl|3xl)/,
      variants: ['sm']
    }
  ]
}
