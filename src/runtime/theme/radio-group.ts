import { colorVariant } from './color'
import { focusCard, focusControl } from './checkbox'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative',
    fieldset: 'flex gap-x-2',
    legend: 'mb-1 block font-medium text-default',
    item: 'flex items-start',
    container: 'flex items-center',
    base: 'rounded-full ring ring-inset ring-strong overflow-hidden focus-visible:outline-none',
    indicator: 'flex items-center justify-center size-full after:bg-default after:rounded-full bg-accent',
    wrapper: 'w-full',
    label: 'block font-medium text-default',
    icon: 'shrink-0',
    description: 'text-muted'
  },
  variants: {
    color: colorVariant({ root: '' }),
    variant: {
      list: {
        fieldset: 'flex-wrap',
        item: ''
      },
      card: {
        fieldset: 'flex-wrap',
        item: `px-(--ui-control-px) py-(--ui-control-py) border border-default rounded-lg hover:not-has-disabled:not-has-aria-disabled:not-has-focus-visible:not-has-data-[state=checked]:bg-tint transition-colors has-data-[state=checked]:border-accent/50 has-data-[state=checked]:bg-accent-soft ${focusCard}`
      },
      table: {
        item: `px-(--ui-control-px) py-(--ui-control-py) border border-default hover:not-has-disabled:not-has-aria-disabled:not-has-focus-visible:not-has-data-[state=checked]:bg-tint transition-colors has-data-[state=checked]:bg-accent-soft has-data-[state=checked]:border-accent/50 has-data-[state=checked]:z-2 ${focusCard}`
      }
    },
    orientation: {
      horizontal: {
        fieldset: 'flex-row'
      },
      vertical: {
        fieldset: 'flex-col'
      }
    },
    indicator: {
      start: {
        item: 'flex-row',
        wrapper: 'ms-2'
      },
      end: {
        item: 'flex-row-reverse',
        wrapper: 'me-2'
      },
      hidden: {
        icon: 'size-(--ui-control-icon)',
        base: 'sr-only',
        wrapper: 'flex flex-col items-center gap-1 text-center'
      }
    },
    size: {
      xs: {
        fieldset: 'gap-y-(--ui-control-gap)',
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(2.5)] [--ui-control-icon:--spacing(3)] [--ui-control-gap:--spacing(0.5)] [--ui-control-size:--spacing(3)]',
        legend: 'text-xs',
        base: 'size-(--ui-control-size)',
        item: 'text-xs',
        container: 'h-4',
        indicator: 'after:size-1'
      },
      sm: {
        fieldset: 'gap-y-(--ui-control-gap)',
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(3)] [--ui-control-icon:--spacing(3.5)] [--ui-control-gap:--spacing(0.5)] [--ui-control-size:--spacing(3.5)]',
        legend: 'text-xs',
        base: 'size-(--ui-control-size)',
        item: 'text-xs',
        container: 'h-4',
        indicator: 'after:size-1'
      },
      md: {
        fieldset: 'gap-y-(--ui-control-gap)',
        root: '[--ui-control-px:--spacing(3.5)] [--ui-control-py:--spacing(3.5)] [--ui-control-icon:--spacing(4)] [--ui-control-gap:--spacing(1)] [--ui-control-size:--spacing(4)]',
        legend: 'text-sm',
        base: 'size-(--ui-control-size)',
        item: 'text-sm',
        container: 'h-5',
        indicator: 'after:size-1.5'
      },
      lg: {
        fieldset: 'gap-y-(--ui-control-gap)',
        root: '[--ui-control-px:--spacing(4)] [--ui-control-py:--spacing(4)] [--ui-control-icon:--spacing(4.5)] [--ui-control-gap:--spacing(1)] [--ui-control-size:--spacing(4.5)]',
        legend: 'text-sm',
        base: 'size-(--ui-control-size)',
        item: 'text-sm',
        container: 'h-5',
        indicator: 'after:size-1.5'
      },
      xl: {
        fieldset: 'gap-y-(--ui-control-gap)',
        root: '[--ui-control-px:--spacing(4.5)] [--ui-control-py:--spacing(4.5)] [--ui-control-icon:--spacing(5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-size:--spacing(5)]',
        legend: 'text-base',
        base: 'size-(--ui-control-size)',
        item: 'text-base',
        container: 'h-6',
        indicator: 'after:size-2'
      }
    },
    highlight: {
      true: {
        base: 'ring-accent'
      },
      false: ''
    },
    disabled: {
      true: {
        item: 'opacity-75',
        base: 'cursor-not-allowed',
        label: 'cursor-not-allowed',
        description: 'cursor-not-allowed'
      }
    },
    required: {
      true: {
        legend: `after:content-['*'] after:ms-0.5 after:text-error`
      }
    }
  },
  compoundVariants: [
    {
      indicator: 'hidden',
      class: {
        container: 'h-auto'
      }
    },
    {
      variant: ['card', 'table'],
      highlight: false,
      class: {
        item: 'hover:not-has-disabled:not-has-aria-disabled:not-has-focus-visible:not-has-data-[state=checked]:border-strong hover:not-has-disabled:not-has-aria-disabled:not-has-focus-visible:not-has-data-[state=checked]:z-1'
      }
    },
    {
      orientation: 'horizontal',
      variant: 'table',
      class: {
        item: 'first-of-type:rounded-s-lg last-of-type:rounded-e-lg',
        fieldset: 'gap-0 -space-x-px'
      }
    },
    {
      orientation: 'vertical',
      variant: 'table',
      class: {
        item: 'first-of-type:rounded-t-lg last-of-type:rounded-b-lg',
        fieldset: 'gap-0 -space-y-px'
      }
    },
    {
      variant: 'list',
      indicator: ['start', 'end'],
      class: {
        base: focusControl
      }
    },
    {
      variant: 'list',
      indicator: 'hidden',
      class: {
        item: focusCard
      }
    },
    {
      variant: ['card', 'table'],
      disabled: true,
      class: {
        item: 'cursor-not-allowed'
      }
    },
    {
      indicator: 'hidden',
      highlight: true,
      class: {
        item: 'not-has-disabled:border-accent not-has-disabled:has-data-[state=checked]:border-accent'
      }
    }
  ],
  defaultVariants: {
    highlight: false,
    size: 'md',
    color: 'primary',
    variant: 'list',
    indicator: 'start'
  }
})
