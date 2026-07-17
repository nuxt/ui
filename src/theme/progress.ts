import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'gap-2',
    base: 'relative',
    track: 'fill-none stroke-(--ui-bg-accented)',
    indicator: 'rounded-full size-full transition-transform duration-200 ease-out [stroke-linecap:round] motion-reduce:data-[state=indeterminate]:animate-pulse',
    status: 'flex text-dimmed ',
    steps: 'grid items-end',
    step: 'truncate text-end row-start-1 col-start-1 transition-opacity'
  },
  variants: {
    animation: {
      'carousel': '',
      'carousel-inverse': '',
      'swing': '',
      'elastic': ''
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: `bg-${color} stroke-${color}`,
        steps: `text-${color}`
      }])),
      neutral: {
        indicator: 'bg-inverted stroke-inverted',
        steps: 'text-inverted'
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
        root: 'w-full flex',
        base: 'w-full',
        status: 'flex-row items-center justify-end min-w-fit'
      },
      vertical: {
        root: 'h-full flex',
        base: 'h-full',
        status: 'flex-col justify-end min-h-fit'
      }
    },
    inverted: {
      true: ''
    },
    variant: {
      linear: {
        base: 'overflow-hidden rounded-full bg-accented',
        status: 'transition-[width] duration-200'
      },
      circular: {
        track: 'fill-none [stroke-width:var(--ui-progress-thickness)] [r:calc(50px-var(--ui-progress-thickness)/2)]',
        indicator: 'fill-none origin-center -rotate-90 [stroke-width:var(--ui-progress-thickness)] [r:calc(50px-var(--ui-progress-thickness)/2)] transition-[stroke-dasharray,opacity] duration-700 data-[value=\'0\']:opacity-0',
        status: 'absolute inset-0 items-center justify-center'
      }
    }
  },
  compoundVariants: [{
    variant: 'circular',
    orientation: 'vertical',
    class: {
      root: 'flex-col items-center'
    }
  }, {
    variant: 'circular',
    orientation: 'horizontal',
    class: {
      root: 'flex-row items-center'
    }
  }, {
    variant: 'circular',
    inverted: true,
    class: {
      indicator: 'not-data-[state=indeterminate]:-scale-y-100'
    }
  }, {
    variant: 'circular',
    size: '2xs',
    thickness: 'auto',
    class: '[--ui-progress-thickness:2px]'
  }, {
    variant: 'circular',
    size: 'xs',
    thickness: 'auto',
    class: '[--ui-progress-thickness:4px]'
  }, {
    variant: 'circular',
    size: 'sm',
    thickness: 'auto',
    class: '[--ui-progress-thickness:6px]'
  }, {
    variant: 'circular',
    size: 'md',
    thickness: 'auto',
    class: '[--ui-progress-thickness:8px]'
  }, {
    variant: 'circular',
    size: 'lg',
    thickness: 'auto',
    class: '[--ui-progress-thickness:10px]'
  }, {
    variant: 'circular',
    size: 'xl',
    thickness: 'auto',
    class: '[--ui-progress-thickness:12px]'
  }, {
    variant: 'circular',
    size: '2xl',
    thickness: 'auto',
    class: '[--ui-progress-thickness:14px]'
  }, {
    variant: 'circular',
    size: '2xs',
    class: 'size-12'
  }, {
    variant: 'circular',
    size: 'xs',
    class: 'size-14'
  }, {
    variant: 'circular',
    size: 'sm',
    class: 'size-18'
  }, {
    variant: 'circular',
    size: 'md',
    class: 'size-22'
  }, {
    variant: 'circular',
    size: 'lg',
    class: 'size-28'
  }, {
    variant: 'circular',
    size: 'xl',
    class: 'size-30'
  }, {
    variant: 'circular',
    size: '2xl',
    class: 'size-34'
  }, {
    variant: 'circular',
    animation: 'carousel',
    class: {
      indicator: 'data-[state=indeterminate]:transform-view data-[state=indeterminate]:origin-center data-[state=indeterminate]:[stroke-dasharray:75,100] data-[state=indeterminate]:animate-[circular-rotate_1.4s_linear_infinite] data-[state=indeterminate]:transition-none'
    }
  }, {
    variant: 'circular',
    animation: 'carousel-inverse',
    class: {
      indicator: 'data-[state=indeterminate]:transform-view data-[state=indeterminate]:origin-center data-[state=indeterminate]:[stroke-dasharray:75,100] data-[state=indeterminate]:animate-[circular-rotate-ccw_1.4s_linear_infinite] data-[state=indeterminate]:transition-none'
    }
  }, {
    variant: 'circular',
    animation: 'swing',
    class: {
      indicator: 'data-[state=indeterminate]:transform-view data-[state=indeterminate]:origin-center data-[state=indeterminate]:[stroke-dasharray:75,100] data-[state=indeterminate]:transition-none data-[state=indeterminate]:animate-[circular-swing_1.4s_ease-in-out_infinite]'
    }
  }, {
    variant: 'circular',
    animation: 'elastic',
    class: {
      indicator: 'data-[state=indeterminate]:transform-view data-[state=indeterminate]:origin-center data-[state=indeterminate]:animate-[circular-rotate_2s_linear_infinite,circular-elastic_1.4s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    inverted: true,
    orientation: 'horizontal',
    class: {
      step: 'text-start',
      status: 'self-end flex-row-reverse'
    }
  }, {
    variant: 'linear',
    inverted: true,
    orientation: 'vertical',
    class: {
      steps: 'items-start',
      status: 'self-end flex-col-reverse'
    }
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    class: {
      root: 'flex-col'
    }
  }, {
    variant: 'linear',
    orientation: 'vertical',
    class: {
      root: 'flex-row-reverse'
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
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[carousel_2s_ease-in-out_infinite] motion-safe:data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'vertical',
    animation: 'carousel',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[carousel-vertical_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    animation: 'carousel-inverse',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[carousel-inverse_2s_ease-in-out_infinite] motion-safe:data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'vertical',
    animation: 'carousel-inverse',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    animation: 'swing',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[swing_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'vertical',
    animation: 'swing',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[swing-vertical_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'horizontal',
    animation: 'elastic',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[elastic_2s_ease-in-out_infinite]'
    }
  }, {
    variant: 'linear',
    orientation: 'vertical',
    animation: 'elastic',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[elastic-vertical_2s_ease-in-out_infinite]'
    }
  }],
  defaultVariants: {
    animation: 'carousel',
    color: 'primary',
    size: 'md',
    variant: 'linear',
    thickness: 'auto'
  }
})
