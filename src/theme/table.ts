export default {
  slots: {
    root: 'relative overflow-x-auto',
    base: 'min-w-full table-fixed divide-y divide-[var(--ui-border-accented)]',
    thead: '',
    tbody: 'divide-y divide-[var(--ui-border)]',
    tr: '',
    th: 'px-4 py-3.5 text-sm text-[var(--ui-text-highlighted)] text-left rtl:text-right font-semibold',
    td: 'p-4 text-sm text-[var(--ui-text-muted)] whitespace-nowrap',
    empty: 'h-24 text-center'
  }
}
