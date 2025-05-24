import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex gap-4',
    header: 'flex',
    item: 'group text-center relative w-full',
    container: 'relative',
    trigger: 'rounded-full font-medium text-center align-middle flex items-center justify-center font-semibold group-data-[state=completed]:text-inverted group-data-[state=active]:text-inverted text-muted bg-elevated focus-visible:outline-2 focus-visible:outline-offset-2',
    indicator: 'flex items-center justify-center size-full',
    icon: 'shrink-0',
    separator: 'absolute rounded-full group-data-[disabled]:opacity-75 bg-accented',
    wrapper: '',
    title: 'font-medium text-default',
    description: 'text-muted text-wrap'
  },

  variants: {
    orientation: {
      horizontal: {
        root: 'flex-col',
        container: 'flex justify-center',
        separator: 'top-[calc(50%-2px)] h-0.5',
        wrapper: 'mt-1'
      },
      vertical: {
        header: 'flex-col gap-4',
        item: 'flex text-start',
        separator: 'start-[calc(50%-1px)] -bottom-[10px] w-0.5'
      }
    },

    size: {
      s: {
        trigger: 'size-6 text-xs',
        icon: 'size-3',
        title: 'text-xs',
        description: 'text-xs',
        wrapper: 'mt-1.5'
      },
      md: {
        trigger: 'size-8 text-sm',
        icon: 'size-4',
        title: 'text-xs',
        description: 'text-xs',
        wrapper: 'mt-1.5'
      }
    },

    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        trigger: `group-data-[state=completed]:bg-${color} group-data-[state=active]:bg-${color} focus-visible:outline-${color}`,
        separator: `group-data-[state=completed]:bg-${color}`
      }])),
      neutral: {
        trigger: `group-data-[state=completed]:bg-inverted group-data-[state=active]:bg-inverted focus-visible:outline-inverted`,
        separator: `group-data-[state=completed]:bg-inverted`
      }
    }
  },

  compoundVariants: [{
    orientation: 'horizontal',
    size: 'md',
    class: { separator: 'start-[calc(50%+16px)] end-[calc(-50%+16px)]' }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: { separator: 'top-[32px]', item: 'gap-1.5' }
  }],

  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
