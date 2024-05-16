export default {
  slots: {
    root: 'relative flex gap-1.5',
    list: 'isolate min-w-0',
    itemWrapper: 'min-w-0',
    item: 'group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400',
    itemLeadingIcon: 'shrink-0 size-5',
    itemLeadingAvatar: 'shrink-0',
    itemLabel: 'truncate',
    itemTrailing: 'ms-auto',
    itemTrailingBadge: 'shrink-0 rounded',
    separator: 'px-2'
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'w-full items-center justify-between',
        list: 'flex items-center',
        item: 'px-2.5 py-3.5 before:inset-x-0 before:inset-y-2 after:absolute after:bottom-0 after:inset-x-2.5 after:block after:h-0.5 after:mt-2 after:rounded-full'
      },
      vertical: {
        root: 'flex-col',
        item: 'px-2.5 py-1.5 before:inset-px'
      }
    },
    active: {
      true: {
        item: 'text-gray-900 dark:text-white',
        itemLeadingIcon: 'text-gray-700 dark:text-gray-200'
      },
      false: {
        item: 'text-gray-500 dark:text-gray-400',
        itemLeadingIcon: 'text-gray-400 dark:text-gray-500'
      }
    },
    disabled: {
      true: {
        item: 'cursor-not-allowed opacity-75'
      }
    }
  },
  compoundVariants: [{
    disabled: false,
    active: false,
    class: {
      item: 'hover:text-gray-900 dark:hover:text-white transition-colors',
      itemLeadingIcon: 'group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors'
    }
  }, {
    orientation: 'horizontal',
    active: true,
    class: {
      item: 'after:bg-primary-500 dark:after:bg-primary-400'
    }
  }, {
    orientation: 'horizontal',
    disabled: false,
    class: {
      item: 'hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50 before:transition-colors'
    }
  }, {
    orientation: 'vertical',
    active: true,
    class: {
      item: 'before:bg-gray-100 dark:before:bg-gray-800'
    }
  }, {
    orientation: 'vertical',
    active: false,
    disabled: false,
    class: {
      item: 'hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50 before:transition-colors'
    }
  }]
}
