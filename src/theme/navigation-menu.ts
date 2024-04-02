export default {
  slots: {
    root: 'relative',
    list: '',
    item: '',
    link: 'group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400 disabled:cursor-not-allowed disabled:opacity-75',
    linkLeadingIcon: 'shrink-0 size-5',
    linkLeadingAvatar: 'shrink-0',
    linkLabel: 'truncate',
    linkTrailing: 'ms-auto',
    linkTrailingBadge: 'shrink-0 rounded'
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'w-full flex items-center justify-between',
        list: 'flex items-center min-w-0',
        item: 'min-w-0',
        link: 'px-2.5 py-3.5 before:inset-x-0 before:inset-y-2 hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50 after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-[2px] after:mt-2 after:rounded-full'
      },
      vertical: {
        root: 'flex flex-col *:py-1.5 first:*:pt-0 last:*:pb-0 divide-y divide-gray-200 dark:divide-gray-800',
        link: 'px-2.5 py-1.5 before:inset-px'
      }
    },
    active: {
      true: {
        link: 'text-gray-900 dark:text-white',
        linkLeadingIcon: 'text-gray-700 dark:text-gray-200'
      },
      false: {
        link: 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white',
        linkLeadingIcon: 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    active: true,
    class: {
      link: 'after:bg-primary-500 dark:after:bg-primary-400'
    }
  }, {
    orientation: 'vertical',
    active: true,
    class: {
      link: 'before:bg-gray-100 dark:before:bg-gray-800'
    }
  }, {
    orientation: 'vertical',
    active: false,
    class: {
      link: 'hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50'
    }
  }]
}
