import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex flex-col min-h-0 min-w-0 divide-y divide-[--ui-border]',
    input: '[&>input]:h-12',
    close: '',
    content: 'relative overflow-hidden',
    viewport: 'divide-y divide-[--ui-border] scroll-py-1',
    group: 'p-1 isolate',
    empty: 'py-6 text-center text-sm',
    label: 'px-2 py-1.5 text-xs font-semibold text-[--ui-text-highlighted]',
    item: ['group relative w-full flex items-center gap-2 px-2 py-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-[--ui-radius-md] data-disabled:cursor-not-allowed data-disabled:opacity-75 text-[--ui-text] data-highlighted:text-[--ui-text-highlighted] data-highlighted:before:bg-[--ui-bg-elevated]/50', options.theme.transitions && 'transition-colors before:transition-colors'],
    itemLeadingIcon: ['shrink-0 size-5 text-[--ui-text-dimmed] group-data-highlighted:text-[--ui-text]', options.theme.transitions && 'transition-colors'],
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '2xs',
    itemLeadingChip: 'shrink-0 size-5',
    itemLeadingChipSize: 'md',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0 size-5',
    itemTrailingHighlightedIcon: 'shrink-0 size-5 text-[--ui-text-dimmed] hidden group-data-highlighted:inline-flex',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0 gap-0.5',
    itemTrailingKbdsSize: 'md',
    itemLabel: 'truncate space-x-1',
    itemLabelBase: 'text-[--ui-text-highlighted] [&>mark]:text-[--ui-bg] [&>mark]:bg-[--ui-primary]',
    itemLabelPrefix: 'text-[--ui-text]',
    itemLabelSuffix: 'text-[--ui-text-dimmed] [&>mark]:text-[--ui-bg] [&>mark]:bg-[--ui-primary]'
  }
})
