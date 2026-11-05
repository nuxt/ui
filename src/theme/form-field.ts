export default {
  slots: {
    root: '',
    wrapper: '',
    labelWrapper: 'flex content-center items-center justify-between gap-1',
    label: 'block font-medium text-default',
    container: 'relative',
    description: 'text-muted',
    error: 'mt-2 text-error',
    errorIcon: 'align-sub me-1.5 inline-block',
    errorPrefix: 'font-medium me-1',
    hint: 'text-muted',
    help: 'mt-2 text-muted'
  },
  variants: {
    size: {
      xs: { root: 'text-xs', errorIcon: 'size-3.5' },
      sm: { root: 'text-xs', errorIcon: 'size-3.5' },
      md: { root: 'text-sm', errorIcon: 'size-4' },
      lg: { root: 'text-sm', errorIcon: 'size-4' },
      xl: { root: 'text-base', errorIcon: 'size-5' }
    },
    required: {
      true: {
        label: `after:content-['*'] after:ms-0.5 after:text-error`
      }
    },
    orientation: {
      vertical: {
        container: 'mt-1'
      },
      horizontal: {
        root: 'flex justify-between place-items-baseline gap-2'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
}
