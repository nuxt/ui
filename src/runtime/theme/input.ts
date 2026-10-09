import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

// The box is the root element, styled by the `root` and `base` slots. The native
// input sits in it, in flow with the leading and the trailing, so whatever they
// hold takes its own room. The box keeps the padding of the size, and what
// touches its edges is pulled over that padding with a negative margin: a click
// there lands on the input as if it filled the box.
export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center',
    // The browser paints its autofill tint on the input alone: `bg-clip-text` keeps
    // it behind the glyphs, and the box takes a tint of its own
    base: 'rounded-md cursor-text text-strong has-[>input:autofill]:bg-accent-soft has-[>input:disabled]:cursor-not-allowed has-[>input:disabled]:opacity-75 transition-colors',
    input: 'w-full min-w-0 flex-1 self-stretch border-0 appearance-none bg-transparent bg-clip-text outline-none placeholder:text-faint disabled:cursor-not-allowed',
    // After the input in the DOM, so the input keeps the first tab stop
    leading: 'order-first flex items-center self-stretch',
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    trailing: 'flex items-center self-stretch',
    trailingIcon: 'shrink-0 text-faint'
  },
  variants: {
    fieldGroup: {
      horizontal: { base: 'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none has-[>input:focus-visible]:z-1' },
      vertical: { base: 'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none has-[>input:focus-visible]:z-1' }
    },
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) text-sm/4',
        input: '-mx-(--ui-control-px) -my-(--ui-control-py) px-(--ui-control-px) py-(--ui-control-py)',
        leading: '-ms-(--ui-control-px) -my-(--ui-control-py) ps-(--ui-control-px)',
        trailing: '-me-(--ui-control-px) -my-(--ui-control-py) pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      sm: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) text-sm/4',
        input: '-mx-(--ui-control-px) -my-(--ui-control-py) px-(--ui-control-px) py-(--ui-control-py)',
        leading: '-ms-(--ui-control-px) -my-(--ui-control-py) ps-(--ui-control-px)',
        trailing: '-me-(--ui-control-px) -my-(--ui-control-py) pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      md: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) text-base/5',
        input: '-mx-(--ui-control-px) -my-(--ui-control-py) px-(--ui-control-px) py-(--ui-control-py)',
        leading: '-ms-(--ui-control-px) -my-(--ui-control-py) ps-(--ui-control-px)',
        trailing: '-me-(--ui-control-px) -my-(--ui-control-py) pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      lg: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) text-base/5',
        input: '-mx-(--ui-control-px) -my-(--ui-control-py) px-(--ui-control-px) py-(--ui-control-py)',
        leading: '-ms-(--ui-control-px) -my-(--ui-control-py) ps-(--ui-control-px)',
        trailing: '-me-(--ui-control-px) -my-(--ui-control-py) pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      xl: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) text-base',
        input: '-mx-(--ui-control-px) -my-(--ui-control-py) px-(--ui-control-px) py-(--ui-control-py)',
        leading: '-ms-(--ui-control-px) -my-(--ui-control-py) ps-(--ui-control-px)',
        trailing: '-me-(--ui-control-px) -my-(--ui-control-py) pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      }
    },
    variant: {
      outline: { base: 'bg-default ring ring-inset ring-strong outline-accent-focus has-[>input:focus-visible]:outline-3 has-[>input:focus-visible]:ring-accent' },
      soft: { base: 'bg-tint hover:bg-soft has-[>input:focus]:bg-soft has-[>input:disabled]:bg-tint outline-accent-focus has-[>input:focus-visible]:outline-3' },
      subtle: { base: 'bg-soft ring ring-inset ring-strong outline-accent-focus has-[>input:focus-visible]:outline-3 has-[>input:focus-visible]:ring-accent' },
      ghost: { base: 'bg-transparent hover:bg-soft has-[>input:focus]:bg-soft has-[>input:disabled]:bg-transparent dark:has-[>input:disabled]:bg-transparent outline-accent-focus has-[>input:focus-visible]:outline-3' },
      none: { base: 'bg-transparent' }
    },
    color: colorVariant({ root: '' }),
    // The input gives up the padding of the box on the side of a leading or a
    // trailing, and keeps the gap to it as its own padding
    leading: {
      true: { input: 'ms-0 ps-(--ui-control-gap)' }
    },
    trailing: {
      true: { input: 'me-0 pe-(--ui-control-gap)' }
    },
    // The component turns it off on the trailing icon when the leading one is the loading icon
    loading: {
      true: {
        leadingIcon: 'animate-spin',
        trailingIcon: 'animate-spin'
      }
    },
    highlight: {
      true: { base: 'ring ring-inset ring-accent' }
    },
    fixed: {
      false: ''
    },
    type: {
      file: { input: 'file:me-1.5 file:font-medium file:text-muted file:outline-none' }
    }
  },
  compoundVariants: [{
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
