import { colorVariant } from './color'
import { fieldGroupVariantRoot } from './field-group'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center rounded-md cursor-text has-[>:autofill]:bg-accent-soft has-[>:disabled]:cursor-not-allowed has-[>:disabled]:opacity-75 transition-colors',
    base: 'w-full min-w-0 flex-1 self-stretch border-0 bg-transparent text-strong outline-none placeholder:text-faint px-(--ui-control-px) py-(--ui-control-py) disabled:cursor-not-allowed',
    increment: 'flex items-center',
    decrement: 'flex items-center'
  },
  variants: {
    ...fieldGroupVariantRoot,
    color: colorVariant({ root: '' }),
    size: {
      xs: { root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)] text-sm/4' },
      sm: { root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)] text-sm/4' },
      md: { root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)] text-base/5' },
      lg: { root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)] text-base/5' },
      xl: { root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)] text-base' }
    },
    variant: {
      outline: { root: 'bg-default ring ring-inset ring-strong outline-accent-focus has-[>:focus-visible]:outline-3 has-[>:focus-visible]:ring-accent' },
      soft: { root: 'bg-tint hover:bg-soft has-[>:focus]:bg-soft has-[>:disabled]:bg-tint outline-accent-focus has-[>:focus-visible]:outline-3' },
      subtle: { root: 'bg-soft ring ring-inset ring-strong outline-accent-focus has-[>:focus-visible]:outline-3 has-[>:focus-visible]:ring-accent' },
      ghost: { root: 'bg-transparent hover:bg-soft has-[>:focus]:bg-soft has-[>:disabled]:bg-transparent dark:has-[>:disabled]:bg-transparent outline-accent-focus has-[>:focus-visible]:outline-3' },
      none: { root: 'bg-transparent' }
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
