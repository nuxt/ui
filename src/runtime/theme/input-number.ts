import { colorVariant } from './color'
import { fieldGroupVariantRoot } from './field-group'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center rounded-md cursor-text has-[>:autofill]:bg-accent-soft has-[>:disabled]:cursor-not-allowed has-[>:disabled]:opacity-(--ui-disabled-opacity) transition-colors',
    base: 'w-full min-w-0 flex-1 self-stretch border-0 bg-transparent text-strong outline-none placeholder:text-faint px-(--ui-control-px) py-(--ui-control-py) disabled:cursor-not-allowed',
    // After the input in the DOM, so the input keeps the first tab stop. The invisible
    // character gives the leading the baseline of the text, see `input.ts`
    leading: `order-first flex items-center ps-(--ui-control-px) has-[>button]:ps-1 before:content-['x'] before:w-0 before:invisible`,
    trailing: 'flex items-center pe-(--ui-control-px) has-[>button]:pe-1',
    increment: 'flex items-center',
    decrement: 'flex items-center'
  },
  variants: {
    ...fieldGroupVariantRoot,
    color: colorVariant({ root: '' }),
    size: {
      xs: { root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon-size:--spacing(4)] text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4' },
      sm: { root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon-size:--spacing(4)] text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4' },
      md: { root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon-size:--spacing(5)] text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5' },
      lg: { root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon-size:--spacing(5)] text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5' },
      xl: { root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon-size:--spacing(6)] text-base' }
    },
    variant: {
      outline: { root: 'bg-default ring ring-inset ring-strong outline-accent-focus has-[>:focus-visible]:outline-(length:--ui-focus-width) has-[>:focus-visible]:ring-accent' },
      soft: { root: 'bg-tint hover:bg-soft has-[>:focus]:bg-soft has-[>:disabled]:bg-tint outline-accent-focus has-[>:focus-visible]:outline-(length:--ui-focus-width)' },
      subtle: { root: 'bg-soft ring ring-inset ring-strong outline-accent-focus has-[>:focus-visible]:outline-(length:--ui-focus-width) has-[>:focus-visible]:ring-accent' },
      ghost: { root: 'bg-transparent hover:bg-soft has-[>:focus]:bg-soft has-[>:disabled]:bg-transparent dark:has-[>:disabled]:bg-transparent outline-accent-focus has-[>:focus-visible]:outline-(length:--ui-focus-width)' },
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
      // The leading and the trailing take a column each, empty when they are not there
      vertical: {
        root: 'inline-grid grid-cols-[auto_1fr_auto_auto] grid-rows-2',
        leading: 'col-start-1 row-span-2',
        base: 'col-start-2 row-span-2',
        trailing: 'col-start-3 row-span-2',
        increment: 'col-start-4 row-start-1 self-start mb-[calc(var(--ui-control-py)-var(--ui-control-icon-size)/2)] pe-1 [&>button]:py-0 scale-80',
        decrement: 'col-start-4 row-start-2 self-end mt-[calc(var(--ui-control-py)-var(--ui-control-icon-size)/2)] pe-1 [&>button]:py-0 scale-80'
      }
    },
    highlight: {
      true: { root: 'ring ring-inset ring-accent' }
    },
    // Next to a button, the input, the leading and the trailing give up their
    // padding: the button brings its own
    increment: {
      true: { base: 'pe-0', trailing: 'pe-0' },
      false: ''
    },
    decrement: {
      true: { base: 'ps-0', leading: 'ps-0' },
      false: ''
    },
    // Next to a leading or a trailing, the padding of the input is the gap to it
    leading: {
      true: { base: 'ps-(--ui-control-gap)' }
    },
    trailing: {
      true: { base: 'pe-(--ui-control-gap)' }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    decrement: false,
    class: { base: 'text-start' }
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
