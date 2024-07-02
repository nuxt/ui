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
      label: 'p-1.5 text-xs font-semibold text-gray-900 dark:text-white',
      separator: '-mx-1 my-1 h-px bg-gray-200 dark:bg-gray-800',
      item: ['group relative w-full flex items-center gap-1.5 p-1.5 text-sm select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75 text-gray-700 dark:text-gray-200 data-highlighted:text-gray-900 dark:data-highlighted:text-white data-highlighted:before:bg-gray-50 dark:data-highlighted:before:bg-gray-800/50', options.transitions && 'transition-colors before:transition-colors'],
      itemLeadingIcon: ['shrink-0 size-5 text-gray-400 dark:text-gray-500 group-data-highlighted:text-gray-700 dark:group-data-highlighted:text-gray-200', options.transitions && 'transition-colors'],
      itemLeadingAvatar: 'shrink-0',
      itemLeadingChip: 'shrink-0 mx-1.5',
      itemTrailing: 'ms-auto inline-flex gap-1.5 items-center',
      itemTrailingIcon: 'shrink-0 size-5',
      itemLabel: 'truncate',
      tagsItem: 'px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-0.5 ring ring-inset ring-gray-300 dark:ring-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 data-disabled:cursor-not-allowed data-disabled:opacity-75',
      tagsItemText: 'truncate',
      tagsItemDelete: ['inline-flex items-center rounded-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-200 dark:hover:bg-gray-700/50 disabled:pointer-events-none', options.transitions && 'transition-colors'],
      tagsItemDeleteIcon: '',
      tagsInput: 'border-0 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75'
    }
  }, {
    slots: {
      base: 'rounded-md',
      trailing: 'absolute inset-y-0 end-0 flex items-center disabled:cursor-not-allowed disabled:opacity-75'
    },
    variants: {
      multiple: {
        true: {
          root: 'flex-wrap',
          base: 'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-500 dark:has-[:focus-visible]:ring-primary-400'
        },
        false: {
          base: 'w-full rounded-md border-0 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-75'
        }
      },
      size: {
        xs: {
          tagsItem: 'text-[10px]/3',
          tagsItemDeleteIcon: 'size-3'
        },
        sm: {
          tagsItem: 'text-[10px]/3',
          tagsItemDeleteIcon: 'size-3'
        },
        md: {
          tagsItem: 'text-xs',
          tagsItemDeleteIcon: 'size-3.5'
        },
        lg: {
          tagsItem: 'text-xs',
          tagsItemDeleteIcon: 'size-3.5'
        },
        xl: {
          tagsItem: 'text-sm',
          tagsItemDeleteIcon: 'size-4'
        }
      }
    }
  }, input(options))
}
