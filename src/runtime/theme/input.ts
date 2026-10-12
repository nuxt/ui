import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

// The focus classes below, for a box whose focusable parts are not its direct
// children (InputTags, InputMenu), spelled out so Tailwind finds them
const withinFocusMap: Record<string, string> = {
  'has-[>:focus]:bg-soft': 'has-focus:bg-soft',
  'has-[>:focus-visible]:outline-3': 'has-focus-visible:outline-3',
  'has-[>:focus-visible]:ring-accent': 'has-focus-visible:ring-accent'
}

export function withinFocus(classes: string): string {
  return classes.split(' ').map(cls => withinFocusMap[cls] ?? cls).join(' ')
}

// `root` is the box and has no padding of its own. `base` is the native input,
// in the flow of the box with the leading and the trailing: it has the padding
// of the size and they bring their own, so whatever they hold takes its own
// room, and next to one of them the padding of the input is the gap. The box
// follows the state of its direct child, the native element: a button in the
// leading or the trailing is one level down and doesn't count.
export default defineTheme({
  slots: {
    // The browser paints its autofill tint on the input alone: `bg-clip-text` keeps
    // it behind the glyphs, and the box takes a tint of its own
    root: 'relative inline-flex items-center rounded-md cursor-text has-[>:autofill]:bg-accent-soft has-[>:disabled]:cursor-not-allowed has-[>:disabled]:opacity-75 transition-colors',
    base: 'w-full min-w-0 flex-1 border-0 appearance-none bg-transparent bg-clip-text text-strong outline-none placeholder:text-faint px-(--ui-control-px) py-(--ui-control-py) disabled:cursor-not-allowed',
    // After the input in the DOM, so the input keeps the first tab stop.
    // The box sits on a line of text by its first item: an invisible character
    // gives the leading the baseline of the text, so an icon doesn't move the box
    leading: `order-first flex items-center ps-(--ui-control-px) before:content-['x'] before:w-0 before:invisible`,
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    trailing: 'flex items-center pe-(--ui-control-px)',
    trailingIcon: 'shrink-0 text-faint'
  },
  variants: {
    fieldGroup: {
      horizontal: { root: 'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none has-[>:focus-visible]:z-1' },
      vertical: { root: 'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none has-[>:focus-visible]:z-1' }
    },
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)] text-sm/4',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      sm: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)] text-sm/4',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      md: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)] text-base/5',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      lg: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)] text-base/5',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      xl: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)] text-base',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      }
    },
    variant: {
      outline: { root: 'bg-default ring ring-inset ring-strong outline-accent-focus has-[>:focus-visible]:outline-3 has-[>:focus-visible]:ring-accent' },
      soft: { root: 'bg-tint hover:bg-soft has-[>:focus]:bg-soft has-[>:disabled]:bg-tint outline-accent-focus has-[>:focus-visible]:outline-3' },
      subtle: { root: 'bg-soft ring ring-inset ring-strong outline-accent-focus has-[>:focus-visible]:outline-3 has-[>:focus-visible]:ring-accent' },
      ghost: { root: 'bg-transparent hover:bg-soft has-[>:focus]:bg-soft has-[>:disabled]:bg-transparent dark:has-[>:disabled]:bg-transparent outline-accent-focus has-[>:focus-visible]:outline-3' },
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
    fixed: {
      false: ''
    },
    type: {
      file: { base: 'file:me-1.5 file:font-medium file:text-muted file:outline-none' }
    }
  },
  compoundVariants: [{
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
