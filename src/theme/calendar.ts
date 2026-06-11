import type { ModuleOptions } from '../module'

const daySizes = {
  xs: 'size-7',
  sm: 'size-7',
  md: 'size-8',
  lg: 'size-9 text-md',
  xl: 'size-10 text-lg'
}

const pickerSizes = {
  xs: 'h-7 px-2',
  sm: 'h-7 px-2',
  md: 'h-8 px-3',
  lg: 'h-9 px-4 text-md',
  xl: 'h-10 px-5 text-lg'
}

export default (options: Required<ModuleOptions>) => ({
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
    headCell: 'rounded-md',
    headCellWeek: 'rounded-md text-muted',
    cell: 'relative text-center',
    cellTrigger: ['m-0.5 relative flex items-center justify-center whitespace-nowrap focus-visible:outline-3 data-disabled:text-muted data-unavailable:line-through data-unavailable:text-muted data-unavailable:pointer-events-none data-today:font-semibold', options.theme.transitions && 'transition'],
    cellWeek: 'relative text-center text-muted'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        headCell: `text-${color}`,
        cellTrigger: `outline-${color}/25`
      }])),
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
        headingLabel: 'text-md',
        headCell: 'text-md',
        headCellWeek: 'text-md'
      },
      xl: {
        headingLabel: 'text-lg',
        headCell: 'text-lg',
        headCellWeek: 'text-lg'
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
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'solid',
    class: {
      cellTrigger: `data-selected:bg-${color} data-selected:text-inverted data-today:not-data-selected:text-${color} data-highlighted:bg-${color}/20 hover:not-data-selected:bg-${color}/20`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: {
      cellTrigger: `data-selected:ring data-selected:ring-inset data-selected:ring-${color}/50 data-selected:text-${color} data-today:not-data-selected:text-${color} data-highlighted:bg-${color}/10 hover:not-data-selected:bg-${color}/10`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: {
      cellTrigger: `data-selected:bg-${color}/10 data-selected:text-${color} data-today:not-data-selected:text-${color} data-highlighted:bg-${color}/20 hover:not-data-selected:bg-${color}/20`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: {
      cellTrigger: `data-selected:bg-${color}/10 data-selected:text-${color} data-selected:ring data-selected:ring-inset data-selected:ring-${color}/25 data-today:not-data-selected:text-${color} data-highlighted:bg-${color}/20 hover:not-data-selected:bg-${color}/20`
    }
  })), {
    color: 'neutral',
    variant: 'solid',
    class: {
      cellTrigger: 'data-selected:bg-inverted data-selected:text-inverted data-today:not-data-selected:text-highlighted data-highlighted:bg-inverted/20 hover:not-data-selected:bg-inverted/10'
    }
  }, {
    color: 'neutral',
    variant: 'outline',
    class: {
      cellTrigger: 'data-selected:ring data-selected:ring-inset data-selected:ring-accented data-selected:text-default data-selected:bg-default data-today:not-data-selected:text-highlighted data-highlighted:bg-inverted/10 hover:not-data-selected:bg-inverted/10'
    }
  }, {
    color: 'neutral',
    variant: 'soft',
    class: {
      cellTrigger: 'data-selected:bg-elevated data-selected:text-default data-today:not-data-selected:text-highlighted data-highlighted:bg-inverted/20 hover:not-data-selected:bg-inverted/10'
    }
  }, {
    color: 'neutral',
    variant: 'subtle',
    class: {
      cellTrigger: 'data-selected:bg-elevated data-selected:text-default data-selected:ring data-selected:ring-inset data-selected:ring-accented data-today:not-data-selected:text-highlighted data-highlighted:bg-inverted/20 hover:not-data-selected:bg-inverted/10'
    }
  },
  ...Object.entries(daySizes).map(([size, cellTrigger]) => ({
    size,
    view: 'day',
    class: { cellTrigger }
  })),
  ...Object.entries(pickerSizes).map(([size, cellTrigger]) => ({
    size,
    view: ['month', 'year'],
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
