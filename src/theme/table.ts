import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative overflow-auto',
    base: 'min-w-full overflow-clip',
    caption: 'sr-only',
    thead: 'relative [&>tr]:after:absolute [&>tr]:after:inset-x-0 [&>tr]:after:bottom-0 [&>tr]:after:h-px [&>tr]:after:bg-(--ui-border-accented)',
    tbody: 'divide-y divide-(--ui-border) [&>tr]:data-[selectable=true]:hover:bg-(--ui-bg-elevated)/50 [&>tr]:data-[selectable=true]:focus-visible:outline-(--ui-primary)',
    tr: 'data-[selected=true]:bg-(--ui-bg-elevated)/50',
    th: 'px-4 py-3.5 text-sm text-(--ui-text-highlighted) text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pe-0',
    td: 'p-4 text-sm text-(--ui-text-muted) whitespace-nowrap [&:has([role=checkbox])]:pe-0',
    empty: 'py-6 text-center text-sm text-(--ui-text-muted)'
  },
  variants: {
    pinned: {
      true: {
        th: 'sticky bg-(--ui-bg)/75 data-[pinned=left]:left-0 data-[pinned=right]:right-0',
        td: 'sticky bg-(--ui-bg)/75 data-[pinned=left]:left-0 data-[pinned=right]:right-0'
      }
    },
    sticky: {
      true: {
        thead: 'sticky top-0 inset-x-0 bg-(--ui-bg)/75 z-[1] backdrop-blur'
      }
    },
    loading: {
      true: {
        thead: 'after:absolute after:bottom-0 after:inset-x-0 after:h-px'
      }
    },
    loadingAnimation: {
      'carousel': '',
      'carousel-inverse': '',
      'swing': '',
      'elastic': ''
    },
    loadingColor: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((loadingColor: string) => ({
    loading: true,
    loadingColor,
    class: {
      thead: `after:bg-(--ui-${loadingColor})`
    }
  })), {
    loading: true,
    loadingColor: 'neutral',
    class: {
      thead: 'after:bg-(--ui-bg-inverted)'
    }
  }, {
    loading: true,
    loadingAnimation: 'carousel',
    class: {
      thead: 'after:animate-[carousel_2s_ease-in-out_infinite] rtl:after:animate-[carousel-rtl_2s_ease-in-out_infinite]'
    }
  }, {
    loading: true,
    loadingAnimation: 'carousel-inverse',
    class: {
      thead: 'after:animate-[carousel-inverse_2s_ease-in-out_infinite] rtl:after:animate-[carousel-inverse-rtl_2s_ease-in-out_infinite]'
    }
  }, {
    loading: true,
    loadingAnimation: 'swing',
    class: {
      thead: 'after:animate-[swing_2s_ease-in-out_infinite]'
    }
  }, {
    loading: true,
    loadingAnimation: 'elastic',
    class: {
      thead: 'after:animate-[elastic_2s_ease-in-out_infinite]'
    }
  }],
  defaultVariants: {
    loadingColor: 'primary',
    loadingAnimation: 'carousel'
  }
})
