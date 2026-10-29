import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'flex items-center gap-2',
    list: 'relative flex p-1 group',
    indicator: 'absolute [[data-slot=tabs-indicator]~&]:hidden transition-[translate,width] duration-200 ease-out motion-reduce:transition-none',
    trigger: 'group relative inline-flex items-center min-w-0 data-[state=active]:[anchor-name:--tabs-trigger] data-[state=inactive]:text-muted hover:data-[state=inactive]:not-disabled:text-default font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-(--ui-disabled-opacity) transition-colors outline-accent-focus focus-visible:outline-(length:--ui-focus-width)',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    label: 'truncate',
    trailingBadge: 'shrink-0',
    content: 'w-full rounded-md focus-visible:outline-(length:--ui-focus-width) outline-accent-focus'
  },
  variants: {
    color: colorVariant({ root: '' }),
    variant: {
      pill: {
        list: 'bg-soft rounded-lg',
        trigger: 'grow data-[state=active]:text-accent',
        indicator: 'bg-default rounded-md shadow-xs'
      },
      link: {
        list: 'border-default',
        indicator: 'bg-accent rounded-full',
        trigger: 'data-[state=active]:text-accent'
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
        leadingIcon: 'size-4'
      },
      sm: {
        trigger: 'px-2.5 py-1.5 text-xs gap-1.5',
        leadingIcon: 'size-4'
      },
      md: {
        trigger: 'px-3 py-1.5 text-sm gap-1.5',
        leadingIcon: 'size-5'
      },
      lg: {
        trigger: 'px-3 py-2 text-sm gap-2',
        leadingIcon: 'size-5'
      },
      xl: {
        trigger: 'px-3 py-2 text-base gap-2',
        leadingIcon: 'size-6'
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
      list: 'items-center',
      trigger: 'w-full justify-center'
    }
  }, {
    orientation: 'vertical',
    variant: 'link',
    class: {
      list: 'border-s -ms-px',
      indicator: '-inset-s-px w-px'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'pill',
    size: 'md'
  }
})
