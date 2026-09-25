import { colorVariant } from './color'

export default {
  slots: {
    root: 'gap-2',
    base: 'relative overflow-hidden rounded-full bg-accented',
    indicator: 'rounded-full size-full transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:data-[state=indeterminate]:animate-pulse bg-accent',
    status: 'flex text-dimmed duration-200 ease-out motion-reduce:transition-none',
    steps: 'grid items-end text-accent',
    step: 'truncate text-end row-start-1 col-start-1 transition-opacity ease-out'
  },
  variants: {
    animation: {
      'carousel': '',
      'carousel-inverse': '',
      'swing': '',
      'elastic': ''
    },
    color: colorVariant({ indicator: '', steps: '' }),
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
        status: 'flex-row items-center justify-end w-(--percent) min-w-fit transition-[width]'
      },
      vertical: {
        root: 'h-full flex flex-row-reverse',
        base: 'h-full',
        status: 'flex-col justify-end h-(--percent) min-h-fit transition-[height]'
      }
    },
    inverted: {
      true: {
        status: 'self-end'
      }
    }
  },
  compoundVariants: [{
    inverted: true,
    orientation: 'horizontal',
    class: {
      step: 'text-start',
      status: 'flex-row-reverse'
    }
  }, {
    inverted: true,
    orientation: 'vertical',
    class: {
      steps: 'items-start',
      status: 'flex-col-reverse'
    }
  }, {
    orientation: 'horizontal',
    size: '2xs',
    class: { base: 'h-px' }
  }, {
    orientation: 'horizontal',
    size: 'xs',
    class: { base: 'h-0.5' }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: { base: 'h-1' }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: { base: 'h-2' }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: { base: 'h-3' }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: { base: 'h-4' }
  }, {
    orientation: 'horizontal',
    size: '2xl',
    class: { base: 'h-5' }
  }, {
    orientation: 'vertical',
    size: '2xs',
    class: { base: 'w-px' }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: { base: 'w-0.5' }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: { base: 'w-1' }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: { base: 'w-2' }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: { base: 'w-3' }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: { base: 'w-4' }
  }, {
    orientation: 'vertical',
    size: '2xl',
    class: { base: 'w-5' }
  }, {
    orientation: 'horizontal',
    animation: 'carousel',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[carousel_2s_linear_infinite] motion-safe:data-[state=indeterminate]:rtl:animate-[carousel-rtl_2s_linear_infinite]'
    }
  }, {
    orientation: 'vertical',
    animation: 'carousel',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[carousel-vertical_2s_linear_infinite]'
    }
  }, {
    orientation: 'horizontal',
    animation: 'carousel-inverse',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[carousel-inverse_2s_linear_infinite] motion-safe:data-[state=indeterminate]:rtl:animate-[carousel-inverse-rtl_2s_linear_infinite]'
    }
  }, {
    orientation: 'vertical',
    animation: 'carousel-inverse',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[carousel-inverse-vertical_2s_linear_infinite]'
    }
  }, {
    orientation: 'horizontal',
    animation: 'swing',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[swing_2s_var(--ease-in-out)_infinite]'
    }
  }, {
    orientation: 'vertical',
    animation: 'swing',
    class: {
      indicator: 'motion-safe:data-[state=indeterminate]:animate-[swing-vertical_2s_var(--ease-in-out)_infinite]'
    }
  }, {
    orientation: 'horizontal',
    animation: 'elastic',
    class: {
      indicator: 'relative motion-safe:data-[state=indeterminate]:animate-[elastic_2s_var(--ease-in-out)_infinite]'
    }
  }, {
    orientation: 'vertical',
    animation: 'elastic',
    class: {
      indicator: 'relative motion-safe:data-[state=indeterminate]:animate-[elastic-vertical_2s_var(--ease-in-out)_infinite]'
    }
  }],
  defaultVariants: {
    animation: 'carousel',
    color: 'primary',
    size: 'md'
  }
}
