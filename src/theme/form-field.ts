export default {
  slots: {
    root: '',
    wrapper: '',
    labelWrapper: 'flex content-center items-center justify-between',
    label: 'block font-medium text-[var(--ui-text)]',
    container: 'mt-1 relative',
    description: 'text-[var(--ui-text-muted)]',
    error: 'mt-2 text-[var(--ui-error)]',
    hint: 'text-[var(--ui-text-muted)]',
    help: 'mt-2 text-[var(--ui-text-muted)]'
  },
  variants: {
    size: {
      xs: { root: 'text-xs' },
      sm: { root: 'text-xs' },
      md: { root: 'text-sm' },
      lg: { root: 'text-sm' },
      xl: { root: 'text-base' }
    },
    required: {
      true: {
        label: `after:content-['*'] after:ms-0.5 after:text-[var(--ui-error)]`
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
}
