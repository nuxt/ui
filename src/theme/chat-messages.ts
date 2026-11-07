export default {
  slots: {
    root: 'w-full flex flex-col gap-1 flex-1 px-2.5 [&>article]:last-of-type:min-h-(--last-message-height)',
    indicator: 'h-6 flex items-center gap-1 py-3 *:size-2 *:rounded-full *:bg-elevated motion-safe:[&>*:nth-child(1)]:animate-[bounce_1s_infinite] motion-safe:[&>*:nth-child(2)]:animate-[bounce_1s_0.15s_infinite] motion-safe:[&>*:nth-child(3)]:animate-[bounce_1s_0.3s_infinite]',
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
        viewport: 'sticky top-auto bottom-[calc(var(--bottom-offset)+--spacing(4))] h-0'
      }
    }
  }
}
