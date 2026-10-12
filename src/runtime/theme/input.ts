import { colorVariant } from './color'
import field from './field'
import { defineTheme } from '../utils/theme'

// The box is the root element, styled by the `root` and `base` slots, and has no
// padding of its own. The native input sits in it with the padding of the size,
// in flow with the leading and the trailing, which bring their own: whatever
// they hold takes its own room, and the input gives up its padding on that side
// for the gap. The box follows the state of its direct child, the native element:
// a button in the leading or the trailing is one level down and doesn't count.
export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center',
    // The browser paints its autofill tint on the input alone: `bg-clip-text` keeps
    // it behind the glyphs, and the box takes a tint of its own
    base: 'rounded-md cursor-text text-strong has-[>:autofill]:bg-accent-soft has-[>:disabled]:cursor-not-allowed has-[>:disabled]:opacity-75 transition-colors',
    input: 'w-full min-w-0 flex-1 border-0 appearance-none bg-transparent bg-clip-text outline-none placeholder:text-faint disabled:cursor-not-allowed',
    // After the input in the DOM, so the input keeps the first tab stop
    // The box sits on a line of text by its first item: an invisible character
    // gives the leading the baseline of the text, so an icon doesn't move the box
    leading: `order-first flex items-center before:content-['x'] before:w-0 before:invisible`,
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    trailing: 'flex items-center',
    trailingIcon: 'shrink-0 text-faint'
  },
  variants: {
    fieldGroup: {
      horizontal: { base: 'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none has-[>:focus-visible]:z-1' },
      vertical: { base: 'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none has-[>:focus-visible]:z-1' }
    },
    size: {
      xs: {
        root: field.variants.size.xs.root,
        base: 'text-sm/4',
        input: 'px-(--ui-control-px) py-(--ui-control-py)',
        leading: 'ps-(--ui-control-px)',
        trailing: 'pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      sm: {
        root: field.variants.size.sm.root,
        base: 'text-sm/4',
        input: 'px-(--ui-control-px) py-(--ui-control-py)',
        leading: 'ps-(--ui-control-px)',
        trailing: 'pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      md: {
        root: field.variants.size.md.root,
        base: 'text-base/5',
        input: 'px-(--ui-control-px) py-(--ui-control-py)',
        leading: 'ps-(--ui-control-px)',
        trailing: 'pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      lg: {
        root: field.variants.size.lg.root,
        base: 'text-base/5',
        input: 'px-(--ui-control-px) py-(--ui-control-py)',
        leading: 'ps-(--ui-control-px)',
        trailing: 'pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      xl: {
        root: field.variants.size.xl.root,
        base: 'text-base',
        input: 'px-(--ui-control-px) py-(--ui-control-py)',
        leading: 'ps-(--ui-control-px)',
        trailing: 'pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      }
    },
    variant: {
      outline: { base: 'bg-default ring ring-inset ring-strong outline-accent-focus has-[>:focus-visible]:outline-3 has-[>:focus-visible]:ring-accent' },
      soft: { base: 'bg-tint hover:bg-soft has-[>:focus]:bg-soft has-[>:disabled]:bg-tint outline-accent-focus has-[>:focus-visible]:outline-3' },
      subtle: { base: 'bg-soft ring ring-inset ring-strong outline-accent-focus has-[>:focus-visible]:outline-3 has-[>:focus-visible]:ring-accent' },
      ghost: { base: 'bg-transparent hover:bg-soft has-[>:focus]:bg-soft has-[>:disabled]:bg-transparent dark:has-[>:disabled]:bg-transparent outline-accent-focus has-[>:focus-visible]:outline-3' },
      none: { base: 'bg-transparent' }
    },
    color: colorVariant({ root: '' }),
    // Next to a leading or a trailing, the padding of the input is the gap to it
    leading: {
      true: { input: 'ps-(--ui-control-gap)' }
    },
    trailing: {
      true: { input: 'pe-(--ui-control-gap)' }
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
