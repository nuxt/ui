export default {
  slots: {
    overlay: 'fixed inset-0 bg-[var(--ui-bg-elevated)]/75',
    content: 'fixed bg-[var(--ui-bg)] ring ring-[var(--ui-border)] flex focus:outline-none',
    handle: 'shrink-0 rounded-full bg-[var(--ui-bg-accented)]',
    container: 'w-full flex flex-col gap-4 p-4 overflow-y-auto',
    header: '',
    title: 'text-[var(--ui-text-highlighted)] font-semibold',
    description: 'mt-1 text-[var(--ui-text-muted)] text-sm',
    body: 'flex-1',
    footer: 'flex flex-col gap-1.5'
  },
  variants: {
    direction: {
      top: {
        content: 'top-0 mb-24 flex-col-reverse rounded-b-[calc(var(--ui-radius)*2)]',
        handle: 'mb-4'
      },
      right: {
        content: 'right-4 flex-row',
        handle: 'ml-4'
      },
      bottom: {
        content: 'bottom-0 mt-24 flex-col rounded-t-[calc(var(--ui-radius)*2)]',
        handle: 'mt-4'
      },
      left: {
        content: 'left-4 flex-row-reverse',
        handle: 'mr-4'
      }
    }
  },
  compoundVariants: [{
    direction: ['top', 'bottom'],
    class: {
      content: 'inset-x-0 h-auto max-h-[96%]',
      handle: 'w-12 h-1.5 mx-auto'
    }
  }, {
    direction: ['right', 'left'],
    class: {
      content: 'inset-y-4 w-auto max-w-[calc(100%-2rem)] rounded-[calc(var(--ui-radius)*2)] after:hidden',
      handle: 'h-12 w-1.5 mt-auto mb-auto'
    }
  }]
}
