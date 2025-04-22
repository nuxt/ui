export default {
  slots: {
    root: 'relative',
    fieldset: 'flex gap-2',
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
        legend: 'text-xs'
      },
      sm: {
        legend: 'text-xs'
      },
      md: {
        legend: 'text-sm'
      },
      lg: {
        legend: 'text-sm'
      },
      xl: {
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
