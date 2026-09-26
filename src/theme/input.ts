import { colorVariant } from './color'
import { fieldGroupVariantWithRoot } from './field-group'

// The focus classes below, for a container whose segments or items take the focus
// (InputDate, InputTime, InputTags), spelled out so Tailwind finds them
const containerFocus: Record<string, string> = {
  'focus:bg-elevated': 'has-focus:bg-elevated',
  'focus:outline-none': 'has-focus:outline-none',
  'focus-visible:outline-3': 'has-focus-visible:outline-3',
  'focus-visible:ring-accent': 'has-focus-visible:ring-accent'
}

export function replaceFocus(classes: string): string {
  return classes.split(' ').map(cls => containerFocus[cls] ?? cls).join(' ')
}

export default {
  slots: {
    root: 'relative inline-flex items-center',
    base: 'w-full rounded-md border-0 appearance-none placeholder:text-dimmed disabled:cursor-not-allowed disabled:opacity-75 transition-colors',
    leading: 'absolute inset-y-0 start-0 flex items-center',
    leadingIcon: 'shrink-0 text-dimmed',
    leadingAvatar: 'shrink-0',
    trailing: 'absolute inset-y-0 end-0 flex items-center',
    trailingIcon: 'shrink-0 text-dimmed'
  },
  variants: {
    ...fieldGroupVariantWithRoot,
    size: {
      xs: {
        base: 'px-2 py-1 text-sm/4 gap-1',
        leading: 'ps-2',
        trailing: 'pe-2',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      sm: {
        base: 'px-2.5 py-1.5 text-sm/4 gap-1.5',
        leading: 'ps-2.5',
        trailing: 'pe-2.5',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4'
      },
      md: {
        base: 'px-2.5 py-1.5 text-base/5 gap-1.5',
        leading: 'ps-2.5',
        trailing: 'pe-2.5',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      lg: {
        base: 'px-3 py-2 text-base/5 gap-2',
        leading: 'ps-3',
        trailing: 'pe-3',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5'
      },
      xl: {
        base: 'px-3 py-2 text-base gap-2',
        leading: 'ps-3',
        trailing: 'pe-3',
        leadingIcon: 'size-6',
        trailingIcon: 'size-6'
      }
    },
    variant: {
      outline: { base: 'text-highlighted bg-default ring ring-inset ring-accented' },
      soft: { base: 'text-highlighted bg-elevated/50 hover:bg-elevated focus:bg-elevated disabled:bg-elevated/50' },
      subtle: { base: 'text-highlighted bg-elevated ring ring-inset ring-accented' },
      ghost: { base: 'text-highlighted bg-transparent hover:bg-elevated focus:bg-elevated disabled:bg-transparent dark:disabled:bg-transparent' },
      none: { base: 'text-highlighted bg-transparent focus:outline-none' }
    },
    color: colorVariant({ root: '' }),
    leading: {
      true: ''
    },
    trailing: {
      true: ''
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
    leading: true,
    size: 'xs',
    class: { base: 'ps-7' }
  }, {
    leading: true,
    size: 'sm',
    class: { base: 'ps-8' }
  }, {
    leading: true,
    size: 'md',
    class: { base: 'ps-9' }
  }, {
    leading: true,
    size: 'lg',
    class: { base: 'ps-10' }
  }, {
    leading: true,
    size: 'xl',
    class: { base: 'ps-11' }
  }, {
    trailing: true,
    size: 'xs',
    class: { base: 'pe-7' }
  }, {
    trailing: true,
    size: 'sm',
    class: { base: 'pe-8' }
  }, {
    trailing: true,
    size: 'md',
    class: { base: 'pe-9' }
  }, {
    trailing: true,
    size: 'lg',
    class: { base: 'pe-10' }
  }, {
    trailing: true,
    size: 'xl',
    class: { base: 'pe-11' }
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
}
