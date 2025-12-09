import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: 'sticky top-(--ui-header-height) z-10 bg-default/75 lg:bg-[initial] backdrop-blur -mx-4 px-4 sm:px-6 sm:-mx-6 overflow-y-auto max-h-[calc(100vh-var(--ui-header-height))]',
    container: 'pt-4 sm:pt-6 pb-2.5 sm:pb-4.5 lg:py-8 border-b border-dashed border-default lg:border-0 flex flex-col',
    top: '',
    bottom: 'hidden lg:flex lg:flex-col gap-6',
    trigger: 'group text-sm font-semibold flex-1 flex items-center gap-1.5 py-1.5 -mt-1.5 focus-visible:outline-primary',
    title: 'truncate',
    trailing: 'ms-auto inline-flex gap-1.5 items-center',
    trailingIcon: 'size-5 transform transition-transform duration-200 shrink-0 group-data-[state=open]:rotate-180 lg:hidden',
    content: 'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden focus:outline-none',
    list: 'min-w-0',
    listWithChildren: 'ms-3',
    item: 'min-w-0',
    itemWithChildren: '',
    link: 'group relative text-sm flex items-center focus-visible:outline-primary py-1',
    linkText: 'truncate',
    indicator: 'absolute ms-2.5 transition-[translate,height] duration-200 h-(--indicator-size) translate-y-(--indicator-position) w-px rounded-full'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    highlightColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: `bg-${color}`
      }])),
      neutral: {
        indicator: 'bg-inverted'
      }
    },
    active: {
      false: {
        link: ['text-muted hover:text-default', options.theme.transitions && 'transition-colors']
      }
    },
    highlight: {
      true: {
        list: 'ms-2.5 ps-4 border-s border-default',
        item: '-ms-px'
      }
    },
    body: {
      true: {
        bottom: 'mt-6'
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    active: true,
    class: {
      link: `text-${color}`,
      linkLeadingIcon: `text-${color}`
    }
  })), {
    color: 'neutral',
    active: true,
    class: {
      link: 'text-highlighted',
      linkLeadingIcon: 'text-highlighted'
    }
  }],
  defaultVariants: {
    color: 'primary',
    highlightColor: 'primary'
  }
})
