import { colorVariant } from './color'
import input from './input'
import { fieldGroupVariantWithRoot } from './field-group'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center',
    base: 'w-full rounded-md border-0 text-strong placeholder:text-faint disabled:cursor-not-allowed disabled:opacity-75 transition-colors',
    increment: 'absolute flex items-center',
    decrement: 'absolute flex items-center'
  },
  variants: {
    ...fieldGroupVariantWithRoot,
    color: colorVariant({ root: '' }),
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm/4'
      },
      sm: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm/4'
      },
      md: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base/5'
      },
      lg: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base/5'
      },
      xl: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base'
      }
    },
    variant: {
      ...input.variants.variant
    },
    disabled: {
      true: {
        increment: 'opacity-75 cursor-not-allowed',
        decrement: 'opacity-75 cursor-not-allowed'
      }
    },
    orientation: {
      horizontal: {
        base: 'text-center',
        increment: 'inset-y-0 end-0 pe-1',
        decrement: 'inset-y-0 start-0 ps-1'
      },
      vertical: {
        increment: 'top-0 end-0 pe-1 [&>button]:py-0 scale-80',
        decrement: 'bottom-0 end-0 pe-1 [&>button]:py-0 scale-80'
      }
    },
    highlight: {
      true: { base: 'ring ring-inset ring-accent' }
    },
    fixed: {
      false: ''
    },
    // Room for the button: the padding, the icon and the gap
    increment: {
      true: { base: 'pe-[calc(var(--ui-control-px)+var(--ui-control-icon)+var(--ui-control-gap))]' },
      false: ''
    },
    decrement: {
      true: { base: 'ps-[calc(var(--ui-control-px)+var(--ui-control-icon)+var(--ui-control-gap))]' },
      false: ''
    }
  },
  compoundVariants: [{
    variant: ['outline', 'subtle'],
    class: { base: 'outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent' }
  }, {
    variant: ['soft', 'ghost'],
    class: { base: 'outline-accent-focus focus-visible:outline-3' }
  }, {
    orientation: 'horizontal',
    decrement: false,
    class: { base: 'text-start' }
  }, {
    fixed: false,
    size: 'xs',
    class: { base: 'md:text-xs' }
  }, {
    fixed: false,
    size: 'sm',
    class: { base: 'md:text-xs' }
  }, {
    fixed: false,
    size: 'md',
    class: { base: 'md:text-sm' }
  }, {
    fixed: false,
    size: 'lg',
    class: { base: 'md:text-sm' }
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
