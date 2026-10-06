import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'
// `table` is defined here rather than in checkbox.ts, so its focus ring is too
import { focusCard } from './checkbox'

export default defineTheme({
  slots: {
    root: 'relative',
    fieldset: 'flex gap-x-2',
    legend: 'mb-1 block font-medium text-default',
    item: ''
  },
  variants: {
    orientation: {
      horizontal: {
        fieldset: 'flex-row'
      },
      vertical: {
        fieldset: 'flex-col'
      }
    },
    color: colorVariant({ root: '' }),
    variant: {
      list: {
        fieldset: 'flex-wrap'
      },
      card: {
        fieldset: 'flex-wrap'
      },
      table: {
        // Each item is a Checkbox, which writes the tokens of its size
        item: `px-(--ui-control-px) py-(--ui-control-py) border border-default hover:not-has-disabled:not-has-focus-visible:not-has-data-[state=checked]:bg-tint transition-colors ${focusCard} has-data-[state=checked]:bg-accent-soft has-data-[state=checked]:border-accent/50 has-data-[state=checked]:z-2`
      }
    },
    size: {
      xs: {
        fieldset: 'gap-y-0.5',
        legend: 'text-xs'
      },
      sm: {
        fieldset: 'gap-y-0.5',
        legend: 'text-xs'
      },
      md: {
        fieldset: 'gap-y-1',
        legend: 'text-sm'
      },
      lg: {
        fieldset: 'gap-y-1',
        legend: 'text-sm'
      },
      xl: {
        fieldset: 'gap-y-1.5',
        legend: 'text-base'
      }
    },
    required: {
      true: {
        legend: `after:content-['*'] after:ms-0.5 after:text-error`
      }
    },
    highlight: {
      true: {},
      false: {}
    },
    disabled: {
      true: {}
    }
  },
  compoundVariants: [
    {
      variant: 'table',
      highlight: false,
      class: {
        item: 'hover:not-has-disabled:not-has-focus-visible:not-has-data-[state=checked]:border-strong hover:not-has-disabled:not-has-focus-visible:not-has-data-[state=checked]:z-1'
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
      variant: 'table',
      disabled: true,
      class: {
        item: 'cursor-not-allowed'
      }
    }
  ],
  defaultVariants: {
    highlight: false,
    size: 'md',
    variant: 'list',
    color: 'primary'
  }
})
