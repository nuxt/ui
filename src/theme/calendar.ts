import type { ModuleOptions } from '../module'

type PickerTriggerVariant = 'solid' | 'outline' | 'soft' | 'subtle'
type CalendarPanelType = 'day' | 'month' | 'year'

const pickerTriggerVariants = ['solid', 'outline', 'soft', 'subtle'] as const

const triggerSizeClasses = {
  day: {
    xs: 'size-7',
    sm: 'size-7',
    md: 'size-8',
    lg: 'size-9 text-md',
    xl: 'size-10 text-lg'
  },
  picker: {
    xs: 'h-7 px-2 text-xs',
    sm: 'h-7 px-2 text-xs',
    md: 'h-8 px-3 text-sm',
    lg: 'h-9 px-4 text-md',
    xl: 'h-10 px-5 text-lg'
  }
} as const

function getTriggerClass(color: string, variant: PickerTriggerVariant, includeToday: boolean) {
  const today = includeToday ? ` data-today:not-data-[selected]:text-${color}` : ''
  switch (variant) {
    case 'solid':
      return `data-[selected]:bg-${color} data-[selected]:text-inverted${today} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
    case 'outline':
      return `data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-${color}/50 data-[selected]:text-${color}${today} data-[highlighted]:bg-${color}/10 hover:not-data-[selected]:bg-${color}/10`
    case 'soft':
      return `data-[selected]:bg-${color}/10 data-[selected]:text-${color}${today} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
    case 'subtle':
      return `data-[selected]:bg-${color}/10 data-[selected]:text-${color} data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-${color}/25${today} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
  }
}

function getNeutralTriggerClass(variant: PickerTriggerVariant, includeToday: boolean) {
  const today = includeToday ? ' data-today:not-data-[selected]:text-highlighted' : ''
  switch (variant) {
    case 'solid':
      return `data-[selected]:bg-inverted data-[selected]:text-inverted${today} data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10`
    case 'outline':
      return `data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-[selected]:text-default data-[selected]:bg-default${today} data-[highlighted]:bg-inverted/10 hover:not-data-[selected]:bg-inverted/10`
    case 'soft':
      return `data-[selected]:bg-elevated data-[selected]:text-default${today} data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10`
    case 'subtle':
      return `data-[selected]:bg-elevated data-[selected]:text-default data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented${today} data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10`
  }
}

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    header: 'flex items-center justify-between',
    body: 'flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0',
    heading: 'mx-auto text-center font-medium',
    grid: 'w-full select-none space-y-1 focus:outline-none',
    gridRow: 'grid',
    gridWeekDaysRow: 'mb-1 grid w-full grid-cols-7',
    gridBody: 'grid',
    headCell: 'rounded-md',
    headCellWeek: 'rounded-md text-muted',
    cell: 'relative text-center',
    cellTrigger: ['relative flex items-center justify-center whitespace-nowrap focus-visible:ring-2 focus:outline-none data-disabled:text-muted', options.theme.transitions && 'transition'],
    cellWeek: 'relative text-center text-muted'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        headCell: `text-${color}`,
        cellTrigger: `focus-visible:ring-${color}`
      }])),
      neutral: {
        headCell: 'text-highlighted',
        cellTrigger: 'focus-visible:ring-inverted'
      }
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: ''
    },
    type: {
      day: {
        grid: 'border-collapse',
        gridRow: 'grid-cols-7 place-items-center',
        cellTrigger: 'm-0.5 rounded-full data-unavailable:line-through data-unavailable:text-muted data-unavailable:pointer-events-none data-today:font-semibold data-[outside-view]:text-muted'
      },
      month: {
        gridRow: 'grid-cols-4 gap-1',
        cellTrigger: 'w-full rounded-md'
      },
      year: {
        gridRow: 'grid-cols-4 gap-1',
        cellTrigger: 'w-full rounded-md tabular-nums'
      }
    },
    size: {
      xs: {
        heading: 'text-xs',
        cell: 'text-xs',
        cellWeek: 'text-xs',
        headCell: 'text-[10px]',
        headCellWeek: 'text-[10px]',
        body: 'space-y-2 pt-2'
      },
      sm: {
        heading: 'text-xs',
        headCell: 'text-xs',
        headCellWeek: 'text-xs',
        cellWeek: 'text-xs',
        cell: 'text-xs'
      },
      md: {
        heading: 'text-sm',
        headCell: 'text-xs',
        headCellWeek: 'text-xs',
        cellWeek: 'text-xs',
        cell: 'text-sm'
      },
      lg: {
        heading: 'text-md',
        headCell: 'text-md',
        headCellWeek: 'text-md'
      },
      xl: {
        heading: 'text-lg',
        headCell: 'text-lg',
        headCellWeek: 'text-lg'
      }
    },
    weekNumbers: {
      true: ''
    }
  },
  compoundVariants: [
    ...Object.entries(triggerSizeClasses.day).map(([size, cellTrigger]) => ({
      size,
      type: 'day' as CalendarPanelType,
      class: { cellTrigger }
    })),
    ...Object.entries(triggerSizeClasses.picker).map(([size, cellTrigger]) => ({
      size,
      type: ['month', 'year'] as CalendarPanelType[],
      class: { cellTrigger }
    })),
    {
      type: 'day',
      weekNumbers: true,
      class: {
        gridRow: 'grid-cols-8',
        gridWeekDaysRow: 'grid-cols-8 [&>*:first-child]:col-start-2'
      }
    },
    ...(options.theme.colors || []).flatMap((color: string) => pickerTriggerVariants.map(variant => ({
      color,
      variant,
      type: 'day' as CalendarPanelType,
      class: {
        cellTrigger: getTriggerClass(color, variant, true)
      }
    }))),
    ...(options.theme.colors || []).flatMap((color: string) => pickerTriggerVariants.map(variant => ({
      color,
      variant,
      type: ['month', 'year'] as CalendarPanelType[],
      class: {
        cellTrigger: getTriggerClass(color, variant, false)
      }
    }))),
    ...pickerTriggerVariants.map(variant => ({
      color: 'neutral',
      variant,
      type: 'day' as CalendarPanelType,
      class: {
        cellTrigger: getNeutralTriggerClass(variant, true)
      }
    })),
    ...pickerTriggerVariants.map(variant => ({
      color: 'neutral',
      variant,
      type: ['month', 'year'] as CalendarPanelType[],
      class: {
        cellTrigger: getNeutralTriggerClass(variant, false)
      }
    }))
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'solid',
    type: 'day'
  }
})
