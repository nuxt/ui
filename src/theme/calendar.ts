import type { ModuleOptions } from '../module'

type PickerTriggerVariant = 'solid' | 'outline' | 'soft' | 'subtle'

function getPickerTriggerClass(color: string, variant: PickerTriggerVariant) {
  switch (variant) {
    case 'solid':
      return `data-[selected]:bg-${color} data-[selected]:text-inverted data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
    case 'outline':
      return `data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-${color}/50 data-[selected]:text-${color} data-[highlighted]:bg-${color}/10 hover:not-data-[selected]:bg-${color}/10`
    case 'soft':
      return `data-[selected]:bg-${color}/10 data-[selected]:text-${color} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
    case 'subtle':
      return `data-[selected]:bg-${color}/10 data-[selected]:text-${color} data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-${color}/25 data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
  }
}

function getNeutralPickerTriggerClass(variant: PickerTriggerVariant) {
  switch (variant) {
    case 'solid':
      return 'data-[selected]:bg-inverted data-[selected]:text-inverted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10'
    case 'outline':
      return 'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-[selected]:text-default data-[selected]:bg-default data-[highlighted]:bg-inverted/10 hover:not-data-[selected]:bg-inverted/10'
    case 'soft':
      return 'data-[selected]:bg-elevated data-[selected]:text-default data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10'
    case 'subtle':
      return 'data-[selected]:bg-elevated data-[selected]:text-default data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10'
  }
}

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    header: 'flex items-center justify-between',
    body: 'flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0',
    heading: 'mx-auto text-center font-medium',
    grid: 'w-full border-collapse select-none space-y-1 focus:outline-none',
    gridRow: 'grid grid-cols-7 place-items-center',
    gridWeekDaysRow: 'mb-1 grid w-full grid-cols-7',
    gridBody: 'grid',
    headCell: 'rounded-md',
    headCellWeek: 'rounded-md text-muted',
    cell: 'relative text-center',
    cellTrigger: ['m-0.5 relative flex items-center justify-center rounded-full whitespace-nowrap focus-visible:ring-2 focus:outline-none data-disabled:text-muted data-unavailable:line-through data-unavailable:text-muted data-unavailable:pointer-events-none data-today:font-semibold data-[outside-view]:text-muted', options.theme.transitions && 'transition'],
    cellWeek: 'relative text-center text-muted',
    monthGrid: 'w-full select-none space-y-1 focus:outline-none',
    monthGridRow: 'grid grid-cols-4 gap-1',
    monthCell: 'relative text-center',
    monthCellTrigger: ['relative flex w-full items-center justify-center rounded-md whitespace-nowrap focus-visible:ring-2 focus:outline-none data-disabled:text-muted', options.theme.transitions && 'transition'],
    yearGrid: 'w-full select-none space-y-1 focus:outline-none',
    yearGridRow: 'grid grid-cols-4 gap-1',
    yearCell: 'relative text-center',
    yearCellTrigger: ['relative flex w-full items-center justify-center rounded-md whitespace-nowrap tabular-nums focus-visible:ring-2 focus:outline-none data-disabled:text-muted', options.theme.transitions && 'transition']
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        headCell: `text-${color}`,
        cellTrigger: `focus-visible:ring-${color}`,
        monthCellTrigger: `focus-visible:ring-${color}`,
        yearCellTrigger: `focus-visible:ring-${color}`
      }])),
      neutral: {
        headCell: 'text-highlighted',
        cellTrigger: 'focus-visible:ring-inverted',
        monthCellTrigger: 'focus-visible:ring-inverted',
        yearCellTrigger: 'focus-visible:ring-inverted'
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
        heading: 'text-xs',
        cell: 'text-xs',
        cellWeek: 'text-xs',
        headCell: 'text-[10px]',
        headCellWeek: 'text-[10px]',
        cellTrigger: 'size-7',
        body: 'space-y-2 pt-2',
        monthCellTrigger: 'h-7 px-2 text-xs',
        yearCellTrigger: 'h-7 px-2 text-xs'
      },
      sm: {
        heading: 'text-xs',
        headCell: 'text-xs',
        headCellWeek: 'text-xs',
        cellWeek: 'text-xs',
        cell: 'text-xs',
        cellTrigger: 'size-7',
        monthCellTrigger: 'h-7 px-2 text-xs',
        yearCellTrigger: 'h-7 px-2 text-xs'
      },
      md: {
        heading: 'text-sm',
        headCell: 'text-xs',
        headCellWeek: 'text-xs',
        cellWeek: 'text-xs',
        cell: 'text-sm',
        cellTrigger: 'size-8',
        monthCellTrigger: 'h-8 px-3 text-sm',
        yearCellTrigger: 'h-8 px-3 text-sm'
      },
      lg: {
        heading: 'text-md',
        headCell: 'text-md',
        headCellWeek: 'text-md',
        cellTrigger: 'size-9 text-md',
        monthCellTrigger: 'h-9 px-4 text-md',
        yearCellTrigger: 'h-9 px-4 text-md'
      },
      xl: {
        heading: 'text-lg',
        headCell: 'text-lg',
        headCellWeek: 'text-lg',
        cellTrigger: 'size-10 text-lg',
        monthCellTrigger: 'h-10 px-5 text-lg',
        yearCellTrigger: 'h-10 px-5 text-lg'
      }
    },
    weekNumbers: {
      true: {
        gridRow: 'grid-cols-8',
        gridWeekDaysRow: 'grid-cols-8 [&>*:first-child]:col-start-2'
      }
    }
  },
  compoundVariants: [
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'solid',
      class: {
        cellTrigger: `data-[selected]:bg-${color} data-[selected]:text-inverted data-today:not-data-[selected]:text-${color} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
      }
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'outline',
      class: {
        cellTrigger: `data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-${color}/50 data-[selected]:text-${color} data-today:not-data-[selected]:text-${color} data-[highlighted]:bg-${color}/10 hover:not-data-[selected]:bg-${color}/10`
      }
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'soft',
      class: {
        cellTrigger: `data-[selected]:bg-${color}/10 data-[selected]:text-${color} data-today:not-data-[selected]:text-${color} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
      }
    })),
    ...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: 'subtle',
      class: {
        cellTrigger: `data-[selected]:bg-${color}/10 data-[selected]:text-${color} data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-${color}/25 data-today:not-data-[selected]:text-${color} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
      }
    })),
    ...(options.theme.colors || []).flatMap((color: string) => (['solid', 'outline', 'soft', 'subtle'] as PickerTriggerVariant[]).map(variant => ({
      color,
      variant,
      class: {
        monthCellTrigger: getPickerTriggerClass(color, variant),
        yearCellTrigger: getPickerTriggerClass(color, variant)
      }
    }))),
    {
      color: 'neutral',
      variant: 'solid',
      class: {
        cellTrigger: 'data-[selected]:bg-inverted data-[selected]:text-inverted data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10',
        monthCellTrigger: getNeutralPickerTriggerClass('solid'),
        yearCellTrigger: getNeutralPickerTriggerClass('solid')
      }
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: {
        cellTrigger: 'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-[selected]:text-default data-[selected]:bg-default data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/10 hover:not-data-[selected]:bg-inverted/10',
        monthCellTrigger: getNeutralPickerTriggerClass('outline'),
        yearCellTrigger: getNeutralPickerTriggerClass('outline')
      }
    },
    {
      color: 'neutral',
      variant: 'soft',
      class: {
        cellTrigger: 'data-[selected]:bg-elevated data-[selected]:text-default data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10',
        monthCellTrigger: getNeutralPickerTriggerClass('soft'),
        yearCellTrigger: getNeutralPickerTriggerClass('soft')
      }
    },
    {
      color: 'neutral',
      variant: 'subtle',
      class: {
        cellTrigger: 'data-[selected]:bg-elevated data-[selected]:text-default data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10',
        monthCellTrigger: getNeutralPickerTriggerClass('subtle'),
        yearCellTrigger: getNeutralPickerTriggerClass('subtle')
      }
    }
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'solid'
  }
})
