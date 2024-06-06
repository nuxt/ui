export default {
  slots: {
    overlay: 'fixed inset-0 z-50 bg-gray-200/75 dark:bg-gray-800/75',
    content: 'fixed z-50 w-full h-dvh bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 flex flex-col focus:outline-none',
    header: 'px-4 py-5 sm:px-6',
    body: 'flex-1 p-4 sm:p-6',
    footer: 'flex items-center gap-1.5 p-4 sm:px-6',
    title: 'text-gray-900 dark:text-white font-semibold',
    description: 'mt-1 text-gray-500 dark:text-gray-400 text-sm',
    close: 'absolute top-4 right-4'
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
        content: 'top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-lg sm:h-auto sm:my-8 sm:rounded-lg sm:shadow-lg sm:ring ring-gray-200 dark:ring-gray-800'
      }
    }
  }
}
