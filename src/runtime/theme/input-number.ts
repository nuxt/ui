import { colorVariant } from './color'
import field from './field'
import input from './input'
import { defineTheme } from '../utils/theme'

// Same box as Input: the root element is the box, the native input sits in it
// with the padding of the size, and the buttons are in its flow.
export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center',
    base: 'rounded-md cursor-text text-strong has-[>:disabled]:cursor-not-allowed has-[>:disabled]:opacity-75 transition-colors',
    input: 'w-full min-w-0 flex-1 border-0 bg-transparent outline-none placeholder:text-faint disabled:cursor-not-allowed',
    increment: 'flex items-center',
    decrement: 'flex items-center'
  },
  variants: {
    fieldGroup: input.variants.fieldGroup,
    color: colorVariant({ root: '' }),
    size: {
      xs: {
        root: field.variants.size.xs.root,
        base: 'text-sm/4',
        input: 'px-(--ui-control-px) py-(--ui-control-py)'
      },
      sm: {
        root: field.variants.size.sm.root,
        base: 'text-sm/4',
        input: 'px-(--ui-control-px) py-(--ui-control-py)'
      },
      md: {
        root: field.variants.size.md.root,
        base: 'text-base/5',
        input: 'px-(--ui-control-px) py-(--ui-control-py)'
      },
      lg: {
        root: field.variants.size.lg.root,
        base: 'text-base/5',
        input: 'px-(--ui-control-px) py-(--ui-control-py)'
      },
      xl: {
        root: field.variants.size.xl.root,
        base: 'text-base',
        input: 'px-(--ui-control-px) py-(--ui-control-py)'
      }
    },
    variant: {
      ...input.variants.variant
    },
    // The box dims as a whole, so its buttons don't dim a second time
    disabled: {
      true: {
        increment: 'cursor-not-allowed [&>button]:disabled:opacity-100',
        decrement: 'cursor-not-allowed [&>button]:disabled:opacity-100'
      }
    },
    orientation: {
      // The decrement comes after the input in the DOM, so the input keeps the first tab stop
      horizontal: {
        input: 'text-center',
        increment: 'pe-1',
        decrement: `order-first ps-1 before:content-['x'] before:w-0 before:invisible`
      },
      // Both buttons share a column at the end. Each is taller than its half of the
      // box, so a negative margin lets them overlap without making the box taller.
      vertical: {
        root: 'inline-grid grid-cols-[1fr_auto] grid-rows-2',
        input: 'row-span-2',
        increment: 'col-start-2 row-start-1 self-start mb-[calc(var(--ui-control-py)-var(--ui-control-icon)/2)] pe-1 [&>button]:py-0 scale-80',
        decrement: 'col-start-2 row-start-2 self-end mt-[calc(var(--ui-control-py)-var(--ui-control-icon)/2)] pe-1 [&>button]:py-0 scale-80'
      }
    },
    highlight: {
      true: { base: 'ring ring-inset ring-accent' }
    },
    fixed: {
      false: ''
    },
    // Next to a button, the input gives up its padding: the button brings its own
    increment: {
      true: { input: 'pe-0' },
      false: ''
    },
    decrement: {
      true: { input: 'ps-0' },
      false: ''
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    decrement: false,
    class: { input: 'text-start' }
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
