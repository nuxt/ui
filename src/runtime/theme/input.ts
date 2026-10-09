import { colorVariant } from './color'
import { fieldGroupVariantWithRoot } from './field-group'
import { defineTheme } from '../utils/theme'

// The focus classes below, for a container whose segments or items take the focus
// (InputDate, InputTime, InputTags), spelled out so Tailwind finds them
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
    root: 'relative inline-flex items-center',
    base: 'w-full rounded-md border-0 appearance-none text-strong placeholder:text-faint disabled:cursor-not-allowed disabled:opacity-75 transition-colors',
    leading: 'absolute inset-y-0 inset-s-0 flex items-center',
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    trailing: 'absolute inset-y-0 inset-e-0 flex items-center',
    trailingIcon: 'shrink-0 text-faint'
  },
  variants: {
    ...fieldGroupVariantWithRoot,
    // The tokens go on the outermost slot, so the icons next to the input read them
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm/4',
        leading: 'ps-(--ui-control-px)',
        trailing: 'pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      sm: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm/4',
        leading: 'ps-(--ui-control-px)',
        trailing: 'pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      md: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base/5',
        leading: 'ps-(--ui-control-px)',
        trailing: 'pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      lg: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base/5',
        leading: 'ps-(--ui-control-px)',
        trailing: 'pe-(--ui-control-px)',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)'
      },
      xl: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base',
        leading: 'ps-(--ui-control-px)',
        trailing: 'pe-(--ui-control-px)',
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
    color: colorVariant({ root: '' }),
    // Room for the icon: the padding, the icon and the gap
    leading: {
      true: { base: 'ps-[calc(var(--ui-control-px)+var(--ui-control-icon)+var(--ui-control-gap))]' }
    },
    trailing: {
      true: { base: 'pe-[calc(var(--ui-control-px)+var(--ui-control-icon)+var(--ui-control-gap))]' }
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
      file: { base: 'file:me-1.5 file:font-medium file:text-muted file:outline-none' }
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
