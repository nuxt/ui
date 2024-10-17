export default {
  slots: {
    root: 'relative overflow-x-auto',
    base: 'min-w-full table-fixed divide-y divide-[var(--ui-border-accented)]',
    thead: '',
    tbody: 'divide-y divide-[var(--ui-border)]',
    tr: 'data-[state=selected]:bg-[var(--ui-bg-elevated)]/50',
    th: 'px-4 py-3.5 text-sm text-[var(--ui-text-highlighted)] text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pr-0',
    td: 'p-4 text-sm text-[var(--ui-text-muted)] whitespace-nowrap [&:has([role=checkbox])]:pr-0',
    empty: 'h-24 text-center'
  },
  variants: {
    pinned: {
      true: {
        th: 'sticky bg-[var(--ui-bg)]/75 data-[pinned=left]:left-0 data-[pinned=right]:right-0',
        td: 'sticky bg-[var(--ui-bg)]/75 data-[pinned=left]:left-0 data-[pinned=right]:right-0'
      }
    }
  }
}
