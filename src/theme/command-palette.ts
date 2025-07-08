import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex flex-col min-h-0 min-w-0 divide-y divide-default',
    input: '[&>input]:h-12',
    close: '',
    back: 'p-0',
    content: 'relative overflow-hidden flex flex-col',
    footer: 'p-1',
    viewport: 'relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1 focus:outline-none',
    group: 'p-1 isolate',
    empty: 'py-6 text-center text-sm text-muted',
    label: 'p-1.5 text-xs font-semibold text-highlighted',
    item: 'group relative w-full flex items-center gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75',
    itemLeadingIcon: 'shrink-0 size-5',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '2xs',
    itemLeadingChip: 'shrink-0 size-5',
    itemLeadingChipSize: 'md',
    itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    itemTrailingIcon: 'shrink-0 size-5',
    itemTrailingHighlightedIcon: 'shrink-0 size-5 text-dimmed hidden group-data-highlighted:inline-flex',
    itemTrailingKbds: 'hidden lg:inline-flex items-center shrink-0 gap-0.5',
    itemTrailingKbdsSize: 'md',
    itemLabel: 'truncate space-x-1 rtl:space-x-reverse text-dimmed',
    itemLabelBase: 'text-highlighted [&>mark]:text-inverted [&>mark]:bg-primary',
    itemLabelPrefix: 'text-default',
    itemLabelSuffix: 'text-dimmed [&>mark]:text-inverted [&>mark]:bg-primary'
  },
  variants: {
    active: {
      true: {
        item: 'text-highlighted before:bg-elevated',
        itemLeadingIcon: 'text-default'
      },
      false: {
        item: ['text-default data-highlighted:not-data-disabled:text-highlighted data-highlighted:not-data-disabled:before:bg-elevated/50', options.theme.transitions && 'transition-colors before:transition-colors'],
        itemLeadingIcon: ['text-dimmed group-data-highlighted:not-group-data-disabled:text-default', options.theme.transitions && 'transition-colors']
      }
    },
    loading: {
      true: {
        itemLeadingIcon: 'animate-spin'
      }
    }
  }
})
