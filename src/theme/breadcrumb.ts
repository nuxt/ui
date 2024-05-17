export default {
  slots: {
    root: 'relative min-w-0',
    list: 'flex items-center gap-1.5',
    itemWrapper: 'flex min-w-0',
    item: 'group relative flex items-center gap-1.5 font-medium text-sm min-w-0',
    itemLeadingIcon: 'shrink-0 size-5',
    itemLeadingAvatar: 'shrink-0',
    itemLabel: 'truncate',
    separator: 'flex',
    separatorIcon: 'shrink-0 size-5 text-gray-500 dark:text-gray-400'
  },
  variants: {
    active: {
      true: {
        item: 'text-primary-500 dark:text-primary-400'
      },
      false: {
        item: 'text-gray-500 dark:text-gray-400'
      }
    },
    disabled: {
      true: {
        item: 'cursor-not-allowed opacity-75'
      }
    },
    to: {
      true: ''
    }
  },
  compoundVariants: [{
    disabled: false,
    active: false,
    to: true,
    class: {
      item: 'hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
    }
  }]
}
