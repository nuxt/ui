import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

// The fields that are a single element: the trigger of a Select, the group of
// an InputDate. `base` is the box, with the tokens, the padding and the gap of the
// size, and the leading and the trailing are in its flow. Input and the fields
// that wrap a native element have their own theme, where `root` is the box.

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
    base: 'group relative inline-flex items-center rounded-md text-strong transition-colors',
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
    ...fieldGroupVariant,
    size: {
      xs: {
        base: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      sm: {
        base: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      md: {
        base: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      lg: {
        base: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      xl: {
        base: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      }
    },
    variant: {
      outline: { base: 'bg-default ring ring-inset ring-strong outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent' },
      soft: { base: 'bg-tint hover:bg-soft focus:bg-soft disabled:bg-tint outline-accent-focus focus-visible:outline-3' },
      subtle: { base: 'bg-soft ring ring-inset ring-strong outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent' },
      ghost: { base: 'bg-transparent hover:bg-soft focus:bg-soft disabled:bg-transparent dark:disabled:bg-transparent outline-accent-focus focus-visible:outline-3' },
      none: { base: 'bg-transparent focus:outline-none' }
    },
    color: colorVariant({ base: '' }),
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
      true: { base: 'ring ring-inset ring-accent' }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
