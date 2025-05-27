import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex',
    item: 'group relative flex flex-1',
    container: 'relative flex',
    indicator: 'group-data-[state=completed]:text-inverted group-data-[state=active]:text-inverted text-muted',
    separator: 'absolute rounded-full bg-elevated',
    wrapper: 'w-full',
    title: 'font-medium text-highlighted text-sm',
    description: 'text-muted text-wrap text-sm'
  },

  variants: {
    orientation: {
      horizontal: {
        root: 'flex-row w-full',
        item: 'flex-col',
        separator: 'top-[calc(50%-2px)] end-[2px] h-0.5'
      },
      vertical: {
        root: 'flex-col',
        separator: 'start-[calc(50%-1px)] bottom-[2px] w-0.5'
      }
    },

    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: `group-data-[state=completed]:bg-${color} group-data-[state=active]:bg-${color}`,
        separator: `group-data-[state=completed]:bg-${color}`
      }])),
      neutral: {
        indicator: 'group-data-[state=completed]:bg-inverted group-data-[state=active]:bg-inverted',
        separator: 'group-data-[state=completed]:bg-inverted'
      }
    },

    size: {
      xs: {
        item: 'gap-1.5'
      },
      sm: {
        item: 'gap-2'
      },
      md: {
        item: 'gap-2.5'
      },
      lg: {
        item: 'gap-3'
      },
      xl: {
        item: 'gap-3.5'
      }
    }
  },

  compoundVariants: [{
    orientation: 'horizontal',
    size: 'xs',
    class: { separator: 'start-[26px]', wrapper: 'pe-6' }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: { separator: 'start-[30px]', wrapper: 'pe-7' }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: { separator: 'start-[34px]', wrapper: 'pe-8' }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: { separator: 'start-[38px]', wrapper: 'pe-9' }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: { separator: 'start-[42px]', wrapper: 'pe-10' }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: { separator: 'top-[26px]', wrapper: 'mt-0.5 pb-6' }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: { separator: 'top-[30px]', wrapper: 'mt-1 pb-7' }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: { separator: 'top-[34px]', wrapper: 'mt-1.5 pb-8' }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: { separator: 'top-[38px]', wrapper: 'mt-2 pb-9' }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: { separator: 'top-[42px]', wrapper: 'mt-2.5 pb-10' }
  }],

  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
