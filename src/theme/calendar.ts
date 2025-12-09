import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    header: 'flex items-center justify-between',
    body: 'flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0',
    heading: 'text-center font-medium truncate mx-auto',
    grid: 'w-full border-collapse select-none space-y-1 focus:outline-none',
    gridRow: 'grid grid-cols-7 place-items-center',
    gridWeekDaysRow: 'mb-1 grid w-full grid-cols-7',
    gridBody: 'grid',
    headCell: 'rounded-md',
    cell: 'relative text-center',
    cellTrigger: ['m-0.5 relative flex items-center justify-center rounded-full whitespace-nowrap focus-visible:ring-2 focus:outline-none data-disabled:text-muted data-unavailable:line-through data-unavailable:text-muted data-unavailable:pointer-events-none data-today:font-semibold data-[outside-view]:text-muted', options.theme.transitions && 'transition']
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
    size: {
      xs: {
        heading: 'text-xs',
        cell: 'text-xs',
        headCell: 'text-[10px]',
        cellTrigger: 'size-7',
        body: 'space-y-2 pt-2'
      },
      sm: {
        heading: 'text-xs',
        headCell: 'text-xs',
        cell: 'text-xs',
        cellTrigger: 'size-7'
      },
      md: {
        heading: 'text-sm',
        headCell: 'text-xs',
        cell: 'text-sm',
        cellTrigger: 'size-8'
      },
      lg: {
        heading: 'text-md',
        headCell: 'text-md',
        cellTrigger: 'size-9 text-md'
      },
      xl: {
        heading: 'text-lg',
        headCell: 'text-lg',
        cellTrigger: 'size-10 text-lg'
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'solid',
    class: {
      cellTrigger: `data-[selected]:bg-${color} data-[selected]:text-inverted data-today:not-data-[selected]:text-${color} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: {
      cellTrigger: `data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-${color}/50 data-[selected]:text-${color} data-today:not-data-[selected]:text-${color} data-[highlighted]:bg-${color}/10 hover:not-data-[selected]:bg-${color}/10`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: {
      cellTrigger: `data-[selected]:bg-${color}/10 data-[selected]:text-${color} data-today:not-data-[selected]:text-${color} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: {
      cellTrigger: `data-[selected]:bg-${color}/10 data-[selected]:text-${color} data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-${color}/25 data-today:not-data-[selected]:text-${color} data-[highlighted]:bg-${color}/20 hover:not-data-[selected]:bg-${color}/20`
    }
  })), {
    color: 'neutral',
    variant: 'solid',
    class: {
      cellTrigger: 'data-[selected]:bg-inverted data-[selected]:text-inverted data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10'
    }
  }, {
    color: 'neutral',
    variant: 'outline',
    class: {
      cellTrigger: 'data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-[selected]:text-default data-[selected]:bg-default data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/10 hover:not-data-[selected]:bg-inverted/10'
    }
  }, {
    color: 'neutral',
    variant: 'soft',
    class: {
      cellTrigger: 'data-[selected]:bg-elevated data-[selected]:text-default data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10'
    }
  }, {
    color: 'neutral',
    variant: 'subtle',
    class: {
      cellTrigger: 'data-[selected]:bg-elevated data-[selected]:text-default data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10'
    }
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'solid'
  }
})
