import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'gap-2',
    base: 'relative',
    track: '',
    indicator: 'rounded-full size-full transition-transform duration-200 ease-out',
    status: 'flex justify-end text-dimmed transition-[width] duration-200',
    steps: 'grid items-end',
    step: 'truncate text-end row-start-1 col-start-1 transition-opacity'
  },
  variants: {
    variant: {
      linear: {
        base: 'overflow-hidden rounded-full bg-(--ui-bg-accented)'
      },
      circular: {
        root: 'gap-0 items-center',
        base: 'relative rounded-full',
        track: 'fill-none stroke-(--ui-bg-accented)',
        indicator: 'fill-none transition-[stroke-dasharray,opacity]',
        status: 'flex items-center justify-center'
      }
    },
    animation: {
      'carousel': '',
      'carousel-inverse': '',
      'swing': '',
      'elastic': ''
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: `bg-${color}`,
        steps: `text-${color}`,
        track: 'stroke-accented'
      }])),
      neutral: {
        indicator: 'bg-inverted',
        steps: 'text-inverted',
        track: 'stroke-accented'
      }
    },
    size: {
      '2xs': {
        status: 'text-xs',
        steps: 'text-xs'
      },
      'xs': {
        status: 'text-xs',
        steps: 'text-xs'
      },
      'sm': {
        status: 'text-sm',
        steps: 'text-sm'
      },
      'md': {
        status: 'text-sm',
        steps: 'text-sm'
      },
      'lg': {
        status: 'text-sm',
        steps: 'text-sm'
      },
      'xl': {
        status: 'text-base',
        steps: 'text-base'
      },
      '2xl': {
        status: 'text-base',
        steps: 'text-base'
      }
    },
    step: {
      active: {
        step: 'opacity-100'
      },
      first: {
        step: 'opacity-100 text-muted'
      },
      other: {
        step: 'opacity-0'
      },
      last: {
        step: ''
      }
    },
    orientation: {
      horizontal: {
        root: 'w-full flex flex-col',
        base: 'w-full',
        status: 'flex-row'
      },
      vertical: {
        root: 'h-full flex flex-row-reverse',
        base: 'h-full',
        status: 'flex-col'
      }
    },
    inverted: {
      true: {
        status: 'self-end'
      }
    }
  },
  compoundVariants: [{
    variant: 'circular',
    orientation: 'horizontal',
    animation: 'carousel',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[circular-carousel_2s_ease-in-out_infinite]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    animation: 'carousel-inverse',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[circular-carousel-inverse_2s_ease-in-out_infinite]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    animation: 'swing',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[circular-swing_2s_ease-in-out_infinite]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    animation: 'elastic',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[circular-elastic_2s_ease-in-out_infinite]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: '2xs',
    class: {
      base: 'rounded-full w-8 h-8',
      indicator: 'stroke-[6px]',
      track: 'stroke-[6px]',
      status: 'text-[8px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: 'xs',
    class: {
      base: 'rounded-full w-10 h-10',
      indicator: 'stroke-[6px]',
      track: 'stroke-[6px]',
      status: 'text-[9px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: 'sm',
    class: {
      base: 'rounded-full w-12 h-12',
      indicator: 'stroke-[6px]',
      track: 'stroke-[6px]',
      status: 'text-[9px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: 'md',
    class: {
      base: 'rounded-full w-16 h-16',
      indicator: 'stroke-[6px]',
      track: 'stroke-[6px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: 'lg',
    class: {
      base: 'rounded-full w-20 h-20',
      indicator: 'stroke-[8px]',
      track: 'stroke-[8px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: 'xl',
    class: {
      base: 'rounded-full w-24 h-24',
      indicator: 'stroke-[10px]',
      track: 'stroke-[8px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: '2xl',
    class: {
      base: 'rounded-full w-32 h-32',
      indicator: 'stroke-[12px]',
      track: 'stroke-[10px]'
    }
  }, {
    variant: 'circular',
    orientation: 'horizontal',
    size: '2xs',
    class: {
      base: 'rounded-full w-8 h-8',
      indicator: 'stroke-[6px]',
      track: 'stroke-[6px]',
      status: 'text-[8px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: 'xs',
    class: {
      base: 'rounded-full w-10 h-10',
      indicator: 'stroke-[6px]',
      track: 'stroke-[6px]',
      status: 'text-[9px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: 'sm',
    class: {
      base: 'rounded-full w-12 h-12',
      indicator: 'stroke-[6px]',
      track: 'stroke-[6px]',
      status: 'text-[9px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: 'md',
    class: {
      base: 'rounded-full w-16 h-16',
      indicator: 'stroke-[6px]',
      track: 'stroke-[6px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: 'lg',
    class: {
      base: 'rounded-full w-20 h-20',
      indicator: 'stroke-[8px]',
      track: 'stroke-[8px]'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: 'xl',
    class: {
      base: 'rounded-full w-24 h-24',
      indicator: 'stroke-[10px]',
      track: 'stroke-8'
    }
  },
  {
    variant: 'circular',
    orientation: 'horizontal',
    size: '2xl',
    class: {
      base: 'rounded-full w-32 h-32',
      indicator: 'stroke-[12px]',
      track: 'stroke-10'
    }
  }, {
    variant: 'linear',
    inverted: true,
    orientation: 'horizontal',
    class: {
      step: 'text-start',
      status: 'flex-row-reverse'
    }
  }, {
    variant: 'linear',
    inverted: true,
    orientation: 'vertical',
    class: {
      steps: 'items-start',
      status: 'flex-col-reverse'
    }
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    size: '2xs',
    class: 'h-px'
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    size: 'xs',
    class: 'h-0.5'
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    size: 'sm',
    class: 'h-1'
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    size: 'md',
    class: 'h-2'
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    size: 'lg',
    class: 'h-3'
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    size: 'xl',
    class: 'h-4'
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    size: '2xl',
    class: 'h-5'
  }, {
    variant: 'linear',
    orientation: 'vertical',
    size: '2xs',
    class: 'w-px'
  }, {
    variant: 'linear',
    orientation: 'vertical',
    size: 'xs',
    class: 'w-0.5'
  }, {
    variant: 'linear',
    orientation: 'vertical',
    size: 'sm',
    class: 'w-1'
  }, {
    variant: 'linear',
    orientation: 'vertical',
    size: 'md',
    class: 'w-2'
  }, {
    variant: 'linear',
    orientation: 'vertical',
    size: 'lg',
    class: 'w-3'
  }, {
    variant: 'linear',
    orientation: 'vertical',
    size: 'xl',
    class: 'w-4'
  }, {
    variant: 'linear',
    orientation: 'vertical',
    size: '2xl',
    class: 'w-5'
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    animation: 'carousel',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[carousel_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'vertical',
    animation: 'carousel',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[carousel-vertical_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    animation: 'carousel-inverse',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[carousel-inverse_2s_ease-in-out_infinite] data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'vertical',
    animation: 'carousel-inverse',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    animation: 'swing',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[swing_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'vertical',
    animation: 'swing',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[swing-vertical_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    animation: 'elastic',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[elastic_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'vertical',
    animation: 'elastic',
    class: {
      indicator: 'data-[state=indeterminate]:animate-[elastic-vertical_2s_ease-in-out_infinite]'
    }
  }],
  defaultVariants: {
    variant: 'linear',
    animation: 'carousel',
    color: 'primary',
    size: 'md'
  }
})
