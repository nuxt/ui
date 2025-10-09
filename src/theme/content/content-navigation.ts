import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: '',
    content: 'data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out] overflow-hidden focus:outline-none',
    list: 'isolate -mx-2.5 -mt-1.5',
    item: '',
    listWithChildren: 'ms-5 border-s border-default',
    itemWithChildren: 'flex flex-col data-[state=open]:mb-1.5',
    trigger: 'font-semibold',
    link: 'group relative w-full px-2.5 py-1.5 before:inset-y-px before:inset-x-0 flex items-center gap-1.5 text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
    linkLeadingIcon: 'shrink-0 size-5',
    linkTrailing: 'ms-auto inline-flex gap-1.5 items-center',
    linkTrailingBadge: 'shrink-0',
    linkTrailingBadgeSize: 'sm',
    linkTrailingIcon: 'size-5 transform transition-transform duration-200 shrink-0 group-data-[state=open]:rotate-180',
    linkTitle: 'truncate',
    linkTitleExternalIcon: 'size-3 align-top text-dimmed'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        trigger: `focus-visible:ring-${color}`,
        link: `focus-visible:before:ring-${color}`
      }])),
      neutral: {
        trigger: 'focus-visible:ring-inverted',
        link: 'focus-visible:before:ring-inverted'
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
    active: {
      true: {
        link: 'font-medium'
      },
      false: {
        link: 'text-muted',
        linkLeadingIcon: 'text-dimmed'
      }
    },
    disabled: {
      true: {
        trigger: 'data-[state=open]:text-highlighted'
      }
    },
    highlight: {
      true: {}
    },
    level: {
      true: {
        item: 'ps-1.5 -ms-px',
        itemWithChildren: 'ps-1.5 -ms-px'
      }
    }
  },
  compoundVariants: [{
    highlight: true,
    level: true,
    class: {
      link: ['after:absolute after:-left-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full', options.theme.transitions && 'after:transition-colors']
    }
  }, {
    disabled: false,
    active: false,
    variant: 'pill',
    class: {
      link: ['hover:text-highlighted hover:before:bg-elevated/50 data-[state=open]:text-highlighted', options.theme.transitions && 'transition-colors before:transition-colors'],
      linkLeadingIcon: ['group-hover:text-default group-data-[state=open]:text-default', options.theme.transitions && 'transition-colors']
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'pill',
    active: true,
    class: {
      link: `text-${color}`,
      linkLeadingIcon: `text-${color} group-data-[state=open]:text-${color}`
    }
  })), {
    color: 'neutral',
    variant: 'pill',
    active: true,
    class: {
      link: 'text-highlighted',
      linkLeadingIcon: 'text-highlighted group-data-[state=open]:text-highlighted'
    }
  }, {
    variant: 'pill',
    active: true,
    highlight: false,
    class: {
      link: 'before:bg-elevated'
    }
  }, {
    variant: 'pill',
    active: true,
    highlight: true,
    disabled: false,
    class: {
      link: ['hover:before:bg-elevated/50', options.theme.transitions && 'before:transition-colors']
    }
  }, {
    disabled: false,
    active: false,
    variant: 'link',
    class: {
      link: ['hover:text-highlighted data-[state=open]:text-highlighted', options.theme.transitions && 'transition-colors'],
      linkLeadingIcon: ['group-hover:text-default group-data-[state=open]:text-default', options.theme.transitions && 'transition-colors']
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'link',
    active: true,
    class: {
      link: `text-${color}`,
      linkLeadingIcon: `text-${color} group-data-[state=open]:text-${color}`
    }
  })), {
    color: 'neutral',
    variant: 'link',
    active: true,
    class: {
      link: 'text-highlighted',
      linkLeadingIcon: 'text-highlighted group-data-[state=open]:text-highlighted'
    }
  }, ...(options.theme.colors || []).map((highlightColor: string) => ({
    highlightColor,
    highlight: true,
    level: true,
    active: true,
    class: {
      link: `after:bg-${highlightColor}`
    }
  })), {
    highlightColor: 'neutral',
    highlight: true,
    level: true,
    active: true,
    class: {
      link: 'after:bg-inverted'
    }
  }],
  defaultVariants: {
    color: 'primary',
    highlightColor: 'primary',
    variant: 'pill'
  }
})
