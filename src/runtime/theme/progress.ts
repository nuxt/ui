import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'gap-2',
    base: 'relative overflow-hidden rounded-full bg-strong',
    indicator: 'rounded-full size-full transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:data-[state=indeterminate]:animate-pulse bg-accent',
    status: 'flex text-faint duration-200 ease-out motion-reduce:transition-none',
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
    color: colorVariant({ root: '' }),
    size: {
      '2xs': {
        root: '[--ui-control-thickness:1px]',
        status: 'text-xs',
        steps: 'text-xs'
      },
      'xs': {
        root: '[--ui-control-thickness:--spacing(0.5)]',
        status: 'text-xs',
        steps: 'text-xs'
      },
      'sm': {
        root: '[--ui-control-thickness:--spacing(1)]',
        status: 'text-sm',
        steps: 'text-sm'
      },
      'md': {
        root: '[--ui-control-thickness:--spacing(2)]',
        status: 'text-sm',
        steps: 'text-sm'
      },
      'lg': {
        root: '[--ui-control-thickness:--spacing(3)]',
        status: 'text-sm',
        steps: 'text-sm'
      },
      'xl': {
        root: '[--ui-control-thickness:--spacing(4)]',
        status: 'text-base',
        steps: 'text-base'
      },
      '2xl': {
        root: '[--ui-control-thickness:--spacing(5)]',
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
        base: 'w-full h-(--ui-control-thickness)',
        status: 'flex-row items-center justify-end w-(--percent) min-w-fit transition-[width]'
      },
      vertical: {
        root: 'h-full flex flex-row-reverse',
        base: 'h-full w-(--ui-control-thickness)',
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
})
