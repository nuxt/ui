import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'hidden sm:flex items-center justify-center transition-[top,left] duration-200 ease-out motion-reduce:transition-none',
    handle: 'cursor-grab px-1'
  }
})
