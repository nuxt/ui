import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Inter fallback', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        green: {
          50: '#d6ffee',
          100: '#acffdd',
          200: '#83ffcc',
          300: '#30ffaa',
          400: '#00dc82',
          500: '#00bd6f',
          600: '#009d5d',
          700: '#007e4a',
          800: '#005e38',
          900: '#003f25'
        }
      }
    }
  }
}
