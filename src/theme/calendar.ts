import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => {
  return {
    slots: {
      root: 'rounded-[calc(var(--ui-radius)*1.5)]',
      header: 'flex items-center justify-between',
      body: 'flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0',
      heading: 'text-sm font-medium',
      grid: 'w-full border-collapse select-none space-y-1',
      gridRow: 'grid grid-cols-7',
      gridWeekDaysRow: 'mb-1 grid w-full grid-cols-7',
      gridBody: 'grid',
      headCell: 'rounded-md text-xs',
      cell: 'relative text-center text-sm',
      cellTrigger: ['relative flex items-center justify-center rounded-full whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-inset data-[disabled]:text-[var(--ui-text)]/30 data-[selected]:text-[var(--ui-bg)]', options.theme.transitions && 'transition-[color,opacity] duration-200']
    },
    variants: {
      color: {
        ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
          headCell: `text-[var(--ui-${color})]`,
          cellTrigger: `focus-visible:ring-[var(--ui-${color})] data-[selected]:!bg-[var(--ui-${color})] data-[today]:bg-[var(--ui-${color})]/10`
        }])),
        neutral: {
          headCell: 'text-[var(--ui-bg-inverted)]',
          cellTrigger: 'focus-visible:ring-[var(--ui-border-inverted)] data-[selected]:!bg-[var(--ui-bg-inverted)] data-[today]:bg-[var(--ui-bg-inverted)]/20 hover:bg-[var(--ui-bg-inverted)]/10'
        }
      },
      size: {
        xs: {
          heading: 'text-xs',
          cell: 'text-xs',
          headCell: 'text-[10px]',
          cellTrigger: 'w-7 h-7',
          body: 'space-y-2 pt-2'
        },
        sm: {
          heading: 'text-xs',
          cell: 'text-xs',
          cellTrigger: 'w-7 h-7'
        },
        md: {
          cellTrigger: 'w-8 h-8'
        },
        lg: {
          heading: 'text-md',
          headCell: 'text-md',
          cellTrigger: 'w-9 h-9 text-md'
        },
        xl: {
          heading: 'text-lg',
          headCell: 'text-lg',
          cellTrigger: 'w-10 h-10 text-lg'
        }
      }
    },
    compoundVariants: [
      ...(options.theme.colors || []).map((color: string) => ({
        color
      }))
    ],
    defaultVariants: {
      size: 'md',
      color: 'primary'
    }
  }
}
