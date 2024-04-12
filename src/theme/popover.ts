export default {
  slots: {
    content: 'bg-white dark:bg-gray-900 shadow-lg rounded-md ring ring-gray-200 dark:ring-gray-800',
    arrow: 'fill-gray-200 dark:fill-gray-800'
  },
  variants: {
    side: {
      top: {
        content: 'data-[state=open]:animate-[slide-in-from-top-and-fade_200ms_ease-out] data-[state=closed]:animate-[slide-out-to-top-and-fade_200ms_ease-in]'
      },
      right: {
        content: 'data-[state=open]:animate-[slide-in-from-right-and-fade_200ms_ease-out] data-[state=closed]:animate-[slide-out-to-right-and-fade_200ms_ease-in]'
      },
      bottom: {
        content: 'data-[state=open]:animate-[slide-in-from-bottom-and-fade_200ms_ease-out] data-[state=closed]:animate-[slide-out-to-bottom-and-fade_200ms_ease-in]'
      },
      left: {
        content: 'data-[state=open]:animate-[slide-in-from-left-and-fade_200ms_ease-out] data-[state=closed]:animate-[slide-out-to-left-and-fade_200ms_ease-in]'
      }
    }
  }
}
