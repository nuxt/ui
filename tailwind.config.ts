import type { Config } from 'tailwindcss'

export default <Partial<Config>> {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./modules/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./app.config.ts",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}