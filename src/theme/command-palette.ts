import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex flex-col min-h-0 min-w-0 divide-y divide-[var(--ui-border)]',
    input: '[&>input]:h-12',
    close: '',
    content: 'relative overflow-hidden flex flex-col',
    viewport: 'relative divide-y divide-[var(--ui-border)] scroll-py-1 overflow-y-auto flex-1 focus:outline-none',
    group: 'p-1 isolate',
    empty: 'py-6 text-center text-sm text-[var(--ui-text-muted)]',
    label: 'px-2 py-1.5 text-xs font-semibold text-[var(--ui-text-highlighted)]',
    item: 'group relative w-full flex items-center gap-2 px-2 py-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-[calc(var(--ui-radius)*1.5)] data-disabled:cursor-not-allowed data-disabled:opacity-75',
    itemLeadingIcon: 'shrink-0 size-5',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '2xs',
    itemLeadingChip: 'shrink-0 size-5',
    itemLeadingChipSize: 'md',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0 size-5',
    itemTrailingHighlightedIcon: 'shrink-0 size-5 text-[var(--ui-text-dimmed)] hidden group-data-highlighted:inline-flex',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0 gap-0.5',
    itemTrailingKbdsSize: 'md',
    itemLabel: 'truncate space-x-1 rtl:space-x-reverse',
    itemLabelBase: 'text-[var(--ui-text-highlighted)] [&>mark]:text-[var(--ui-bg)] [&>mark]:bg-[var(--ui-primary)]',
    itemLabelPrefix: 'text-[var(--ui-text)]',
    itemLabelSuffix: 'text-[var(--ui-text-dimmed)] [&>mark]:text-[var(--ui-bg)] [&>mark]:bg-[var(--ui-primary)]'
  },
  variants: {
    active: {
      true: {
        item: 'text-[var(--ui-text-highlighted)] before:bg-[var(--ui-bg-elevated)]',
        itemLeadingIcon: 'text-[var(--ui-text)]'
      },
      false: {
        item: ['text-[var(--ui-text)] data-highlighted:text-[var(--ui-text-highlighted)] data-highlighted:before:bg-[var(--ui-bg-elevated)]/50', options.theme.transitions && 'transition-colors before:transition-colors'],
        itemLeadingIcon: ['text-[var(--ui-text-dimmed)] group-data-highlighted:text-[var(--ui-text)]', options.theme.transitions && 'transition-colors']
      }
    },
    loading: {
      true: {
        itemLeadingIcon: 'animate-spin'
      }
    }
  }
})
