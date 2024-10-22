import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex gap-1.5',
    list: 'isolate min-w-0',
    item: 'min-w-0',
    link: 'group relative w-full flex items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-[calc(var(--ui-radius)*1.5)] focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
    linkLeadingIcon: 'shrink-0 size-5',
    linkLeadingAvatar: 'shrink-0',
    linkLeadingAvatarSize: '2xs',
    linkTrailing: 'ms-auto inline-flex',
    linkTrailingBadge: 'shrink-0 rounded',
    linkTrailingBadgeSize: 'sm',
    linkTrailingIcon: 'size-5 transform shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200',
    linkLabel: 'truncate',
    linkLabelExternalIcon: 'size-3 align-top text-[var(--ui-text-dimmed)]',
    childList: 'gap-2 p-2',
    childItem: '',
    childLink: 'group size-full px-3 rounded-[calc(var(--ui-radius)*1.5)] flex items-start gap-2 text-left',
    childLinkWrapper: 'flex flex-col items-start',
    childLinkIcon: 'size-5 shrink-0',
    childLinkLabel: 'text-sm relative inline-flex',
    childLinkLabelExternalIcon: 'size-3 align-top text-[var(--ui-text-dimmed)]',
    childLinkTrailingBadge: 'ms-auto shrink-0 rounded',
    childLinkTrailingBadgeSize: 'sm',
    childLinkDescription: 'text-sm text-[var(--ui-text-muted)]',
    separator: 'px-2 h-px bg-[var(--ui-border)]',
    viewportWrapper: 'absolute top-full inset-x-0 flex w-full',
    // FIXME: add `sm:w-[var(--radix-navigation-menu-viewport-width)]` / `transition-[width,height]` / `origin-[top_center]` once position is based on trigger
    viewport: 'relative overflow-hidden bg-[var(--ui-bg)] shadow-lg rounded-[calc(var(--ui-radius)*1.5)] ring ring-[var(--ui-border)] h-[var(--radix-navigation-menu-viewport-height)] w-full data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
    content: 'w-full data-[motion=from-start]:animate-[enter-from-left_200ms_ease] data-[motion=from-end]:animate-[enter-from-right_200ms_ease] data-[motion=to-start]:animate-[exit-to-left_200ms_ease] data-[motion=to-end]:animate-[exit-to-right_200ms_ease]',
    indicator: 'data-[state=visible]:animate-[fade-in_100ms_ease-out] data-[state=hidden]:animate-[fade-out_100ms_ease-in] bottom-0 z-[1] flex h-2.5 items-end justify-center overflow-hidden transition-transform duration-200 ease-out',
    arrow: 'relative top-[50%] size-2.5 rotate-45 border border-[var(--ui-border)] bg-[var(--ui-bg)] z-[1] rounded-[calc(var(--ui-radius)/2)]'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        link: `focus-visible:before:ring-[var(--ui-${color})]`,
        childLink: `focus-visible:outline-[var(--ui-${color})]`
      }])),
      neutral: {
        link: 'focus-visible:before:ring-[var(--ui-border-inverted)]',
        childLink: 'focus-visible:outline-[var(--ui-border-inverted)]'
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
        root: 'w-full items-center justify-between',
        list: 'flex items-center',
        item: 'py-2',
        link: 'px-2.5 py-1.5 before:inset-x-px before:inset-y-0',
        childList: 'grid grid-cols-2',
        childLink: 'py-2',
        childLinkLabel: 'font-semibold',
        content: 'absolute top-0 left-0'
      },
      vertical: {
        root: 'flex-col',
        link: 'flex-row px-2.5 py-1.5 before:inset-y-px before:inset-x-0',
        childList: 'flex flex-col ml-5 border-l border-[var(--ui-border)]',
        childLink: 'py-1',
        childLinkLabel: 'text-[var(--ui-text-muted)]'
      }
    },
    active: {
      true: {
        childLink: 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text-highlighted)]',
        childLinkIcon: 'text-[var(--ui-text)]'
      },
      false: {
        link: 'text-[var(--ui-text-muted)]',
        linkLeadingIcon: 'text-[var(--ui-text-dimmed)]',
        childLink: ['hover:bg-[var(--ui-bg-elevated)]/50 text-[var(--ui-text)] hover:text-[var(--ui-text-highlighted)]', options.theme.transitions && 'transition-colors'],
        childLinkIcon: ['text-[var(--ui-text-dimmed)] group-hover:text-[var(--ui-text)]', options.theme.transitions && 'transition-colors']
      }
    },
    disabled: {
      true: {
        link: 'cursor-not-allowed opacity-75'
      }
    },
    highlight: {
      true: ''
    }
  },
  compoundVariants: [{
    highlight: true,
    orientation: 'horizontal',
    class: {
      item: '-mb-px',
      link: 'after:absolute after:-bottom-2 after:inset-x-2.5 after:block after:h-px after:rounded-full'
    }
  }, {
    highlight: true,
    orientation: 'vertical',
    class: {
      item: 'px-1.5 -ml-px',
      link: 'after:absolute after:-left-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full'
    }
  }, {
    disabled: false,
    active: false,
    variant: 'pill',
    class: {
      link: ['hover:text-[var(--ui-text-highlighted)] hover:before:bg-[var(--ui-bg-elevated)]/50 data-[state=open]:text-[var(--ui-text-highlighted)] data-[state=open]:before:bg-[var(--ui-bg-elevated)]/50', options.theme.transitions && 'transition-colors before:transition-colors'],
      linkLeadingIcon: ['group-hover:text-[var(--ui-text)] group-data-[state=open]:text-[var(--ui-text)]', options.theme.transitions && 'transition-colors']
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'pill',
    active: true,
    class: {
      link: `text-[var(--ui-${color})]`,
      linkLeadingIcon: `text-[var(--ui-${color})]`
    }
  })), {
    color: 'neutral',
    variant: 'pill',
    active: true,
    class: {
      link: 'text-[var(--ui-text-highlighted)]',
      linkLeadingIcon: 'text-[var(--ui-text-highlighted)]'
    }
  }, {
    variant: 'pill',
    active: true,
    highlight: false,
    class: {
      link: 'before:bg-[var(--ui-bg-elevated)]'
    }
  }, {
    variant: 'pill',
    active: true,
    highlight: true,
    class: {
      link: ['hover:before:bg-[var(--ui-bg-elevated)]/50', options.theme.transitions && 'before:transition-colors']
    }
  }, {
    disabled: false,
    active: false,
    variant: 'link',
    class: {
      link: ['hover:text-[var(--ui-text-highlighted)] data-[state=open]:text-[var(--ui-text-highlighted)]', options.theme.transitions && 'transition-colors'],
      linkLeadingIcon: ['group-hover:text-[var(--ui-text)] group-data-[state=open]:text-[var(--ui-text)]', options.theme.transitions && 'transition-colors']
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'link',
    active: true,
    class: {
      link: `text-[var(--ui-${color})]`,
      linkLeadingIcon: `text-[var(--ui-${color})]`
    }
  })), {
    color: 'neutral',
    variant: 'link',
    active: true,
    class: {
      link: 'text-[var(--ui-text-highlighted)]',
      linkLeadingIcon: 'text-[var(--ui-text-highlighted)]'
    }
  }, ...(options.theme.colors || []).map((highlightColor: string) => ({
    highlightColor,
    highlight: true,
    active: true,
    class: {
      link: `after:bg-[var(--ui-${highlightColor})]`
    }
  })), {
    highlightColor: 'neutral',
    highlight: true,
    active: true,
    class: {
      link: 'after:bg-[var(--ui-bg-inverted)]'
    }
  }],
  defaultVariants: {
    color: 'primary',
    highlightColor: 'primary',
    variant: 'pill'
  }
})
