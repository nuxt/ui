export default {
  slots: {
    overlay: 'fixed inset-0',
    content: 'bg-default divide-y divide-default flex flex-col focus:outline-none',
    header: 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16',
    wrapper: '',
    body: 'flex-1 p-4 sm:p-6',
    footer: 'flex items-center gap-1.5 p-4 sm:px-6',
    title: 'text-highlighted font-semibold',
    description: 'mt-1 text-muted text-sm',
    close: 'absolute top-4 end-4'
  },
  variants: {
    transition: {
      true: {
        overlay: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]',
        content: 'data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]'
      }
    },
    fullscreen: {
      true: {
        content: 'inset-0'
      },
      false: {
        content: 'w-[calc(100vw-2rem)] max-w-lg rounded-lg shadow-lg ring ring-default'
      }
    },
    overlay: {
      true: {
        overlay: 'bg-elevated/75'
      }
    },
    scrollable: {
      true: {
        overlay: 'overflow-y-auto',
        content: 'relative'
      },
      false: {
        content: 'fixed',
        body: 'overflow-y-auto'
      }
    }
  },
  compoundVariants: [{
    scrollable: true,
    fullscreen: false,
    class: {
      overlay: 'grid place-items-center p-4 sm:py-8'
    }
  }, {
    scrollable: false,
    fullscreen: false,
    class: {
      content: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden'
    }
  }]
}
