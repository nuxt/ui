import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    base: 'font-medium inline-flex items-center',
    label: 'truncate',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    trailingIcon: 'shrink-0'
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
        base: 'text-[0.5rem]/3 [--ui-control-px:--spacing(1)] [--ui-control-py:--spacing(0.5)] [--ui-control-gap:--spacing(1)] [--ui-control-icon-size:--spacing(2.5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) rounded-sm',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      sm: {
        base: 'text-[0.625rem]/3 [--ui-control-px:--spacing(1.5)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon-size:--spacing(3)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) rounded-sm',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      md: {
        base: 'text-xs [--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon-size:--spacing(3.5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) rounded-md',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      lg: {
        base: 'text-sm [--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon-size:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) rounded-md',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      },
      xl: {
        base: 'text-base [--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon-size:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) rounded-md',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)'
      }
    },
    // Equal padding, for `square` or an icon and nothing else. The icon is
    // smaller than the line, its margin keeps the height of a badge with a label
    square: {
      true: {
        base: 'px-(--ui-control-py)',
        leadingIcon: 'm-[calc((1lh-var(--ui-control-icon-size))/2)]',
        trailingIcon: 'm-[calc((1lh-var(--ui-control-icon-size))/2)]'
      }
    }
  },
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
