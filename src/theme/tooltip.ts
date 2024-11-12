export default {
  slots: {
    content: 'flex items-center gap-1 bg-[var(--ui-bg)] text-[var(--ui-text-highlighted)] shadow-sm rounded-[var(--ui-radius)] ring ring-[var(--ui-border)] h-6 px-2 py-1 text-xs select-none data-[state=delayed-open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
    arrow: 'fill-[var(--ui-border)]',
    text: 'truncate',
    kbds: `hidden lg:inline-flex items-center shrink-0 gap-0.5 before:content-['·'] before:me-0.5`,
    kbdsSize: 'sm'
  }
}
