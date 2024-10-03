import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex items-center gap-2',
    list: 'relative flex p-1 group',
    indicator: 'absolute transition-[translate,width] duration-200',
    trigger: ['relative inline-flex items-center shrink-0 data-[state=inactive]:text-[--ui-text-muted] hover:data-[state=inactive]:text-[--ui-text] font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none', options.theme.transitions && 'transition-colors'],
    content: 'focus:outline-none w-full',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    label: 'truncate'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      gray: ''
    },
    variant: {
      pill: {
        list: 'bg-[--ui-bg-elevated] rounded-lg',
        trigger: 'flex-1',
        indicator: 'rounded-md shadow-sm'
      },
      link: {
        list: 'border-[--ui-border]',
        indicator: 'rounded-full'
      }
    },
    orientation: {
      horizontal: {
        root: 'flex-col',
        list: 'w-full',
        indicator: 'left-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position]',
        trigger: 'justify-center'
      },
      vertical: {
        list: 'flex-col',
        indicator: 'top-0 h-[--radix-tabs-indicator-size] translate-y-[--radix-tabs-indicator-position]'
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
      list: 'border-b',
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
      list: 'border-l',
      indicator: '-left-px w-px'
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'pill',
    class: {
      indicator: `bg-${color}-500 dark:bg-${color}-400`,
      trigger: `data-[state=active]:text-[--ui-bg] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${color}-500 dark:focus-visible:outline-${color}-400`
    }
  })), {
    color: 'gray',
    variant: 'pill',
    class: {
      indicator: 'bg-[--ui-bg-inverted]',
      trigger: 'data-[state=active]:text-[--ui-bg] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--ui-border-inverted]'
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'link',
    class: {
      indicator: `bg-${color}-500 dark:bg-${color}-400`,
      trigger: `data-[state=active]:text-${color}-500 dark:data-[state=active]:text-${color}-400 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}-500 dark:focus-visible:ring-${color}-400`
    }
  })), {
    color: 'gray',
    variant: 'link',
    class: {
      indicator: 'bg-[--ui-bg-inverted]',
      trigger: 'data-[state=active]:text-[--ui-text-highlighted] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[--ui-border-inverted]'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'pill',
    size: 'md'
  }
})
