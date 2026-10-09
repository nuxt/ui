import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

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
    cellTrigger: 'm-0.5 relative flex items-center justify-center whitespace-nowrap focus-visible:outline-3 data-disabled:text-muted data-unavailable:line-through data-unavailable:text-muted data-unavailable:pointer-events-none data-today:font-semibold transition outline-accent-focus data-today:not-data-selected:text-accent data-highlighted:bg-accent-tint hover:not-data-selected:bg-accent-tint',
    cellWeek: 'relative text-center text-muted'
  },
  variants: {
    color: colorVariant({ root: '' }),
    variant: {
      solid: {
        cellTrigger: 'data-selected:bg-accent data-selected:text-accent-contrast'
      },
      outline: {
        cellTrigger: 'data-selected:ring data-selected:ring-inset data-selected:ring-accent-strong data-selected:text-accent-default data-selected:bg-default data-selected:focus-visible:ring-accent'
      },
      soft: {
        cellTrigger: 'data-selected:bg-accent-soft data-selected:text-accent-default'
      },
      subtle: {
        cellTrigger: 'data-selected:bg-accent-soft data-selected:text-accent-default data-selected:ring data-selected:ring-inset data-selected:ring-accent-strong data-selected:focus-visible:ring-accent'
      }
    },
    size: {
      xs: {
        root: '[--ui-control-size:--spacing(6)] [--ui-control-px:--spacing(2)]',
        headingLabel: 'text-xs',
        cell: 'text-xs',
        cellWeek: 'text-xs',
        headCell: 'text-[10px]',
        headCellWeek: 'text-[10px]',
        body: 'space-y-2 pt-2'
      },
      sm: {
        root: '[--ui-control-size:--spacing(7)] [--ui-control-px:--spacing(2)]',
        headingLabel: 'text-xs',
        headCell: 'text-xs',
        headCellWeek: 'text-xs',
        cellWeek: 'text-xs',
        cell: 'text-xs'
      },
      md: {
        root: '[--ui-control-size:--spacing(8)] [--ui-control-px:--spacing(3)]',
        headingLabel: 'text-sm',
        headCell: 'text-xs',
        headCellWeek: 'text-xs',
        cellWeek: 'text-xs',
        cell: 'text-sm'
      },
      lg: {
        root: '[--ui-control-size:--spacing(9)] [--ui-control-px:--spacing(4)]',
        headingLabel: 'text-base',
        headCell: 'text-base',
        headCellWeek: 'text-base',
        cellWeek: 'text-base',
        cell: 'text-base'
      },
      xl: {
        root: '[--ui-control-size:--spacing(10)] [--ui-control-px:--spacing(5)]',
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
        cellTrigger: 'size-(--ui-control-size) rounded-full data-outside-view:text-muted'
      },
      month: {
        gridRow: 'grid-cols-4',
        cellTrigger: 'h-(--ui-control-size) px-(--ui-control-px) rounded-md'
      },
      year: {
        gridRow: 'grid-cols-4',
        cellTrigger: 'h-(--ui-control-size) px-(--ui-control-px) rounded-md'
      }
    },
    weekNumbers: {
      true: ''
    }
  },
  compoundVariants: [
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
