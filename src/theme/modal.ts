export default {
  slots: {
    overlay: 'fixed inset-0 bg-[var(--ui-bg-elevated)]/75',
    content: 'fixed w-full h-dvh bg-[var(--ui-bg)] divide-y divide-[var(--ui-border)] flex flex-col focus:outline-none',
    header: 'px-4 py-5 sm:px-6',
    body: 'flex-1 p-4 sm:p-6',
    footer: 'flex items-center gap-1.5 p-4 sm:px-6',
    title: 'text-[var(--ui-text-highlighted)] font-semibold',
    description: 'mt-1 text-[var(--ui-text-muted)] text-sm',
    close: 'absolute top-4 end-4'
  },
  variants: {
    transition: {
      true: {
        overlay: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]',
        content: 'data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]'
      }
    },
    fullscreen: {
      true: {
        content: 'inset-0'
      },
      false: {
        content: 'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-lg w-[90vw] h-auto my-4 sm:my-8 rounded-[calc(var(--ui-radius)*2)] shadow-lg ring ring-[var(--ui-border)]'
      }
    }
  }
}
