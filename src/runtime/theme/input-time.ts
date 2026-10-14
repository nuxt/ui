import inputDate from './input-date'
import { extendTheme } from '../utils/theme'

// Same field as InputDate, its segments all have the same width
export default extendTheme(inputDate, {
  variants: {
    size: {
      xs: { segment: 'not-data-[segment=literal]:w-8' },
      sm: { segment: 'not-data-[segment=literal]:w-8' },
      md: { segment: 'not-data-[segment=literal]:w-9' },
      lg: { segment: 'not-data-[segment=literal]:w-9' },
      xl: { segment: 'not-data-[segment=literal]:w-10' }
    }
  }
})
