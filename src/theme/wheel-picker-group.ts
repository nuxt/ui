import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative isolate inline-flex items-stretch rounded-md bg-default ring ring-inset ring-accented',
    content: 'relative flex items-stretch',
    indicator: 'absolute inset-x-1 top-1/2 -translate-y-1/2 pointer-events-none rounded-md'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: `bg-${color}/10`
      }])),
      neutral: {
        indicator: 'bg-elevated'
      }
    },
    variant: {
      pill: {
        indicator: ''
      },
      line: {
        indicator: 'inset-x-0 rounded-none bg-transparent! border-y border-default'
      }
    }
  },
  defaultVariants: {
    color: 'neutral',
    variant: 'pill'
  }
})
