import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'flex items-center gap-2',
    list: 'relative flex group',
    indicator: 'absolute [[data-slot=tabs-indicator]~&]:hidden transition-[translate,width] duration-200 ease-out motion-reduce:transition-none',
    trigger: 'group relative inline-flex items-center min-w-0 data-[state=checked]:[anchor-name:--tabs-trigger] data-[state=unchecked]:text-muted hover:data-[state=unchecked]:not-disabled:text-default font-medium rounded-md disabled:cursor-not-allowed disabled:opacity-(--ui-disabled-opacity) transition-colors outline-accent-focus focus-visible:outline-(length:--ui-focus-width)',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    label: 'truncate',
    trailingBadge: 'shrink-0',
    content: 'w-full rounded-md focus-visible:outline-(length:--ui-focus-width) outline-accent-focus'
  },
  variants: {
    color: colorVariant({ root: '' }),
    variant: {
      // The track comes out of the block padding of the triggers, so the list is as tall
      // as a Button of the same size
      pill: {
        list: 'bg-soft rounded-lg [--ui-tabs-track-padding:min(--spacing(0.75),var(--ui-control-py))] p-(--ui-tabs-track-padding)',
        trigger: 'grow data-[state=checked]:text-accent',
        indicator: 'bg-default rounded-md shadow-xs'
      },
      link: {
        list: 'border-default',
        indicator: 'bg-accent rounded-full',
        trigger: 'data-[state=checked]:text-accent'
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
    // The label takes the text of the size below, so it fits in the `pill` indicator, and
    // keeps the line height of its size so the height stays a Button's
    size: {
      xs: {
        list: '[--ui-control-px:var(--ui-control-px-xs)] [--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)]',
        trigger: 'px-(--ui-control-px) py-[calc(var(--ui-control-py)-var(--ui-tabs-track-padding,0px))] text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height) gap-(--ui-control-gap)',
        leadingIcon: 'size-(--ui-control-icon-size)'
      },
      sm: {
        list: '[--ui-control-px:var(--ui-control-px-sm)] [--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)]',
        trigger: 'px-(--ui-control-px) py-[calc(var(--ui-control-py)-var(--ui-tabs-track-padding,0px))] text-(length:--ui-control-text-xs)/(--ui-control-text-sm--line-height) gap-(--ui-control-gap)',
        leadingIcon: 'size-(--ui-control-icon-size)'
      },
      md: {
        list: '[--ui-control-px:var(--ui-control-px-md)] [--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)]',
        trigger: 'px-(--ui-control-px) py-[calc(var(--ui-control-py)-var(--ui-tabs-track-padding,0px))] text-(length:--ui-control-text-sm)/(--ui-control-text-md--line-height) gap-(--ui-control-gap)',
        leadingIcon: 'size-(--ui-control-icon-size)'
      },
      lg: {
        list: '[--ui-control-px:var(--ui-control-px-lg)] [--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)]',
        trigger: 'px-(--ui-control-px) py-[calc(var(--ui-control-py)-var(--ui-tabs-track-padding,0px))] text-(length:--ui-control-text-md)/(--ui-control-text-lg--line-height) gap-(--ui-control-gap)',
        leadingIcon: 'size-(--ui-control-icon-size)'
      },
      xl: {
        list: '[--ui-control-px:var(--ui-control-px-xl)] [--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)]',
        trigger: 'px-(--ui-control-px) py-[calc(var(--ui-control-py)-var(--ui-tabs-track-padding,0px))] text-(length:--ui-control-text-lg)/(--ui-control-text-xl--line-height) gap-(--ui-control-gap)',
        leadingIcon: 'size-(--ui-control-icon-size)'
      }
    },
    // Equal padding, for triggers that only show an icon. After `size`, which sets the
    // horizontal padding
    square: {
      true: { trigger: 'px-[calc(var(--ui-control-py)-var(--ui-tabs-track-padding,0px))]' }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    variant: 'pill',
    class: {
      indicator: 'inset-y-(--ui-tabs-track-padding)'
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
      indicator: 'inset-x-(--ui-tabs-track-padding)',
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
