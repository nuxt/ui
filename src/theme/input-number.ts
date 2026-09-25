import { colorVariant } from './color'
import input from './input'
import { fieldGroupVariantWithRoot } from './field-group'

export default {
  slots: {
    root: 'relative inline-flex items-center',
    base: 'w-full rounded-md border-0 placeholder:text-dimmed disabled:cursor-not-allowed disabled:opacity-75 transition-colors',
    increment: 'absolute flex items-center',
    decrement: 'absolute flex items-center'
  },
  variants: {
    ...fieldGroupVariantWithRoot,
    color: colorVariant({ base: '' }),
    size: {
      xs: { base: 'px-2 py-1 text-sm/4 gap-1' },
      sm: { base: 'px-2.5 py-1.5 text-sm/4 gap-1.5' },
      md: { base: 'px-2.5 py-1.5 text-base/5 gap-1.5' },
      lg: { base: 'px-3 py-2 text-base/5 gap-2' },
      xl: { base: 'px-3 py-2 text-base gap-2' }
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
    increment: {
      false: ''
    },
    decrement: {
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
    decrement: true,
    size: 'xs',
    class: { base: 'ps-7' }
  }, {
    decrement: true,
    size: 'sm',
    class: { base: 'ps-8' }
  }, {
    decrement: true,
    size: 'md',
    class: { base: 'ps-9' }
  }, {
    decrement: true,
    size: 'lg',
    class: { base: 'ps-10' }
  }, {
    decrement: true,
    size: 'xl',
    class: { base: 'ps-11' }
  }, {
    increment: true,
    size: 'xs',
    class: { base: 'pe-7' }
  }, {
    increment: true,
    size: 'sm',
    class: { base: 'pe-8' }
  }, {
    increment: true,
    size: 'md',
    class: { base: 'pe-9' }
  }, {
    increment: true,
    size: 'lg',
    class: { base: 'pe-10' }
  }, {
    increment: true,
    size: 'xl',
    class: { base: 'pe-11' }
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
}
