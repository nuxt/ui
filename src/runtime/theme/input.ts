import { colorVariant } from './color'
import { fieldGroupVariantRoot } from './field-group'
import { defineTheme } from '../utils/theme'

// `root` is the box and has no padding: `base`, the native input, has the one of
// the size, and the leading and the trailing bring their own. The box follows the
// state of its direct children, so a button in the leading doesn't light it.
export default defineTheme({
  slots: {
    // The browser paints its autofill tint on the input alone: `bg-clip-text` keeps
    // it behind the glyphs, and the box takes a tint of its own
    root: 'relative inline-flex items-center rounded-md cursor-text has-[>:autofill]:bg-accent-soft has-[>:disabled]:cursor-not-allowed has-[>:disabled]:opacity-(--ui-disabled-opacity) transition-colors',
    base: 'w-full min-w-0 flex-1 self-stretch border-0 appearance-none bg-transparent bg-clip-text text-strong outline-none placeholder:text-faint px-(--ui-control-px) py-(--ui-control-py) disabled:cursor-not-allowed',
    // After the input in the DOM, so the input keeps the first tab stop. An inline
    // box sits on a line of text by its first item: the invisible character gives
    // the leading the baseline of the text, so an icon doesn't move the box
    leading: `order-first flex items-center ps-(--ui-control-px) has-[>button]:ps-1 before:content-['x'] before:w-0 before:invisible`,
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    // A button has its own padding, so it sits closer to the edge
    trailing: 'flex items-center pe-(--ui-control-px) has-[>button]:pe-1',
    trailingIcon: 'shrink-0 text-faint'
  },
  variants: {
    ...fieldGroupVariantRoot,
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon-size:--spacing(4)] text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      sm: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon-size:--spacing(4)] text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      md: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon-size:--spacing(5)] text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      lg: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon-size:--spacing(5)] text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      xl: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon-size:--spacing(6)] text-base',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      }
    },
    variant: {
      outline: { root: 'bg-default ring ring-inset ring-strong outline-accent-focus has-[>:focus-visible]:outline-(length:--ui-focus-width) has-[>:focus-visible]:ring-accent' },
      soft: { root: 'bg-tint hover:bg-soft has-[>:focus]:bg-soft has-[>:disabled]:bg-tint outline-accent-focus has-[>:focus-visible]:outline-(length:--ui-focus-width)' },
      subtle: { root: 'bg-soft ring ring-inset ring-strong outline-accent-focus has-[>:focus-visible]:outline-(length:--ui-focus-width) has-[>:focus-visible]:ring-accent' },
      ghost: { root: 'bg-transparent hover:bg-soft has-[>:focus]:bg-soft has-[>:disabled]:bg-transparent dark:has-[>:disabled]:bg-transparent outline-accent-focus has-[>:focus-visible]:outline-(length:--ui-focus-width)' },
      none: { root: 'bg-transparent' }
    },
    color: colorVariant({ root: '' }),
    // Next to a leading or a trailing, the padding of the input is the gap to it
    leading: {
      true: { base: 'ps-(--ui-control-gap)' }
    },
    trailing: {
      true: { base: 'pe-(--ui-control-gap)' }
    },
    // The component turns it off on the trailing icon when the leading one is the loading icon
    loading: {
      true: {
        leadingIcon: 'animate-spin',
        trailingIcon: 'animate-spin'
      }
    },
    highlight: {
      true: { root: 'ring ring-inset ring-accent' }
    },
    type: {
      file: { base: 'file:me-1.5 file:font-medium file:text-muted file:outline-none' }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
