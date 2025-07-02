import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative overflow-auto',
    base: 'min-w-full overflow-clip',
    caption: 'sr-only',
    thead: 'relative',
    tbody: 'divide-y divide-default [&>tr]:data-[selectable=true]:hover:bg-elevated/50 [&>tr]:data-[selectable=true]:focus-visible:outline-primary',
    tfoot: 'relative',
    tr: 'data-[selected=true]:bg-elevated/50',
    th: 'px-4 py-3.5 text-sm text-highlighted text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pe-0',
    td: 'p-4 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0',
    separator: 'absolute z-[1] left-0 w-full h-px bg-(--ui-border-accented)',
    empty: 'py-6 text-center text-sm text-muted',
    loading: 'py-6 text-center'
  },
  variants: {
    pinned: {
      true: {
        th: 'sticky bg-default/75 data-[pinned=left]:left-0 data-[pinned=right]:right-0',
        td: 'sticky bg-default/75 data-[pinned=left]:left-0 data-[pinned=right]:right-0'
      }
    },
    sticky: {
      true: {
        thead: 'sticky top-0 inset-x-0 bg-default/75 z-[1] backdrop-blur',
        tfoot: 'sticky bottom-0 inset-x-0 bg-default/75 z-[1] backdrop-blur'
      },
      header: {
        thead: 'sticky top-0 inset-x-0 bg-default/75 z-[1] backdrop-blur'
      },
      footer: {
        tfoot: 'sticky bottom-0 inset-x-0 bg-default/75 z-[1] backdrop-blur'
      }
    },
    loading: {
      true: {
        thead: 'after:absolute after:z-[1] after:h-px'
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
      thead: `after:bg-${loadingColor}`
    }
  })), {
    loading: true,
    loadingColor: 'neutral',
    class: {
      thead: 'after:bg-inverted'
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
