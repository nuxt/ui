import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex gap-1.5 [&>div]:min-w-0',
    list: 'isolate min-w-0',
    label: 'w-full flex items-center gap-1.5 font-semibold text-xs/5 text-(--ui-text-highlighted) px-2.5 py-1.5',
    item: 'min-w-0',
    link: 'group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
    linkLeadingIcon: 'shrink-0 size-5',
    linkLeadingAvatar: 'shrink-0',
    linkLeadingAvatarSize: '2xs',
    linkTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    linkTrailingBadge: 'shrink-0',
    linkTrailingBadgeSize: 'sm',
    linkTrailingIcon: 'size-5 transform shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200',
    linkLabel: 'truncate',
    linkLabelExternalIcon: 'inline-block size-3 align-top text-(--ui-text-dimmed)',
    childList: '',
    childItem: '',
    childLink: 'group size-full px-3 py-2 rounded-md flex items-start gap-2 text-start',
    childLinkWrapper: 'flex flex-col items-start',
    childLinkIcon: 'size-5 shrink-0',
    childLinkLabel: 'font-semibold text-sm relative inline-flex',
    childLinkLabelExternalIcon: 'inline-block size-3 align-top text-(--ui-text-dimmed)',
    childLinkDescription: 'text-sm text-(--ui-text-muted)',
    separator: 'px-2 h-px bg-(--ui-border)',
    viewportWrapper: 'absolute top-full left-0 flex w-full',
    viewport: 'relative overflow-hidden bg-(--ui-bg) shadow-lg rounded-md ring ring-(--ui-border) h-(--reka-navigation-menu-viewport-height) w-full transition-[width,height,left] duration-200 origin-[top_center] data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] z-[1]',
    content: 'absolute top-0 left-0 w-full sm:w-auto',
    indicator: 'absolute data-[state=visible]:animate-[fade-in_100ms_ease-out] data-[state=hidden]:animate-[fade-out_100ms_ease-in] data-[state=hidden]:opacity-0 bottom-0 z-[2] w-(--reka-navigation-menu-indicator-size) translate-x-(--reka-navigation-menu-indicator-position) flex h-2.5 items-end justify-center overflow-hidden transition-[translate,width] duration-200',
    arrow: 'relative top-[50%] size-2.5 rotate-45 border border-(--ui-border) bg-(--ui-bg) z-[1] rounded-xs'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        link: `focus-visible:before:ring-(--ui-${color})`,
        childLink: `focus-visible:outline-(--ui-${color})`
      }])),
      neutral: {
        link: 'focus-visible:before:ring-(--ui-border-inverted)',
        childLink: 'focus-visible:outline-(--ui-border-inverted)'
      }
    },
    highlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    variant: {
      pill: '',
      link: ''
    },
    orientation: {
      horizontal: {
        root: 'items-center justify-between',
        list: 'flex items-center',
        item: 'py-2',
        link: 'px-2.5 py-1.5 before:inset-x-px before:inset-y-0',
        childList: 'grid p-2'
      },
      vertical: {
        root: 'flex-col',
        link: 'flex-row px-2.5 py-1.5 before:inset-y-px before:inset-x-0'
      }
    },
    contentOrientation: {
      horizontal: {
        viewportWrapper: 'justify-center',
        content: 'data-[motion=from-start]:animate-[enter-from-left_200ms_ease] data-[motion=from-end]:animate-[enter-from-right_200ms_ease] data-[motion=to-start]:animate-[exit-to-left_200ms_ease] data-[motion=to-end]:animate-[exit-to-right_200ms_ease]'
      },
      vertical: {
        viewport: 'sm:w-(--reka-navigation-menu-viewport-width) left-(--reka-navigation-menu-viewport-left)'
      }
    },
    active: {
      true: {
        childLink: 'bg-(--ui-bg-elevated) text-(--ui-text-highlighted)',
        childLinkIcon: 'text-(--ui-text)'
      },
      false: {
        link: 'text-(--ui-text-muted)',
        linkLeadingIcon: 'text-(--ui-text-dimmed)',
        childLink: ['hover:bg-(--ui-bg-elevated)/50 text-(--ui-text) hover:text-(--ui-text-highlighted)', options.theme.transitions && 'transition-colors'],
        childLinkIcon: ['text-(--ui-text-dimmed) group-hover:text-(--ui-text)', options.theme.transitions && 'transition-colors']
      }
    },
    disabled: {
      true: {
        link: 'cursor-not-allowed opacity-75'
      }
    },
    highlight: {
      true: ''
    },
    level: {
      true: ''
    },
    collapsed: {
      true: ''
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    contentOrientation: 'horizontal',
    class: {
      childList: 'grid-cols-2 gap-2'
    }
  }, {
    orientation: 'horizontal',
    contentOrientation: 'vertical',
    class: {
      childList: 'gap-1',
      content: 'w-60'
    }
  }, {
    orientation: 'horizontal',
    highlight: true,
    class: {
      link: ['after:absolute after:-bottom-2 after:inset-x-2.5 after:block after:h-px after:rounded-full', options.theme.transitions && 'after:transition-colors']
    }
  }, {
    orientation: 'vertical',
    highlight: true,
    level: true,
    class: {
      link: ['after:absolute after:-start-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full', options.theme.transitions && 'after:transition-colors']
    }
  }, {
    disabled: false,
    active: false,
    variant: 'pill',
    class: {
      link: ['hover:text-(--ui-text-highlighted) hover:before:bg-(--ui-bg-elevated)/50', options.theme.transitions && 'transition-colors before:transition-colors'],
      linkLeadingIcon: ['group-hover:text-(--ui-text)', options.theme.transitions && 'transition-colors']
    }
  }, {
    disabled: false,
    active: false,
    variant: 'pill',
    orientation: 'horizontal',
    class: {
      link: 'data-[state=open]:text-(--ui-text-highlighted)',
      linkLeadingIcon: 'group-data-[state=open]:text-(--ui-text)'
    }
  }, {
    disabled: false,
    variant: 'pill',
    highlight: true,
    orientation: 'horizontal',
    class: {
      link: 'data-[state=open]:before:bg-(--ui-bg-elevated)/50'
    }
  }, {
    disabled: false,
    variant: 'pill',
    highlight: false,
    active: false,
    orientation: 'horizontal',
    class: {
      link: 'data-[state=open]:before:bg-(--ui-bg-elevated)/50'
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'pill',
    active: true,
    class: {
      link: `text-(--ui-${color})`,
      linkLeadingIcon: `text-(--ui-${color}) group-data-[state=open]:text-(--ui-${color})`
    }
  })), {
    color: 'neutral',
    variant: 'pill',
    active: true,
    class: {
      link: 'text-(--ui-text-highlighted)',
      linkLeadingIcon: 'text-(--ui-text-highlighted) group-data-[state=open]:text-(--ui-text-highlighted)'
    }
  }, {
    variant: 'pill',
    active: true,
    highlight: false,
    class: {
      link: 'before:bg-(--ui-bg-elevated)'
    }
  }, {
    variant: 'pill',
    active: true,
    highlight: true,
    class: {
      link: ['hover:before:bg-(--ui-bg-elevated)/50', options.theme.transitions && 'before:transition-colors']
    }
  }, {
    disabled: false,
    active: false,
    variant: 'link',
    class: {
      link: ['hover:text-(--ui-text-highlighted)', options.theme.transitions && 'transition-colors'],
      linkLeadingIcon: ['group-hover:text-(--ui-text)', options.theme.transitions && 'transition-colors']
    }
  }, {
    disabled: false,
    active: false,
    variant: 'link',
    orientation: 'horizontal',
    class: {
      link: 'data-[state=open]:text-(--ui-text-highlighted)',
      linkLeadingIcon: 'group-data-[state=open]:text-(--ui-text)'
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'link',
    active: true,
    class: {
      link: `text-(--ui-${color})`,
      linkLeadingIcon: `text-(--ui-${color}) group-data-[state=open]:text-(--ui-${color})`
    }
  })), {
    color: 'neutral',
    variant: 'link',
    active: true,
    class: {
      link: 'text-(--ui-text-highlighted)',
      linkLeadingIcon: 'text-(--ui-text-highlighted) group-data-[state=open]:text-(--ui-text-highlighted)'
    }
  }, ...(options.theme.colors || []).map((highlightColor: string) => ({
    highlightColor,
    highlight: true,
    level: true,
    active: true,
    class: {
      link: `after:bg-(--ui-${highlightColor})`
    }
  })), {
    highlightColor: 'neutral',
    highlight: true,
    level: true,
    active: true,
    class: {
      link: 'after:bg-(--ui-bg-inverted)'
    }
  }, {
    orientation: 'vertical',
    collapsed: false,
    class: {
      childList: 'ms-5 border-s border-(--ui-border)',
      childItem: 'ps-1.5 -ms-px'
    }
  }, {
    orientation: 'vertical',
    collapsed: true,
    class: {
      link: 'px-1.5'
    }
  }],
  defaultVariants: {
    color: 'primary',
    highlightColor: 'primary',
    variant: 'pill'
  }
})
