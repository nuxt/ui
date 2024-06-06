export default {
  slots: {
    overlay: 'fixed inset-0 z-50 bg-gray-200/75 dark:bg-gray-800/75',
    content: 'fixed z-50 bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800 sm:ring ring-gray-200 dark:ring-gray-800 sm:shadow-lg flex flex-col focus:outline-none',
    header: 'px-4 py-5 sm:px-6',
    body: 'flex-1 overflow-y-auto p-4 sm:p-6',
    footer: 'flex items-center gap-1.5 p-4 sm:px-6',
    title: 'text-gray-900 dark:text-white font-semibold',
    description: 'mt-1 text-gray-500 dark:text-gray-400 text-sm',
    close: 'absolute top-4 right-4'
  },
  variants: {
    side: {
      top: {
        content: 'inset-x-0 top-0'
      },
      right: {
        content: 'right-0 inset-y-0 w-full max-w-md'
      },
      bottom: {
        content: 'inset-x-0 bottom-0'
      },
      left: {
        content: 'left-0 inset-y-0 w-full max-w-md'
      }
    },
    transition: {
      true: {
        overlay: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]'
      }
    }
  },
  compoundVariants: [{
    transition: true,
    side: 'top',
    class: {
      content: 'data-[state=open]:animate-[slide-in-from-top_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-top_200ms_ease-in-out]'
    }
  }, {
    transition: true,
    side: 'right',
    class: {
      content: 'data-[state=open]:animate-[slide-in-from-right_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-right_200ms_ease-in-out]'
    }
  }, {
    transition: true,
    side: 'bottom',
    class: {
      content: 'data-[state=open]:animate-[slide-in-from-bottom_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-bottom_200ms_ease-in-out]'
    }
  }, {
    transition: true,
    side: 'left',
    class: {
      content: 'data-[state=open]:animate-[slide-in-from-left_200ms_ease-in-out] data-[state=closed]:animate-[slide-out-to-left_200ms_ease-in-out]'
    }
  }]
}
