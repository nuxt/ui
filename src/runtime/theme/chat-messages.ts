import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'w-full flex flex-col gap-1 flex-1 px-2.5 [&>article]:last-of-type:min-h-(--last-message-height)',
    indicator: 'h-6 flex items-center gap-2',
    indicatorGrid: 'shrink-0 grid grid-cols-4 gap-0.5 size-4.5 text-muted',
    indicatorDot: 'rounded-full bg-current opacity-20 motion-safe:animate-[chat-indicator_1.2s_ease-in-out_calc(var(--index)*100ms)_infinite]',
    indicatorLabel: 'text-sm',
    viewport: 'absolute inset-x-0 top-[86%] data-[state=open]:animate-[fade-in_200ms_var(--ease-out)] data-[state=closed]:animate-[fade-out_200ms_var(--ease-out)]',
    autoScroll: 'rounded-full absolute right-1/2 translate-x-1/2 bottom-0',
    footer: 'sticky bottom-0 z-10 mt-auto'
  },
  variants: {
    compact: {
      true: '',
      false: ''
    },
    footer: {
      true: {
        viewport: 'top-auto bottom-full mb-4'
      }
    }
  }
})
