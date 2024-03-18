export default {
  slots: {
    overlay: 'fixed inset-0 z-30 bg-gray-200/75 dark:bg-gray-800/75',
    content: 'fixed z-50 w-full h-dvh bg-white dark:bg-gray-900 focus:outline-none',
    header: 'p-4 sm:px-6',
    body: 'flex-1 p-4 sm:p-6',
    footer: 'flex items-center gap-x-1.5 p-4 sm:px-6',
    title: 'text-gray-900 dark:text-white font-semibold',
    description: 'mt-1 text-gray-500 dark:text-gray-400 text-sm',
    close: 'absolute top-3 right-4'
  },
  variants: {
    footer: {
      true: {
        header: 'pb-0'
      }
    },
    body: {
      true: {
        header: 'pb-0',
        footer: 'pt-0'
      }
    },
    transition: {
      true: {
        overlay: 'data-[state=open]:animate-[modal-overlay-open_200ms_ease-out] data-[state=closed]:animate-[modal-overlay-closed_200ms_ease-in]',
        content: 'data-[state=open]:animate-[modal-content-open_200ms_ease-out] data-[state=closed]:animate-[modal-content-closed_200ms_ease-in]'
      }
    },
    fullscreen: {
      true: {
        content: 'inset-0'
      },
      false: {
        content: 'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-lg sm:h-auto sm:my-8 sm:rounded-lg sm:shadow-lg sm:ring ring-gray-200 dark:ring-gray-800'
      }
    }
  }
}
