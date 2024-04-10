export default (config: { colors: string[] }) => ({
  slots: {
    root: 'relative overflow-hidden bg-white dark:bg-gray-900 shadow-lg rounded-lg ring ring-gray-200 dark:ring-gray-800 p-4 flex gap-2.5',
    wrapper: 'w-0 flex-1 flex flex-col gap-1',
    title: 'text-sm font-medium text-gray-900 dark:text-white',
    description: 'text-sm text-gray-500 dark:text-gray-400',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    actions: 'flex gap-1.5 shrink-0',
    progress: 'absolute inset-0 rounded-lg border-b-2 z-[-1]',
    mask: 'absolute top-0 inset-0 bottom-[2px] bg-white dark:bg-gray-900 z-[-1]',
    close: 'p-1'
  },
  variants: {
    color: Object.fromEntries(config.colors.map((color: string) => [color, {
      icon: `text-${color}-500 dark:text-${color}-400`,
      progress: `border-${color}-500 dark:border-${color}-400`
    }])),
    multiline: {
      true: {
        root: 'items-start',
        actions: 'items-start mt-1'
      },
      false: {
        root: 'items-center',
        actions: 'items-center'
      }
    }
  },
  defaultVariants: {
    color: 'primary'
  }
})
