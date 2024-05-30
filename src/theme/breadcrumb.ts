export default {
  slots: {
    root: 'relative min-w-0',
    list: 'flex items-center gap-1.5',
    item: 'flex min-w-0',
    link: 'group relative flex items-center gap-1.5 text-sm min-w-0',
    linkLeadingIcon: 'shrink-0 size-5',
    linkLeadingAvatar: 'shrink-0',
    linkLabel: 'truncate',
    separator: 'flex',
    separatorIcon: 'shrink-0 size-5 text-gray-500 dark:text-gray-400'
  },
  variants: {
    active: {
      true: {
        link: 'text-primary-500 dark:text-primary-400 font-semibold'
      },
      false: {
        link: 'text-gray-500 dark:text-gray-400 font-medium'
      }
    },
    disabled: {
      true: {
        link: 'cursor-not-allowed opacity-75'
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
      link: 'hover:text-gray-700 dark:hover:text-gray-200 transition-colors'
    }
  }]
}
