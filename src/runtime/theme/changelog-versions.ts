import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative',
    container: 'flex flex-col gap-y-8 sm:gap-y-12 lg:gap-y-16',
    indicator: 'absolute hidden lg:block inset-y-3 inset-s-32 h-full w-px bg-border ms-[-8.5px] supports-[animation-timeline:scroll()]:animate-[changelog-versions-progress_linear_both]',
    beam: 'absolute inset-0 origin-top scale-y-(--ui-changelog-versions-progress) bg-primary transition-[scale] duration-500 ease-out motion-reduce:transition-none'
  }
})
