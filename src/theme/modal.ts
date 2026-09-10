export default {
  slots: {
    overlay: 'fixed inset-0',
    content: 'bg-default divide-y divide-default flex flex-col focus:outline-none',
    header: 'flex items-center gap-1.5 p-4 sm:px-6 min-h-(--ui-header-height)',
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
        overlay: 'data-[state=open]:animate-[fade-in_200ms_var(--ease-out)] data-[state=closed]:animate-[fade-out_200ms_var(--ease-out)]',
        content: 'data-[state=open]:animate-[scale-in_200ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_200ms_var(--ease-out)]'
      }
    },
    fullscreen: {
      true: {
        content: 'inset-0'
      },
      sm: {
        content: 'inset-0 sm:inset-auto sm:w-[calc(100vw-2rem)] sm:max-w-lg sm:rounded-lg sm:shadow-lg sm:ring sm:ring-default'
      },
      md: {
        content: 'inset-0 md:inset-auto md:w-[calc(100vw-2rem)] md:max-w-lg md:rounded-lg md:shadow-lg md:ring md:ring-default'
      },
      lg: {
        content: 'inset-0 lg:inset-auto lg:w-[calc(100vw-2rem)] lg:max-w-lg lg:rounded-lg lg:shadow-lg lg:ring lg:ring-default'
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
    scrollable: true,
    fullscreen: 'sm',
    class: {
      overlay: 'sm:grid sm:place-items-center sm:px-4 sm:py-8',
      content: 'min-h-dvh sm:min-h-0'
    }
  }, {
    scrollable: true,
    fullscreen: 'md',
    class: {
      overlay: 'md:grid md:place-items-center md:px-4 md:py-8',
      content: 'min-h-dvh md:min-h-0'
    }
  }, {
    scrollable: true,
    fullscreen: 'lg',
    class: {
      overlay: 'lg:grid lg:place-items-center lg:px-4 lg:py-8',
      content: 'min-h-dvh lg:min-h-0'
    }
  }, {
    scrollable: false,
    fullscreen: false,
    class: {
      content: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden'
    }
  }, {
    scrollable: false,
    fullscreen: 'sm',
    class: {
      content: 'sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-h-[calc(100dvh-4rem)] overflow-hidden'
    }
  }, {
    scrollable: false,
    fullscreen: 'md',
    class: {
      content: 'md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-h-[calc(100dvh-4rem)] overflow-hidden'
    }
  }, {
    scrollable: false,
    fullscreen: 'lg',
    class: {
      content: 'lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:max-h-[calc(100dvh-4rem)] overflow-hidden'
    }
  }]
}
