import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex gap-1.5',
    item: 'group relative flex flex-1 gap-3',
    container: 'relative flex items-center gap-1.5',
    indicator: 'group-data-[state=completed]:text-inverted group-data-[state=active]:text-inverted text-muted',
    separator: 'flex-1 rounded-full bg-elevated',
    wrapper: 'w-full',
    date: 'text-dimmed text-xs/5',
    title: 'font-medium text-highlighted text-sm',
    description: 'text-muted text-wrap text-sm'
  },

  variants: {
    orientation: {
      horizontal: {
        root: 'flex-row w-full',
        item: 'flex-col',
        separator: 'h-0.5'
      },
      vertical: {
        root: 'flex-col',
        container: 'flex-col',
        separator: 'w-0.5'
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
      '3xs': '',
      '2xs': '',
      'xs': '',
      'sm': '',
      'md': '',
      'lg': '',
      'xl': '',
      '2xl': '',
      '3xl': ''
    }
  },

  compoundVariants: [{
    orientation: 'horizontal',
    size: '3xs',
    class: {
      wrapper: 'pe-4.5'
    }
  }, {
    orientation: 'horizontal',
    size: '2xs',
    class: {
      wrapper: 'pe-5'
    }
  }, {
    orientation: 'horizontal',
    size: 'xs',
    class: {
      wrapper: 'pe-5.5'
    }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: {
      wrapper: 'pe-6'
    }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: {
      wrapper: 'pe-6.5'
    }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: {
      wrapper: 'pe-7'
    }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: {
      wrapper: 'pe-7.5'
    }
  }, {
    orientation: 'horizontal',
    size: '2xl',
    class: {
      wrapper: 'pe-8'
    }
  }, {
    orientation: 'horizontal',
    size: '3xl',
    class: {
      wrapper: 'pe-8.5'
    }
  }, {
    orientation: 'vertical',
    size: '3xs',
    class: {
      wrapper: '-mt-0.5 pb-4.5'
    }
  }, {
    orientation: 'vertical',
    size: '2xs',
    class: {
      wrapper: 'pb-5'
    }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: {
      wrapper: 'mt-0.5 pb-5.5'
    }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: {
      wrapper: 'mt-1 pb-6'
    }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: {
      wrapper: 'mt-1.5 pb-6.5'
    }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: {
      wrapper: 'mt-2 pb-7'
    }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: {
      wrapper: 'mt-2.5 pb-7.5'
    }
  }, {
    orientation: 'vertical',
    size: '2xl',
    class: {
      wrapper: 'mt-3 pb-8'
    }
  }, {
    orientation: 'vertical',
    size: '3xl',
    class: {
      wrapper: 'mt-3.5 pb-8.5'
    }
  }],

  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
