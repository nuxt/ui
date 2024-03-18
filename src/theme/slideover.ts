export default {
  slots: {
    overlay: 'fixed inset-0 z-30 bg-gray-200/75 dark:bg-gray-800/75',
    content: 'fixed inset-y-0 z-50 sm:shadow-lg w-full max-w-md bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 sm:ring ring-gray-200 dark:ring-gray-800 flex flex-col focus:outline-none',
    header: 'px-4 py-5 sm:px-6',
    body: 'flex-1 overflow-y-auto p-4 sm:p-6',
    footer: 'flex items-center gap-x-1.5 p-4 sm:px-6',
    title: 'text-gray-900 dark:text-white font-semibold',
    description: 'mt-1 text-gray-500 dark:text-gray-400 text-sm',
    close: 'absolute top-4 right-4'
  },
  variants: {
    side: {
      left: {
        content: 'left-0'
      },
      right: {
        content: 'right-0'
      }
    },
    transition: {
      true: {
        overlay: 'data-[state=open]:animate-[slideover-overlay-open_200ms_ease-out] data-[state=closed]:animate-[slideover-overlay-closed_200ms_ease-in]',
        content: 'data-[state=open]:data-[side=left]:animate-[slideover-content-left-open_200ms_ease-in-out] data-[state=open]:data-[side=right]:animate-[slideover-content-right-open_200ms_ease-in-out] data-[state=closed]:data-[side=left]:animate-[slideover-content-left-closed_200ms_ease-in-out] data-[state=closed]:data-[side=right]:animate-[slideover-content-right-closed_200ms_ease-in-out]'
      }
    }
  }
}
