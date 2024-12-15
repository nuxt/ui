import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex items-center gap-2',
    list: 'relative flex p-1 group',
    indicator: 'absolute transition-[translate,width] duration-200',
    trigger: ['group relative inline-flex items-center shrink-0 min-w-0 data-[state=inactive]:text-[var(--ui-text-muted)] hover:data-[state=inactive]:not-disabled:text-[var(--ui-text)] font-medium rounded-[calc(var(--ui-radius)*1.5)] disabled:cursor-not-allowed disabled:opacity-75 focus:outline-hidden', options.theme.transitions && 'transition-colors'],
    content: 'focus:outline-none w-full',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    label: 'truncate'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    variant: {
      pill: {
        list: 'bg-[var(--ui-bg-elevated)] rounded-[calc(var(--ui-radius)*2)]',
        trigger: 'flex-1 w-full',
        indicator: 'rounded-[calc(var(--ui-radius)*1.5)] shadow-xs'
      },
      link: {
        list: 'border-[var(--ui-border)]',
        indicator: 'rounded-full'
      }
    },
    orientation: {
      horizontal: {
        root: 'flex-col',
        list: 'w-full',
        indicator: 'left-0 w-[var(--reka-tabs-indicator-size)] translate-x-[var(--reka-tabs-indicator-position)]',
        trigger: 'justify-center'
      },
      vertical: {
        list: 'flex-col',
        indicator: 'top-0 h-[var(--reka-tabs-indicator-size)] translate-y-[var(--reka-tabs-indicator-position)]'
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
      indicator: 'inset-y-1'
    }
  }, {
    orientation: 'horizontal',
    variant: 'link',
    class: {
      list: 'border-b -mb-px',
      indicator: '-bottom-px h-px'
    }
  }, {
    orientation: 'vertical',
    variant: 'pill',
    class: {
      indicator: 'inset-x-1',
      list: 'items-center'
    }
  }, {
    orientation: 'vertical',
    variant: 'link',
    class: {
      list: 'border-s -ms-px',
      indicator: '-start-px w-px'
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'pill',
    class: {
      indicator: `bg-[var(--ui-${color})]`,
      trigger: `data-[state=active]:text-[var(--ui-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-${color})]`
    }
  })), {
    color: 'neutral',
    variant: 'pill',
    class: {
      indicator: 'bg-[var(--ui-bg-inverted)]',
      trigger: 'data-[state=active]:text-[var(--ui-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ui-border-inverted)]'
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'link',
    class: {
      indicator: `bg-[var(--ui-${color})]`,
      trigger: `data-[state=active]:text-[var(--ui-${color})] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-${color})]`
    }
  })), {
    color: 'neutral',
    variant: 'link',
    class: {
      indicator: 'bg-[var(--ui-bg-inverted)]',
      trigger: 'data-[state=active]:text-[var(--ui-text-highlighted)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-border-inverted)]'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'pill',
    size: 'md'
  }
})
