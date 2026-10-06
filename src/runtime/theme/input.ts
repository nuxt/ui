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
    leading: 'absolute inset-y-0 start-0 flex items-center ps-(--ui-control-px)',
    leadingIcon: 'shrink-0 text-faint size-(--ui-control-icon)',
    leadingAvatar: 'shrink-0',
    trailing: 'absolute inset-y-0 end-0 flex items-center pe-(--ui-control-px)',
    trailingIcon: 'shrink-0 text-faint size-(--ui-control-icon)'
  },
  variants: {
    ...fieldGroupVariantWithRoot,
    // The tokens go on the outermost slot, so the icons next to the input read them
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm/4'
      },
      sm: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-sm/4'
      },
      md: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base/5'
      },
      lg: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base/5'
      },
      xl: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)]',
        base: 'px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base'
      }
    },
    variant: {
      outline: { base: 'bg-default ring ring-inset ring-strong' },
      soft: { base: 'bg-tint hover:bg-soft focus:bg-soft disabled:bg-tint' },
      subtle: { base: 'bg-soft ring ring-inset ring-strong' },
      ghost: { base: 'bg-transparent hover:bg-soft focus:bg-soft disabled:bg-transparent dark:disabled:bg-transparent' },
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
    loading: {
      true: ''
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
    variant: ['outline', 'subtle'],
    class: { base: 'outline-accent-focus focus-visible:outline-3 focus-visible:ring-accent' }
  }, {
    variant: ['soft', 'ghost'],
    class: { base: 'outline-accent-focus focus-visible:outline-3' }
  }, {
    loading: true,
    leading: true,
    class: {
      leadingIcon: 'animate-spin'
    }
  }, {
    loading: true,
    leading: false,
    trailing: true,
    class: {
      trailingIcon: 'animate-spin'
    }
  }, {
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
