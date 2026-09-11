import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'rounded-lg overflow-hidden flex flex-col justify-between',
    header: 'flex items-start gap-4 p-4 sm:p-6',
    icon: 'flex items-center justify-center shrink-0 rounded-lg',
    iconIcon: '',
    content: 'flex-1 min-w-0',
    title: 'text-sm font-medium text-muted',
    value: 'text-2xl font-semibold text-default mt-1',
    label: 'text-xs text-muted mt-1',
    progress: '',
    sparkline: '',
    sparklineSvg: 'w-full',
    sparklinePath: 'fill-none transition-all duration-300',
    sparklineArea: 'transition-opacity duration-300',
    sparklineZeroLine: 'stroke-default dark:stroke-default',
    trend: 'flex items-center gap-1 text-xs font-medium mt-1',
    trendIcon: 'shrink-0',
    trendValue: ''
  },
  variants: {
    size: {
      xs: {
        icon: 'size-8 p-1.5',
        iconIcon: 'size-4',
        value: 'text-xl',
        title: 'text-xs',
        sparkline: 'h-8'
      },
      sm: {
        icon: 'size-9 p-2',
        iconIcon: 'size-4',
        value: 'text-2xl',
        title: 'text-sm',
        sparkline: 'h-10'
      },
      md: {
        icon: 'size-10 p-2',
        iconIcon: 'size-5',
        value: 'text-3xl',
        title: 'text-sm',
        sparkline: 'h-12'
      },
      lg: {
        icon: 'size-12 p-2.5',
        iconIcon: 'size-6',
        value: 'text-4xl',
        title: 'text-base',
        sparkline: 'h-14'
      },
      xl: {
        icon: 'size-14 p-3',
        iconIcon: 'size-7',
        value: 'text-5xl',
        title: 'text-base',
        sparkline: 'h-16'
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        icon: `bg-${color}-500/10 text-${color}-500 dark:text-${color}-400`,
        iconIcon: `text-${color}-500 dark:text-${color}-400`,
        trendIcon: `text-${color}-500 dark:text-${color}-400`,
        sparklinePath: `stroke-${color}-500 dark:stroke-${color}-400`,
        sparklineArea: `fill-${color}-500/20 dark:fill-${color}-400/20`
      }])),
      neutral: {
        icon: 'bg-gray-500/10 text-gray-500 dark:text-gray-400',
        iconIcon: 'text-gray-500 dark:text-gray-400',
        trendIcon: 'text-gray-500 dark:text-gray-400',
        sparklinePath: 'stroke-gray-500 dark:stroke-gray-400',
        sparklineArea: 'fill-gray-500/20 dark:fill-gray-400/20'
      }
    },
    variant: {
      solid: {
        root: 'bg-inverted text-inverted',
        title: 'text-dimmed',
        value: 'text-inverted'
      },
      outline: {
        root: 'bg-default ring ring-default',
        title: 'text-muted',
        value: 'text-default'
      },
      soft: {
        root: 'bg-elevated/50',
        title: 'text-toned',
        value: 'text-default'
      },
      subtle: {
        root: 'bg-elevated/50 ring ring-default',
        title: 'text-toned',
        value: 'text-default'
      },
      ghost: {
        root: '',
        title: 'text-muted',
        value: 'text-default'
      },
      naked: {
        root: '',
        header: 'p-0 sm:p-0',
        title: 'text-muted',
        value: 'text-default'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
