export default {
  slots: {
    root: 'relative z-50 w-full transition-colors bg-accent',
    container: 'flex items-center justify-between gap-3 h-12',
    left: 'hidden lg:flex-1 lg:flex lg:items-center',
    center: 'flex items-center gap-1.5 min-w-0',
    right: 'lg:flex-1 flex items-center justify-end',
    icon: 'size-5 shrink-0 text-inverted pointer-events-none',
    title: 'text-sm text-inverted font-medium truncate',
    actions: 'flex gap-1.5 shrink-0 isolate',
    close: 'text-inverted hover:bg-default/10 focus-visible:bg-default/10 -me-1.5 lg:me-0'
  },
  variants: {
    color: {
      '*': {
        root: '[--ui-accent:var(--ui-{value})]'
      }
    },
    to: {
      true: {
        root: 'outline-(--ui-bg)/25 -outline-offset-3 has-[>a:focus-visible]:outline-3 hover:bg-accent-hover'
      }
    }
  },
  defaultVariants: {
    color: 'primary'
  }
}
