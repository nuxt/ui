import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'

export default {
  slots: {
    base: 'font-medium inline-flex items-center',
    label: 'truncate',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    trailingIcon: 'shrink-0'
  },
  variants: {
    ...fieldGroupVariant,
    color: colorVariant({ base: '' }),
    variant: {
      solid: {
        base: 'bg-accent text-accent-foreground'
      },
      outline: {
        base: 'text-accent-soft-foreground bg-accent-surface ring ring-inset ring-accent-border'
      },
      soft: {
        base: 'bg-accent-soft text-accent-soft-foreground'
      },
      subtle: {
        base: 'bg-accent-soft text-accent-soft-foreground ring ring-inset ring-accent-border-soft'
      }
    },
    size: {
      xs: {
        base: 'text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm',
        leadingIcon: 'size-3',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-3'
      },
      sm: {
        base: 'text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm',
        leadingIcon: 'size-3',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-3'
      },
      md: {
        base: 'text-xs px-2 py-1 gap-1 rounded-md',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-4'
      },
      lg: {
        base: 'text-sm px-2 py-1 gap-1.5 rounded-md',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-5'
      },
      xl: {
        base: 'text-base px-2.5 py-1 gap-1.5 rounded-md',
        leadingIcon: 'size-6',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-6'
      }
    },
    square: {
      true: ''
    }
  },
  compoundVariants: [{
    size: 'xs',
    square: true,
    class: { base: 'p-0.5' }
  }, {
    size: 'sm',
    square: true,
    class: { base: 'p-1' }
  }, {
    size: 'md',
    square: true,
    class: { base: 'p-1' }
  }, {
    size: 'lg',
    square: true,
    class: { base: 'p-1' }
  }, {
    size: 'xl',
    square: true,
    class: { base: 'p-1' }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
}
