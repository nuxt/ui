import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'font-medium inline-flex items-center px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
    label: 'truncate',
    leadingIcon: 'shrink-0 size-(--ui-control-icon)',
    leadingAvatar: 'shrink-0',
    trailingIcon: 'shrink-0 size-(--ui-control-icon)'
  },
  variants: {
    ...fieldGroupVariant,
    color: colorVariant({ base: '' }),
    variant: {
      solid: {
        base: 'bg-accent text-accent-contrast'
      },
      outline: {
        base: 'text-accent-default bg-default ring ring-inset ring-accent-strong'
      },
      soft: {
        base: 'bg-accent-soft text-accent-default'
      },
      subtle: {
        base: 'bg-accent-soft text-accent-default ring ring-inset ring-accent-strong'
      }
    },
    size: {
      xs: {
        base: 'text-[8px]/3 [--ui-control-px:--spacing(1)] [--ui-control-py:--spacing(0.5)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(3)] rounded-sm'
      },
      sm: {
        base: 'text-[10px]/3 [--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(3)] rounded-sm'
      },
      md: {
        base: 'text-xs [--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)] rounded-md'
      },
      lg: {
        base: 'text-sm [--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)] rounded-md'
      },
      xl: {
        base: 'text-base [--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(6)] rounded-md'
      }
    },
    // Equal padding, for `square` or an icon and nothing else
    square: {
      true: {
        base: 'px-(--ui-control-py)'
      }
    }
  },
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
