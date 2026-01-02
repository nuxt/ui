export default {
  slots: {
    root: 'flex flex-col gap-4',
    container: 'flex flex-col gap-3',
    item: 'group relative flex flex-col min-w-0 rounded-lg',
    header: 'flex items-center gap-2 px-3 py-2 min-h-[40px] rounded-t-lg',
    headerInner: 'flex items-center gap-2 grow min-w-0',
    headerContent: 'grow min-w-0',
    handle: 'flex items-center justify-center p-1 -ml-1 rounded-md cursor-grab active:cursor-grabbing text-muted hover:text-default transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    handleIcon: 'size-5 shrink-0',
    body: 'p-4 flex-1 min-w-0',
    footer: 'flex items-center justify-between gap-4 px-3 py-2 rounded-b-lg',
    footerInner: 'text-sm text-muted truncate',
    actions: 'flex items-center gap-1',
    empty: 'flex flex-col items-center justify-center py-8 text-sm text-muted border border-dashed border-default rounded-lg',
    addButton: 'flex justify-end'
  },
  variants: {
    variant: {
      outline: {
        item: 'bg-default ring-1 ring-default shadow-sm',
        header: 'border-b border-default bg-muted/20',
        footer: 'border-t border-default bg-muted/20'
      },
      soft: {
        item: 'bg-elevated/40 hover:bg-elevated/60 ring-1 ring-transparent',
        header: 'bg-elevated',
        footer: 'bg-elevated'
      },
      ghost: {
        item: 'bg-transparent hover:bg-elevated/30 ring-1 ring-transparent',
        header: '',
        footer: ''
      }
    },
    size: {
      sm: {
        root: 'gap-3',
        container: 'gap-2',
        header: 'px-2 py-1.5 min-h-[32px]',
        body: 'p-3',
        footer: 'px-2 py-1.5'
      },
      md: {
        root: 'gap-4',
        container: 'gap-3',
        header: 'px-3 py-2 min-h-[40px]',
        body: 'p-4',
        footer: 'px-3 py-2'
      },
      lg: {
        root: 'gap-5',
        container: 'gap-4',
        header: 'px-4 py-3 min-h-[48px]',
        body: 'p-5',
        footer: 'px-4 py-3'
      }
    },
    disabled: {
      true: {
        item: 'opacity-75 pointer-events-none grayscale-[0.5]',
        handle: 'cursor-not-allowed text-muted'
      }
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md'
  }
}
