export default {
  slots: {
    overlay: 'fixed inset-0 z-50 bg-gray-200/75 dark:bg-gray-800/75',
    content: 'fixed inset-x-0 bottom-0 z-50 mt-24 bg-white dark:bg-gray-900 ring ring-gray-200 dark:ring-gray-800 rounded-t-lg h-auto max-h-[96%] flex flex-col focus:outline-none',
    handle: 'mx-auto w-12 my-4 h-1.5 shrink-0 rounded-full bg-gray-200 dark:bg-gray-700',
    container: 'mx-auto w-full max-w-md flex flex-col gap-4 px-4 pb-8 overflow-y-auto',
    header: '',
    title: 'text-gray-900 dark:text-white font-semibold',
    description: 'mt-1 text-gray-500 dark:text-gray-400 text-sm',
    body: 'flex-1',
    footer: 'flex flex-col gap-1.5'
  }
}
