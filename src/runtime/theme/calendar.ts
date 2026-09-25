import { colorVariant, colors } from './color'
import { defineTheme } from '../utils/theme'

const daySizes = {
  xs: 'size-6',
  sm: 'size-7',
  md: 'size-8',
  lg: 'size-9',
  xl: 'size-10'
}

const pickerSizes = {
  xs: 'h-6 px-2',
  sm: 'h-7 px-2',
  md: 'h-8 px-3',
  lg: 'h-9 px-4',
  xl: 'h-10 px-5'
}

export default defineTheme({
  slots: {
    root: '',
    header: 'flex items-center justify-between',
    body: 'flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0',
    heading: 'flex-1 min-w-0 text-center',
    headingLabel: 'font-medium block truncate p-1.5',
    grid: 'w-full border-collapse select-none space-y-1 focus:outline-none',
    gridRow: 'grid',
    gridWeekDaysRow: 'mb-1 grid w-full grid-cols-7',
    gridBody: 'grid',
    headCell: 'rounded-md text-accent',
    headCellWeek: 'rounded-md text-muted',
    cell: 'relative text-center',
    cellTrigger: 'm-0.5 relative flex items-center justify-center whitespace-nowrap focus-visible:outline-3 data-disabled:text-muted data-unavailable:line-through data-unavailable:text-muted data-unavailable:pointer-events-none data-today:font-semibold transition outline-accent-focus',
    cellWeek: 'relative text-center text-muted'
  },
  variants: {
    color: {
      ...colorVariant({ root: '' }),
      // Neutral hovers at 10% where the colors use 20%, so it keeps its own classes.
      neutral: {
        headCell: 'text-highlighted',
        cellTrigger: 'outline-inverted/25'
      }
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: ''
    },
    size: {
      xs: {
        headingLabel: 'text-xs',
        cell: 'text-xs',
        cellWeek: 'text-xs',
        headCell: 'text-[10px]',
        headCellWeek: 'text-[10px]',
        body: 'space-y-2 pt-2'
      },
      sm: {
        headingLabel: 'text-xs',
        headCell: 'text-xs',
        headCellWeek: 'text-xs',
        cellWeek: 'text-xs',
        cell: 'text-xs'
      },
      md: {
        headingLabel: 'text-sm',
        headCell: 'text-xs',
        headCellWeek: 'text-xs',
        cellWeek: 'text-xs',
        cell: 'text-sm'
      },
      lg: {
        headingLabel: 'text-base',
        headCell: 'text-base',
        headCellWeek: 'text-base',
        cellWeek: 'text-base',
        cell: 'text-base'
      },
      xl: {
        headingLabel: 'text-lg',
        headCell: 'text-lg',
        headCellWeek: 'text-lg',
        cellWeek: 'text-lg',
        cell: 'text-lg'
      }
    },
    view: {
      day: {
        gridRow: 'grid-cols-7 place-items-center',
        cellTrigger: 'rounded-full data-outside-view:text-muted'
      },
      month: {
        gridRow: 'grid-cols-4',
        cellTrigger: 'rounded-md'
      },
      year: {
        gridRow: 'grid-cols-4',
        cellTrigger: 'rounded-md'
      }
    },
    weekNumbers: {
      true: ''
    }
  },
  compoundVariants: [
    {
      color: colors.filter(color => color !== 'neutral'),
      variant: 'solid',
      class: {
        cellTrigger: 'data-selected:bg-accent data-selected:text-accent-foreground data-today:not-data-selected:text-accent data-highlighted:bg-accent-soft-active hover:not-data-selected:bg-accent-soft-active'
      }
    },
    {
      color: colors.filter(color => color !== 'neutral'),
      variant: 'outline',
      class: {
        cellTrigger: 'data-selected:ring data-selected:ring-inset data-selected:ring-accent-border data-selected:text-accent data-selected:focus-visible:ring-accent data-today:not-data-selected:text-accent data-highlighted:bg-accent-soft hover:not-data-selected:bg-accent-soft'
      }
    },
    {
      color: colors.filter(color => color !== 'neutral'),
      variant: 'soft',
      class: {
        cellTrigger: 'data-selected:bg-accent-soft data-selected:text-accent-soft-foreground data-today:not-data-selected:text-accent data-highlighted:bg-accent-soft-active hover:not-data-selected:bg-accent-soft-active'
      }
    },
    {
      color: colors.filter(color => color !== 'neutral'),
      variant: 'subtle',
      class: {
        cellTrigger: 'data-selected:bg-accent-soft data-selected:text-accent-soft-foreground data-selected:ring data-selected:ring-inset data-selected:ring-accent-border-soft data-selected:focus-visible:ring-accent data-today:not-data-selected:text-accent data-highlighted:bg-accent-soft-active hover:not-data-selected:bg-accent-soft-active'
      }
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: {
        cellTrigger: 'data-selected:bg-inverted data-selected:text-inverted data-today:not-data-selected:text-highlighted data-highlighted:bg-inverted/20 hover:not-data-selected:bg-inverted/10'
      }
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: {
        cellTrigger: 'data-selected:ring data-selected:ring-inset data-selected:ring-accented data-selected:text-default data-selected:bg-default data-selected:focus-visible:ring-inverted data-today:not-data-selected:text-highlighted data-highlighted:bg-inverted/10 hover:not-data-selected:bg-inverted/10'
      }
    },
    {
      color: 'neutral',
      variant: 'soft',
      class: {
        cellTrigger: 'data-selected:bg-elevated data-selected:text-default data-today:not-data-selected:text-highlighted data-highlighted:bg-inverted/20 hover:not-data-selected:bg-inverted/10'
      }
    },
    {
      color: 'neutral',
      variant: 'subtle',
      class: {
        cellTrigger: 'data-selected:bg-elevated data-selected:text-default data-selected:ring data-selected:ring-inset data-selected:ring-accented data-selected:focus-visible:ring-inverted data-today:not-data-selected:text-highlighted data-highlighted:bg-inverted/20 hover:not-data-selected:bg-inverted/10'
      }
    },
    ...(Object.entries(daySizes) as [keyof typeof daySizes, string][]).map(([size, cellTrigger]) => ({
      size,
      view: 'day' as const,
      class: { cellTrigger }
    })),
    ...(Object.entries(pickerSizes) as [keyof typeof pickerSizes, string][]).map(([size, cellTrigger]) => ({
      size,
      view: ['month' as const, 'year' as const],
      class: { cellTrigger }
    })),
    {
      view: 'day',
      weekNumbers: true,
      class: {
        gridRow: 'grid-cols-8',
        gridWeekDaysRow: 'grid-cols-8 [&>*:first-child]:col-start-2'
      }
    }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'solid',
    view: 'day'
  }
})
