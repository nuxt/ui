import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative my-5 overflow-x-auto rounded-md outline-focus focus-visible:outline-(length:--ui-focus-width)',
    base: 'w-full border-separate border-spacing-0 rounded-md'
  }
})
