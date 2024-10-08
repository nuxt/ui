import { defuFn } from 'defu'
import type { ModuleOptions } from '../module'
import input from './input'

export default (options: Required<ModuleOptions>) => {
  return defuFn({
    slots: {
      base: () => ['rounded-[--ui-radius-md]', options.theme.transitions && 'transition-colors'],
      trailing: 'group absolute inset-y-0 end-0 flex items-center disabled:cursor-not-allowed disabled:opacity-75',
      arrow: 'fill-[--ui-border]',
      content: 'max-h-60 w-[--radix-popper-anchor-width] bg-[--ui-bg] shadow-lg rounded-[--ui-radius-md] ring ring-[--ui-border] overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
      viewport: 'divide-y divide-[--ui-border] scroll-py-1',
      group: 'p-1 isolate',
      empty: 'py-2 text-center text-sm text-[--ui-text-muted]',
      label: 'font-semibold text-[--ui-text-highlighted]',
      separator: '-mx-1 my-1 h-px bg-[--ui-border]',
      item: ['group relative w-full flex items-center gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-[--ui-radius-md] data-disabled:cursor-not-allowed data-disabled:opacity-75 text-[--ui-text] data-highlighted:text-[--ui-text-highlighted] data-highlighted:before:bg-[--ui-bg-elevated]/50', options.theme.transitions && 'transition-colors before:transition-colors'],
      itemLeadingIcon: ['shrink-0 text-[--ui-text-dimmed] group-data-highlighted:text-[--ui-text]', options.theme.transitions && 'transition-colors'],
      itemLeadingAvatar: 'shrink-0',
      itemLeadingAvatarSize: '',
      itemLeadingChip: 'shrink-0',
      itemLeadingChipSize: '',
      itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
      itemTrailingIcon: 'shrink-0',
      itemLabel: 'truncate',
      tagsItem: 'px-1.5 py-0.5 rounded-[--ui-radius] font-medium inline-flex items-center gap-0.5 ring ring-inset ring-[--ui-border-accented] bg-[--ui-bg-elevated] text-[--ui-text] data-disabled:cursor-not-allowed data-disabled:opacity-75',
      tagsItemText: 'truncate',
      tagsItemDelete: ['inline-flex items-center rounded-[--ui-radius-sm] text-[--ui-text-dimmed] hover:text-[--ui-text] hover:bg-[--ui-bg-accented]/75 disabled:pointer-events-none', options.theme.transitions && 'transition-colors'],
      tagsItemDeleteIcon: '',
      tagsInput: 'border-0 placeholder-[--ui-text-dimmed] focus:outline-none disabled:cursor-not-allowed disabled:opacity-75'
    },
    variants: {
      multiple: {
        true: {
          root: 'flex-wrap',
          base: ''
        },
        false: {
          base: 'w-full rounded-[--ui-radius-md] border-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75'
        }
      },
      size: {
        xs: {
          label: 'p-1 text-[10px]/3 gap-1',
          item: 'p-1 text-xs gap-1',
          itemLeadingIcon: 'size-4',
          itemLeadingAvatarSize: '3xs',
          itemLeadingChip: 'size-4',
          itemLeadingChipSize: 'sm',
          itemTrailingIcon: 'size-4',
          tagsItem: 'text-[10px]/3',
          tagsItemDeleteIcon: 'size-3'
        },
        sm: {
          label: 'p-1.5 text-[10px]/3 gap-1.5',
          item: 'p-1.5 text-xs gap-1.5',
          itemLeadingIcon: 'size-4',
          itemLeadingAvatarSize: '3xs',
          itemLeadingChip: 'size-4',
          itemLeadingChipSize: 'sm',
          itemTrailingIcon: 'size-4',
          tagsItem: 'text-[10px]/3',
          tagsItemDeleteIcon: 'size-3'
        },
        md: {
          label: 'p-1.5 text-xs gap-1.5',
          item: 'p-1.5 text-sm gap-1.5',
          itemLeadingIcon: 'size-5',
          itemLeadingAvatarSize: '2xs',
          itemLeadingChip: 'size-5',
          itemLeadingChipSize: 'md',
          itemTrailingIcon: 'size-5',
          tagsItem: 'text-xs',
          tagsItemDeleteIcon: 'size-3.5'
        },
        lg: {
          label: 'p-2 text-xs gap-2',
          item: 'p-2 text-sm gap-2',
          itemLeadingIcon: 'size-5',
          itemLeadingAvatarSize: '2xs',
          itemLeadingChip: 'size-5',
          itemLeadingChipSize: 'md',
          itemTrailingIcon: 'size-5',
          tagsItem: 'text-xs',
          tagsItemDeleteIcon: 'size-3.5'
        },
        xl: {
          label: 'p-2 text-sm gap-2',
          item: 'p-2 text-base gap-2',
          itemLeadingIcon: 'size-6',
          itemLeadingAvatarSize: 'xs',
          itemLeadingChip: 'size-6',
          itemLeadingChipSize: 'lg',
          itemTrailingIcon: 'size-6',
          tagsItem: 'text-sm',
          tagsItemDeleteIcon: 'size-4'
        }
      }
    },
    compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
      color,
      multiple: true,
      variant: ['outline', 'subtle'],
      class: `has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[--${color}]`
    })), {
      color: 'neutral',
      multiple: true,
      variant: ['outline', 'subtle'],
      class: 'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[--ui-border-inverted]'
    }]
  }, input(options))
}
