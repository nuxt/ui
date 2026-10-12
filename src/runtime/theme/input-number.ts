import { colorVariant } from './color'
import input from './input'
import { defineTheme } from '../utils/theme'

// Same box as Input: `root` is the box, `base` the native input with the padding
// of the size, and the buttons are in the flow of the box.
export default defineTheme({
  slots: {
    root: input.slots.root,
    base: 'w-full min-w-0 flex-1 self-stretch border-0 bg-transparent text-strong outline-none placeholder:text-faint px-(--ui-control-px) py-(--ui-control-py) disabled:cursor-not-allowed',
    increment: 'flex items-center',
    decrement: 'flex items-center'
  },
  variants: {
    fieldGroup: input.variants.fieldGroup,
    color: colorVariant({ root: '' }),
    size: {
      xs: {
        root: input.variants.size.xs.root
      },
      sm: {
        root: input.variants.size.sm.root
      },
      md: {
        root: input.variants.size.md.root
      },
      lg: {
        root: input.variants.size.lg.root
      },
      xl: {
        root: input.variants.size.xl.root
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
        base: 'text-center',
        increment: 'pe-1',
        decrement: `order-first ps-1 before:content-['x'] before:w-0 before:invisible`
      },
      // Both buttons share a column at the end. Each is taller than its half of the
      // box, so a negative margin lets them overlap without making the box taller.
      vertical: {
        root: 'inline-grid grid-cols-[1fr_auto] grid-rows-2',
        base: 'row-span-2',
        increment: 'col-start-2 row-start-1 self-start mb-[calc(var(--ui-control-py)-var(--ui-control-icon)/2)] pe-1 [&>button]:py-0 scale-80',
        decrement: 'col-start-2 row-start-2 self-end mt-[calc(var(--ui-control-py)-var(--ui-control-icon)/2)] pe-1 [&>button]:py-0 scale-80'
      }
    },
    highlight: {
      true: { root: 'ring ring-inset ring-accent' }
    },
    fixed: {
      false: ''
    },
    // Next to a button, the input gives up its padding: the button brings its own
    increment: {
      true: { base: 'pe-0' },
      false: ''
    },
    decrement: {
      true: { base: 'ps-0' },
      false: ''
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    decrement: false,
    class: { base: 'text-start' }
  }, {
    fixed: false,
    size: 'xs',
    class: { root: 'md:text-xs' }
  }, {
    fixed: false,
    size: 'sm',
    class: { root: 'md:text-xs' }
  }, {
    fixed: false,
    size: 'md',
    class: { root: 'md:text-sm' }
  }, {
    fixed: false,
    size: 'lg',
    class: { root: 'md:text-sm' }
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
