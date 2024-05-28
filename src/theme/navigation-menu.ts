export default (config: { colors: string[] }) => ({
  slots: {
    root: 'relative flex gap-1.5',
    list: 'isolate min-w-0',
    item: 'min-w-0',
    link: 'group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2 focus-visible:before:ring-primary-500 dark:focus-visible:before:ring-primary-400',
    linkLeadingIcon: 'shrink-0 size-5',
    linkLeadingAvatar: 'shrink-0',
    linkTrailing: 'ms-auto inline-flex',
    linkTrailingBadge: 'shrink-0 rounded',
    linkTrailingIcon: 'size-5 transform transition-transform duration-200 shrink-0 group-data-[state=open]:rotate-180',
    linkLabel: 'truncate',
    linkLabelExternalIcon: 'size-3 align-top text-gray-400 dark:text-gray-500',
    childList: 'grid grid-cols-2 gap-2 p-2',
    childItem: '',
    childLink: 'group size-full px-3 py-2 rounded-md flex items-start gap-2 text-left',
    childLinkWrapper: 'flex flex-col items-start',
    childLinkLabel: 'font-semibold text-sm relative inline-flex',
    childLinkDescription: 'text-sm text-gray-500 dark:text-gray-400',
    childLinkIcon: 'size-5 shrink-0',
    childLinkExternalIcon: 'size-3 align-top text-gray-400 dark:text-gray-500',
    separator: 'px-2 h-px bg-gray-200 dark:bg-gray-800',
    viewportWrapper: 'absolute top-full inset-x-0 flex w-full',
    // FIXME: add `sm:w-[var(--radix-navigation-menu-viewport-width)]` / `transition-[width,height]` / `origin-[top_center]` once position is based on trigger
    viewport: 'relative overflow-hidden bg-white dark:bg-gray-900 shadow-lg rounded-md ring ring-gray-200 dark:ring-gray-800 will-change-[transform,opacity] h-[--radix-navigation-menu-viewport-height] w-full data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
    content: 'absolute top-0 left-0 w-full data-[motion=from-start]:animate-[enter-from-left_200ms_ease] data-[motion=from-end]:animate-[enter-from-right_200ms_ease] data-[motion=to-start]:animate-[exit-to-left_200ms_ease] data-[motion=to-end]:animate-[exit-to-right_200ms_ease]',
    indicator: 'data-[state=visible]:animate-[fade-in_100ms_ease-out] data-[state=hidden]:animate-[fade-out_100ms_ease-in] bottom-0 z-[1] flex h-2.5 items-end justify-center overflow-hidden transition-transform duration-200 ease-out',
    arrow: 'relative top-[50%] size-2.5 rotate-45 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-[1] rounded-sm'
  },
  variants: {
    color: {
      ...Object.fromEntries(config.colors.map((color: string) => [color, ''])),
      black: ''
    },
    variant: {
      pill: '',
      line: '',
      link: ''
    },
    orientation: {
      horizontal: {
        root: 'w-full items-center justify-between',
        list: 'flex items-center',
        item: 'py-2',
        link: 'px-2.5 py-1.5 before:inset-x-px before:inset-y-0'
      },
      vertical: {
        root: 'flex-col',
        link: 'px-2.5 py-1.5 before:inset-y-px before:inset-x-0'
      }
    },
    active: {
      true: {
        link: 'text-gray-900 dark:text-white',
        linkLeadingIcon: 'text-gray-700 dark:text-gray-200',
        childLink: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white',
        childLinkIcon: 'text-gray-700 dark:text-gray-200'

      },
      false: {
        link: 'text-gray-500 dark:text-gray-400',
        linkLeadingIcon: 'text-gray-400 dark:text-gray-500',
        childLink: 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors',
        childLinkIcon: 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors'
      }
    },
    disabled: {
      true: {
        link: 'cursor-not-allowed opacity-75'
      }
    }
  },
  compoundVariants: [{
    variant: 'line',
    orientation: 'horizontal',
    class: {
      link: 'after:absolute after:-bottom-[calc(var(--spacing-2)+1px)] after:inset-x-2.5 after:block after:h-0.5 after:rounded-full'
    }
  }, {
    variant: 'line',
    orientation: 'vertical',
    class: {
      item: 'px-2',
      link: 'after:absolute after:-left-[calc(var(--spacing-2)+1px)] after:inset-y-0.5 after:block after:w-0.5 after:rounded-full'
    }
  }, {
    disabled: false,
    active: false,
    variant: 'pill',
    class: {
      link: 'hover:text-gray-900 dark:hover:text-white transition-colors hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50 before:transition-colors',
      linkLeadingIcon: 'group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors'
    }
  }, ...config.colors.map((color: string) => ({
    color,
    variant: 'pill',
    active: true,
    class: {
      link: `text-${color}-500 dark:text-${color}-400 before:bg-gray-100 dark:before:bg-gray-800`,
      linkLeadingIcon: `text-${color}-500 dark:text-${color}-400`
    }
  })), {
    color: 'black',
    variant: 'pill',
    active: true,
    class: {
      link: 'text-gray-900 dark:text-white before:bg-gray-100 dark:before:bg-gray-800',
      linkLeadingIcon: 'text-gray-900 dark:text-white'
    }
  }, {
    disabled: false,
    variant: 'line',
    class: {
      link: 'hover:text-gray-900 dark:hover:text-white transition-colors hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50 before:transition-colors',
      linkLeadingIcon: 'group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors'
    }
  }, ...config.colors.map((color: string) => ({
    color,
    variant: 'line',
    active: true,
    class: {
      link: `after:bg-${color}-500 dark:after:bg-${color}-400`
    }
  })), {
    color: 'black',
    variant: 'line',
    active: true,
    class: {
      link: 'after:bg-gray-900 dark:after:bg-white'
    }
  }, {
    disabled: false,
    active: false,
    variant: 'link',
    class: {
      link: 'hover:text-gray-900 dark:hover:text-white transition-colors',
      linkLeadingIcon: 'group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors'
    }
  }, ...config.colors.map((color: string) => ({
    color,
    variant: 'link',
    active: true,
    class: {
      link: `text-${color}-500 dark:text-${color}-400`,
      linkLeadingIcon: `text-${color}-500 dark:text-${color}-400`
    }
  })), {
    color: 'black',
    variant: 'link',
    active: true,
    class: {
      link: 'text-gray-900 dark:text-white',
      linkLeadingIcon: 'text-gray-900 dark:text-white'
    }
  }],
  // compoundVariants: [{
  //   disabled: false,
  //   active: false,
  //   class: {
  //     item: 'hover:text-gray-900 dark:hover:text-white transition-colors',
  //     itemLeadingIcon: 'group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors'
  //   }
  // }, {
  //   orientation: 'horizontal',
  //   active: true,
  //   class: {
  //     item: 'after:bg-primary-500 dark:after:bg-primary-400'
  //   }
  // }, {
  //   orientation: 'horizontal',
  //   disabled: false,
  //   class: {
  //     item: 'hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50 before:transition-colors'
  //   }
  // }, {
  //   orientation: 'vertical',
  //   active: true,
  //   class: {
  //     item: 'before:bg-gray-100 dark:before:bg-gray-800'
  //   }
  // }, {
  //   orientation: 'vertical',
  //   active: false,
  //   disabled: false,
  //   class: {
  //     item: 'hover:before:bg-gray-50 dark:hover:before:bg-gray-800/50 before:transition-colors'
  //   }
  // }],
  defaultVariants: {
    color: 'primary',
    variant: 'pill'
  }
})
