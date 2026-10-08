import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'
// Active-tab highlight shown before reka-ui's `TabsIndicator` mounts (SSR / pre-hydration).
// reka-ui only renders the real indicator on the client (it needs DOM measurements), so the
// `in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:` classes
// gate a CSS-only pseudo-element fallback on the active trigger by the *absence* of the indicator
// element — the instant reka's measured indicator appears, this selector stops matching.

export default defineTheme({
  slots: {
    root: 'flex items-center gap-2',
    list: 'relative flex p-1 group',
    indicator: 'absolute bg-accent transition-[translate,width] duration-200 ease-out motion-reduce:transition-none',
    trigger: 'group relative inline-flex items-center min-w-0 data-[state=inactive]:text-muted hover:data-[state=inactive]:not-disabled:text-default font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-75 transition-colors outline-accent-focus focus-visible:outline-3 px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap)',
    leadingIcon: 'shrink-0 size-(--ui-control-icon)',
    leadingAvatar: 'shrink-0',
    label: 'truncate',
    trailingBadge: 'shrink-0',
    content: 'w-full rounded-md focus-visible:outline-3 outline-accent-focus'
  },
  variants: {
    color: colorVariant({ root: '' }),
    variant: {
      pill: {
        list: 'bg-soft rounded-lg',
        trigger: [`grow`, `in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:before:content-[''] in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:before:absolute in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:before:inset-0 in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:before:rounded-md in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:before:shadow-xs in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:before:-z-10 in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:isolate`, 'data-[state=active]:text-accent-contrast', 'in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:before:bg-accent'],
        indicator: 'rounded-md shadow-xs'
      },
      link: {
        list: 'border-default',
        indicator: 'rounded-full',
        trigger: [`in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:after:content-[''] in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:after:absolute in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:after:rounded-full`, 'data-[state=active]:text-accent', 'in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:after:bg-accent']
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
        trigger: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(1)] [--ui-control-icon:--spacing(4)] text-xs'
      },
      sm: {
        trigger: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(4)] text-xs'
      },
      md: {
        trigger: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(1.5)] [--ui-control-icon:--spacing(5)] text-sm'
      },
      lg: {
        trigger: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(5)] text-sm'
      },
      xl: {
        trigger: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(2)] [--ui-control-icon:--spacing(6)] text-base'
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
      indicator: '-bottom-px h-px',
      trigger: 'in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:after:inset-x-0 in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:after:-bottom-[calc(var(--spacing)+1px)] in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:after:h-px'
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
      indicator: '-inset-s-px w-px',
      trigger: 'in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:after:inset-y-0 in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:after:-inset-s-[calc(var(--spacing)+1px)] in-[[data-slot=tabs-list]:not(:has([data-slot=tabs-indicator]))]:data-[state=active]:after:w-px'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'pill',
    size: 'md'
  }
})
