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
    linkLabelExternalIcon: 'size-3 align-top text-[--ui-text-dimmed]',
    childList: 'grid grid-cols-2 gap-2 p-2',
    childItem: '',
    childLink: 'group size-full px-3 py-2 rounded-[calc(var(--ui-radius)*1.5)] flex items-start gap-2 text-left',
    childLinkWrapper: 'flex flex-col items-start',
    childLinkIcon: 'size-5 shrink-0',
    childLinkLabel: 'font-semibold text-sm relative inline-flex',
    childLinkLabelExternalIcon: 'size-3 align-top text-[--ui-text-dimmed]',
    childLinkDescription: 'text-sm text-[--ui-text-muted]',
    separator: 'px-2 h-px bg-[--ui-border]',
    viewportWrapper: 'absolute top-full inset-x-0 flex w-full',
    // FIXME: add `sm:w-[var(--radix-navigation-menu-viewport-width)]` / `transition-[width,height]` / `origin-[top_center]` once position is based on trigger
    viewport: 'relative overflow-hidden bg-[--ui-bg] shadow-lg rounded-[calc(var(--ui-radius)*1.5)] ring ring-[--ui-border] h-[--radix-navigation-menu-viewport-height] w-full data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in]',
    content: 'absolute top-0 left-0 w-full data-[motion=from-start]:animate-[enter-from-left_200ms_ease] data-[motion=from-end]:animate-[enter-from-right_200ms_ease] data-[motion=to-start]:animate-[exit-to-left_200ms_ease] data-[motion=to-end]:animate-[exit-to-right_200ms_ease]',
    indicator: 'data-[state=visible]:animate-[fade-in_100ms_ease-out] data-[state=hidden]:animate-[fade-out_100ms_ease-in] bottom-0 z-[1] flex h-2.5 items-end justify-center overflow-hidden transition-transform duration-200 ease-out',
    arrow: 'relative top-[50%] size-2.5 rotate-45 border border-[--ui-border] bg-[--ui-bg] z-[1] rounded-[calc(var(--ui-radius)/2)]'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        link: `focus-visible:before:ring-[--ui-${color}]`,
        childLink: `focus-visible:outline-[--ui-${color}]`
      }])),
      neutral: {
        link: 'focus-visible:before:ring-[--ui-border-inverted]',
        childLink: 'focus-visible:outline-[--ui-border-inverted]'
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
        link: 'px-2.5 py-1.5 before:inset-x-px before:inset-y-0'
      },
      vertical: {
        root: 'flex-col',
        link: 'px-2.5 py-1.5 before:inset-y-px before:inset-x-0'
      }
    },
    active: {
      true: {
        childLink: 'bg-[--ui-bg-elevated] text-[--ui-text-highlighted]',
        childLinkIcon: 'text-[--ui-text]'
      },
      false: {
        link: 'text-[--ui-text-muted]',
        linkLeadingIcon: 'text-[--ui-text-dimmed]',
        childLink: ['hover:bg-[--ui-bg-elevated]/50 text-[--ui-text] hover:text-[--ui-text-highlighted]', options.theme.transitions && 'transition-colors'],
        childLinkIcon: ['text-[--ui-text-dimmed] group-hover:text-[--ui-text]', options.theme.transitions && 'transition-colors']
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
      link: ['hover:text-[--ui-text-highlighted] hover:before:bg-[--ui-bg-elevated]/50 data-[state=open]:text-[--ui-text-highlighted] data-[state=open]:before:bg-[--ui-bg-elevated]/50', options.theme.transitions && 'transition-colors before:transition-colors'],
      linkLeadingIcon: ['group-hover:text-[--ui-text] group-data-[state=open]:text-[--ui-text]', options.theme.transitions && 'transition-colors']
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'pill',
    active: true,
    class: {
      link: `text-[--ui-${color}]`,
      linkLeadingIcon: `text-[--ui-${color}]`
    }
  })), {
    color: 'neutral',
    variant: 'pill',
    active: true,
    class: {
      link: 'text-[--ui-text-highlighted]',
      linkLeadingIcon: 'text-[--ui-text-highlighted]'
    }
  }, {
    variant: 'pill',
    active: true,
    highlight: false,
    class: {
      link: 'before:bg-[--ui-bg-elevated]'
    }
  }, {
    variant: 'pill',
    active: true,
    highlight: true,
    class: {
      link: ['hover:before:bg-[--ui-bg-elevated]/50', options.theme.transitions && 'before:transition-colors']
    }
  }, {
    disabled: false,
    active: false,
    variant: 'link',
    class: {
      link: ['hover:text-[--ui-text-highlighted] data-[state=open]:text-[--ui-text-highlighted]', options.theme.transitions && 'transition-colors'],
      linkLeadingIcon: ['group-hover:text-[--ui-text] group-data-[state=open]:text-[--ui-text]', options.theme.transitions && 'transition-colors']
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'link',
    active: true,
    class: {
      link: `text-[--ui-${color}]`,
      linkLeadingIcon: `text-[--ui-${color}]`
    }
  })), {
    color: 'neutral',
    variant: 'link',
    active: true,
    class: {
      link: 'text-[--ui-text-highlighted]',
      linkLeadingIcon: 'text-[--ui-text-highlighted]'
    }
  }, ...(options.theme.colors || []).map((highlightColor: string) => ({
    highlightColor,
    highlight: true,
    active: true,
    class: {
      link: `after:bg-[--ui-${highlightColor}]`
    }
  })), {
    highlightColor: 'neutral',
    highlight: true,
    active: true,
    class: {
      link: 'after:bg-[--ui-bg-inverted]'
    }
  }],
  defaultVariants: {
    color: 'primary',
    highlightColor: 'primary',
    variant: 'pill'
  }
})
