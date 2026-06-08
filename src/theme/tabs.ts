import type { ModuleOptions } from '../module'

// Active-tab highlight shown before reka-ui's `TabsIndicator` mounts (SSR / pre-hydration).
// reka-ui only renders the real indicator on the client (it needs DOM measurements), so we gate
// a CSS-only pseudo-element fallback on the active trigger by the *absence* of the indicator
// element — the instant reka's measured indicator appears, this selector stops matching.
const ssr = (...classes: string[]) => classes.map(c => `in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:${c}`).join(' ')

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex items-center gap-2',
    list: 'relative flex p-1 group',
    indicator: 'absolute transition-[translate,width] duration-200',
    trigger: ['group relative inline-flex items-center min-w-0 data-[state=inactive]:text-muted hover:data-[state=inactive]:not-disabled:text-default font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75', options.theme.transitions && 'transition-colors'],
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    label: 'truncate',
    trailingBadge: 'shrink-0',
    trailingBadgeSize: 'sm',
    content: 'focus:outline-none w-full'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    variant: {
      pill: {
        list: 'bg-elevated rounded-lg',
        trigger: [`grow`, ssr('before:content-[\'\']', 'before:absolute', 'before:inset-0', 'before:rounded-md', 'before:shadow-xs', 'before:-z-10', 'isolate')],
        indicator: 'rounded-md shadow-xs'
      },
      link: {
        list: 'border-default',
        indicator: 'rounded-full',
        trigger: [`focus:outline-none`, ssr('after:content-[\'\']', 'after:absolute', 'after:rounded-full')]
      }
    },
    orientation: {
      horizontal: {
        root: 'flex-col',
        list: 'w-full',
        indicator: 'left-0 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position)',
        trigger: 'justify-center'
      },
      vertical: {
        list: 'flex-col',
        indicator: 'top-0 h-(--reka-tabs-indicator-size) translate-y-(--reka-tabs-indicator-position)'
      }
    },
    size: {
      xs: {
        trigger: 'px-2 py-1 text-xs gap-1',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs'
      },
      sm: {
        trigger: 'px-2.5 py-1.5 text-xs gap-1.5',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs'
      },
      md: {
        trigger: 'px-3 py-1.5 text-sm gap-1.5',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs'
      },
      lg: {
        trigger: 'px-3 py-2 text-sm gap-2',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs'
      },
      xl: {
        trigger: 'px-3 py-2 text-base gap-2',
        leadingIcon: 'size-6',
        leadingAvatarSize: 'xs'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    variant: 'pill',
    class: {
      indicator: 'inset-y-1',
      trigger: ssr('before:w-[round(100%,1px)]')
    }
  }, {
    orientation: 'horizontal',
    variant: 'link',
    class: {
      list: 'border-b -mb-px',
      indicator: '-bottom-px h-px',
      trigger: ssr('after:inset-x-0', 'after:-bottom-[calc(var(--spacing)+1px)]', 'after:h-px')
    }
  }, {
    orientation: 'vertical',
    variant: 'pill',
    class: {
      indicator: 'inset-x-1',
      list: 'items-center',
      trigger: ssr('before:h-[round(100%,1px)]')
    }
  }, {
    orientation: 'vertical',
    variant: 'link',
    class: {
      list: 'border-s -ms-px',
      indicator: '-start-px w-px',
      trigger: ssr('after:inset-y-0', 'after:-start-[calc(var(--spacing)+1px)]', 'after:w-px')
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'pill',
    class: {
      indicator: `bg-${color}`,
      trigger: [`data-[state=active]:text-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${color}`, ssr(`before:bg-${color}`)]
    }
  })), {
    color: 'neutral',
    variant: 'pill',
    class: {
      indicator: 'bg-inverted',
      trigger: [`data-[state=active]:text-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted`, ssr('before:bg-inverted')]
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'link',
    class: {
      indicator: `bg-${color}`,
      trigger: [`data-[state=active]:text-${color} focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`, ssr(`after:bg-${color}`)]
    }
  })), {
    color: 'neutral',
    variant: 'link',
    class: {
      indicator: 'bg-inverted',
      trigger: [`data-[state=active]:text-highlighted focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted`, ssr('after:bg-inverted')]
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'pill',
    size: 'md'
  }
})
