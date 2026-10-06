import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative',
    container: 'flex flex-col gap-y-8 sm:gap-y-12 lg:gap-y-16',
    indicator: 'absolute hidden lg:block overflow-hidden inset-y-3 inset-s-32 h-full w-px bg-border ms-[-8.5px]',
    beam: 'absolute inset-s-0 top-0 w-full bg-primary will-change-[height]'
  }
})
