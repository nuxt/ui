import { defu } from 'defu'
import type { ModuleOptions } from '../module'
import input from './input'

export default (options: Required<ModuleOptions>) => {
  return defu({
    slots: {
      arrow: 'fill-gray-200 dark:fill-gray-800',
      content: 'max-h-60 w-[--radix-popper-anchor-width] bg-white dark:bg-gray-900 shadow-lg rounded-md ring ring-gray-200 dark:ring-gray-800 overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
      viewport: 'divide-y divide-gray-200 dark:divide-gray-800 scroll-py-1',
      group: 'p-1 isolate',
      empty: 'py-2 text-center text-sm text-gray-500 dark:text-gray-400',
      label: 'font-semibold text-gray-900 dark:text-white',
      separator: '-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-800',
      item: ['group relative w-full flex items-center gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-gray-700 dark:text-gray-200 data-highlighted:text-gray-900 dark:data-highlighted:text-white data-highlighted:before:bg-gray-50 dark:data-highlighted:before:bg-gray-800/50', options.transitions && 'transition-colors before:transition-colors'],
      itemLeadingIcon: ['shrink-0 text-gray-400 dark:text-gray-500 group-data-highlighted:text-gray-700 dark:group-data-highlighted:text-gray-200', options.transitions && 'transition-colors'],
      itemLeadingAvatar: 'shrink-0',
      itemLeadingAvatarSize: '',
      itemLeadingChip: 'shrink-0',
      itemLeadingChipSize: '',
      itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
      itemTrailingIcon: 'shrink-0',
      itemLabel: 'truncate',
      tagsItem: 'px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-0.5 ring ring-inset ring-gray-300 dark:ring-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 data-disabled:cursor-not-allowed data-disabled:opacity-75',
      tagsItemText: 'truncate',
      tagsItemDelete: ['inline-flex items-center rounded-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 hover:bg-gray-200 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 disabled:pointer-events-none', options.transitions && 'transition-colors'],
      tagsItemDeleteIcon: '',
      tagsInput: 'border-0 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75'
    }
  }, {
    slots: {
      base: ['rounded-md', options.transitions && 'transition-colors'],
      trailing: 'absolute inset-y-0 end-0 flex items-center disabled:cursor-not-allowed disabled:opacity-75'
    },
    variants: {
      multiple: {
        true: {
          root: 'flex-wrap',
          base: ''
        },
        false: {
          base: 'w-full rounded-md border-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75'
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
    compoundVariants: [...options.colors.map((color: string) => ({
      color,
      multiple: true,
      variant: ['outline', 'subtle'],
      class: `has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-${color}-500 dark:has-[:focus-visible]:ring-${color}-400`
    })), {
      color: 'gray',
      multiple: true,
      variant: ['outline', 'subtle'],
      class: 'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gray-500 dark:has-[:focus-visible]:ring-white'
    }]
  }, input(options))
}
