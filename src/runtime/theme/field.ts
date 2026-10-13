import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

// The fields that are a single element: the group of an InputDate, the trigger of
// a Select. `root` is the box, with the tokens, the padding and the gap of the
// size, and the leading and the trailing are in its flow. A Select names it
// `base`, its box being a `<button>`. Input and the fields that wrap a native
// element have their own theme.

// The focus classes below, for a container whose segments take the focus
// (InputDate, InputTime), spelled out so Tailwind finds them
const containerFocus: Record<string, string> = {
  'focus:bg-soft': 'has-focus:bg-soft',
  'focus:outline-none': 'has-focus:outline-none',
  'focus-visible:outline-3': 'has-focus-visible:outline-3',
  'focus-visible:ring-accent': 'has-focus-visible:ring-accent'
}

export function replaceFocus(classes: string): string {
  return classes.split(' ').map(cls => containerFocus[cls] ?? cls).join(' ')
}

export default defineTheme({
  slots: {
    root: 'group relative inline-flex items-center rounded-md text-strong transition-colors',
    // The box sits on a line of text by its first item. An invisible character
    // gives the leading the baseline of the text next to it, so an icon there
    // doesn't move the box.
    leading: `flex items-center before:content-['x'] before:w-0 before:invisible`,
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    // At the end of the box, whatever sits between the two
    trailing: 'ms-auto flex items-center',
    trailingIcon: 'shrink-0 text-faint'
  },
  variants: {
    fieldGroup: {
      horizontal: { root: fieldGroupVariant.fieldGroup.horizontal.base },
      vertical: { root: fieldGroupVariant.fieldGroup.vertical.base }
    },
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm/4',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      sm: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm/4',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      md: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base/5',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      lg: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base/5',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      xl: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      }
    },
    variant: {
      outline: { root: 'bg-default ring ring-inset ring-strong outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent' },
      soft: { root: 'bg-tint hover:bg-soft focus:bg-soft disabled:bg-tint outline-accent-focus focus-visible:outline-3' },
      subtle: { root: 'bg-soft ring ring-inset ring-strong outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent' },
      ghost: { root: 'bg-transparent hover:bg-soft focus:bg-soft disabled:bg-transparent dark:disabled:bg-transparent outline-accent-focus focus-visible:outline-3' },
      none: { root: 'bg-transparent focus:outline-none' }
    },
    color: colorVariant({ root: '' }),
    leading: {
      true: ''
    },
    trailing: {
      true: ''
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
