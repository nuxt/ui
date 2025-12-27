export default () => ({
  slots: {
    root: 'flex flex-col',
    header: 'flex items-center justify-between gap-4 mb-4',
    title: 'text-lg font-semibold text-highlighted',
    actions: 'flex items-center gap-2',
    grid: 'grid w-full'
  },
  variants: {
    gap: {
      xs: {
        grid: 'gap-2'
      },
      sm: {
        grid: 'gap-3'
      },
      md: {
        grid: 'gap-4'
      },
      lg: {
        grid: 'gap-6'
      },
      xl: {
        grid: 'gap-8'
      }
    },
    cols: {
      1: {
        grid: 'grid-cols-1'
      },
      2: {
        grid: 'grid-cols-1 sm:grid-cols-2'
      },
      3: {
        grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      },
      4: {
        grid: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
      }
    }
  },
  defaultVariants: {
    gap: 'md',
    cols: 4
  }
})
