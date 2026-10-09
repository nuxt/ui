import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    overlay: 'fixed inset-0 bg-backdrop',
    content: 'fixed bg-default ring ring-default flex focus:outline-none',
    handle: 'shrink-0 bg-strong! transition-opacity ease-out',
    container: 'w-full flex flex-col gap-4 p-4 overflow-y-auto',
    header: 'flex items-center gap-1.5 min-h-8',
    wrapper: 'min-w-0 flex-1',
    title: 'text-strong font-semibold',
    description: 'mt-1 text-muted text-sm',
    actions: 'flex items-center gap-1.5 shrink-0 ms-auto',
    body: 'flex-1',
    footer: 'flex flex-col gap-1.5',
    close: ''
  },
  variants: {
    direction: {
      top: {
        content: 'mb-24 flex-col-reverse h-auto max-h-[96%]',
        handle: 'mb-4 w-12! h-1.5! mx-auto'
      },
      right: {
        content: 'flex-row rtl:flex-row-reverse w-auto max-w-[calc(100%-2rem)]',
        handle: 'ml-4! h-12! w-1.5! my-auto'
      },
      bottom: {
        content: 'mt-24 flex-col h-auto max-h-[96%]',
        handle: 'mt-4 w-12! h-1.5! mx-auto'
      },
      left: {
        content: 'flex-row-reverse rtl:flex-row w-auto max-w-[calc(100%-2rem)]',
        handle: 'mr-4! h-12! w-1.5! my-auto'
      }
    },
    inset: {
      true: {
        content: 'rounded-lg after:hidden overflow-hidden [--initial-transform:calc(100%+1.5rem)]'
      }
    },
    snapPoints: {
      true: ''
    }
  },
  compoundVariants: [{
    direction: ['top', 'bottom'],
    snapPoints: true,
    class: {
      content: 'h-full'
    }
  }, {
    direction: ['right', 'left'],
    snapPoints: true,
    class: {
      content: 'w-full'
    }
  }, {
    direction: 'top',
    inset: true,
    class: {
      content: 'inset-x-4 top-4'
    }
  }, {
    direction: 'top',
    inset: false,
    class: {
      content: 'inset-x-0 top-0 rounded-b-lg'
    }
  }, {
    direction: 'bottom',
    inset: true,
    class: {
      content: 'inset-x-4 bottom-4'
    }
  }, {
    direction: 'bottom',
    inset: false,
    class: {
      content: 'inset-x-0 bottom-0 rounded-t-lg'
    }
  }, {
    direction: 'left',
    inset: true,
    class: {
      content: 'inset-y-4 left-4'
    }
  }, {
    direction: 'left',
    inset: false,
    class: {
      content: 'inset-y-0 left-0 rounded-r-lg'
    }
  }, {
    direction: 'right',
    inset: true,
    class: {
      content: 'inset-y-4 right-4'
    }
  }, {
    direction: 'right',
    inset: false,
    class: {
      content: 'inset-y-0 right-0 rounded-l-lg'
    }
  }]
})
