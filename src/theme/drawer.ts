export default {
  slots: {
    overlay: 'fixed inset-0 z-50 bg-gray-200/75 dark:bg-gray-800/75',
    content: 'fixed z-50 bg-white dark:bg-gray-900 ring ring-gray-200 dark:ring-gray-800 flex focus:outline-none',
    handle: 'shrink-0 rounded-full bg-gray-200 dark:bg-gray-700',
    container: 'w-full flex flex-col gap-4 p-4 overflow-y-auto',
    header: '',
    title: 'text-gray-900 dark:text-white font-semibold',
    description: 'mt-1 text-gray-500 dark:text-gray-400 text-sm',
    body: 'flex-1',
    footer: 'flex flex-col gap-1.5'
  },
  variants: {
    direction: {
      top: {
        content: 'top-0 mb-24 flex-col-reverse rounded-b-lg',
        handle: 'mb-4'
      },
      right: {
        content: 'right-4 flex-row',
        handle: 'ml-4'
      },
      bottom: {
        content: 'bottom-0 mt-24 flex-col rounded-t-lg',
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
      content: 'inset-y-4 w-auto max-w-[96%] rounded-lg after:hidden',
      handle: 'h-12 w-1.5 mt-auto mb-auto'
    }
  }]
}
