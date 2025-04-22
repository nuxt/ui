export default {
  slots: {
    root: 'relative',
    fieldset: 'flex gap-x-2',
    legend: 'mb-1 block font-medium text-default'
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
        legend: 'after:content-[\'*\'] after:ms-0.5 after:text-error'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
}
