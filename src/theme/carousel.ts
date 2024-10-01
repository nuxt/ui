export default {
  slots: {
    root: 'relative focus:outline-none',
    content: 'overflow-hidden',
    container: 'flex',
    item: 'min-w-0 shrink-0 grow-0 basis-full',
    prev: 'absolute top-1/2 -translate-y-1/2 left-4',
    next: 'absolute top-1/2 -translate-y-1/2 right-4'
  },
  variants: {
    orientation: {
      vertical: {
        container: 'flex-col -mt-4',
        item: 'pt-4'
      },
      horizontal: {
        container: 'flex-row -ml-4',
        item: 'pl-4'
      }
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
}
