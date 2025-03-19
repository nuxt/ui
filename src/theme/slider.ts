import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex items-center select-none touch-none',
    track: 'relative bg-(--ui-bg-accented) overflow-hidden rounded-full grow',
    range: 'absolute rounded-full',
    thumb: 'rounded-full bg-(--ui-bg) ring-2 focus-visible:outline-2 focus-visible:outline-offset-2'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        range: `bg-(--ui-${color})`,
        thumb: `ring-(--ui-${color}) focus-visible:outline-(--ui-${color})/50`
      }])),
      neutral: {
        range: 'bg-(--ui-bg-inverted)',
        thumb: 'ring-(--ui-border-inverted) focus-visible:outline-(--ui-border-inverted)/50'
      }
    },
    size: {
      xs: {
        thumb: 'size-3'
      },
      sm: {
        thumb: 'size-3.5'
      },
      md: {
        thumb: 'size-4'
      },
      lg: {
        thumb: 'size-4.5'
      },
      xl: {
        thumb: 'size-5'
      }
    },
    orientation: {
      horizontal: {
        root: 'w-full',
        range: 'h-full'
      },
      vertical: {
        root: 'flex-col h-full',
        range: 'w-full'
      }
    },
    disabled: {
      true: {
        root: 'opacity-75 cursor-not-allowed'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    size: 'xs',
    class: {
      track: 'h-[6px]'
    }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: {
      track: 'h-[7px]'
    }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: {
      track: 'h-[8px]'
    }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: {
      track: 'h-[9px]'
    }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: {
      track: 'h-[10px]'
    }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: {
      track: 'w-[6px]'
    }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: {
      track: 'w-[7px]'
    }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: {
      track: 'w-[8px]'
    }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: {
      track: 'w-[9px]'
    }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: {
      track: 'w-[10px]'
    }
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
