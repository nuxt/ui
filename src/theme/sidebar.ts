import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'peer [--sidebar-width:16rem] [--sidebar-width-icon:4rem]',
    gap: 'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
    container: 'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear lg:flex',
    inner: 'flex size-full flex-col overflow-hidden bg-default divide-y divide-default',
    header: 'flex items-center gap-1.5 overflow-hidden px-4 min-h-16',
    wrapper: 'min-w-0 flex-1',
    title: 'text-highlighted font-semibold truncate',
    description: 'text-muted text-sm truncate',
    actions: 'flex items-center gap-1.5 shrink-0',
    close: '',
    body: 'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4',
    footer: 'flex items-center gap-1.5 overflow-hidden p-4',
    rail: ['absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-px lg:flex hover:after:bg-(--ui-border-accented)', options.theme.transitions && 'after:transition-colors'],
    overlay: 'lg:hidden'
  },
  variants: {
    side: {
      left: {
        container: 'left-0 border-e border-default'
      },
      right: {
        container: 'right-0 border-s border-default'
      }
    },
    collapsible: {
      offcanvas: {
        root: 'group/sidebar hidden lg:block',
        gap: 'data-[state=collapsed]:w-0'
      },
      icon: {
        root: 'group/sidebar hidden lg:block',
        gap: 'data-[state=collapsed]:w-(--sidebar-width-icon)',
        container: 'data-[state=collapsed]:w-(--sidebar-width-icon)',
        body: 'group-data-[state=collapsed]/sidebar:overflow-hidden'
      },
      none: {
        root: 'h-full w-(--sidebar-width)'
      }
    },
    variant: {
      sidebar: {},
      floating: {
        container: 'p-2 border-0',
        inner: 'rounded-lg border border-default shadow-sm'
      },
      inset: {
        container: 'p-2 border-0',
        inner: 'rounded-lg'
      }
    }
  },
  compoundVariants: [{
    side: 'left' as const,
    collapsible: 'offcanvas' as const,
    class: {
      rail: 'end-0 translate-x-1/2 data-[state=collapsed]:cursor-e-resize cursor-w-resize'
    }
  }, {
    side: 'right' as const,
    collapsible: 'offcanvas' as const,
    class: {
      rail: '-start-px -translate-x-1/2 data-[state=collapsed]:cursor-w-resize cursor-e-resize'
    }
  }, {
    side: 'left' as const,
    collapsible: 'icon' as const,
    class: {
      rail: 'end-0 translate-x-1/2 data-[state=collapsed]:cursor-e-resize cursor-w-resize'
    }
  }, {
    side: 'right' as const,
    collapsible: 'icon' as const,
    class: {
      rail: '-start-px -translate-x-1/2 data-[state=collapsed]:cursor-w-resize cursor-e-resize'
    }
  }, {
    side: 'left' as const,
    collapsible: 'none' as const,
    class: {
      root: 'border-e border-default'
    }
  }, {
    side: 'right' as const,
    collapsible: 'none' as const,
    class: {
      root: 'border-s border-default'
    }
  }, {
    side: 'left' as const,
    collapsible: 'offcanvas' as const,
    class: {
      container: 'data-[state=collapsed]:-left-(--sidebar-width)'
    }
  }, {
    side: 'right' as const,
    collapsible: 'offcanvas' as const,
    class: {
      container: 'data-[state=collapsed]:-right-(--sidebar-width)'
    }
  }, {
    variant: 'floating' as const,
    collapsible: 'icon' as const,
    class: {
      gap: 'data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)+theme(spacing.4))]',
      container: 'data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)+theme(spacing.4)+2px)]'
    }
  }, {
    variant: 'inset' as const,
    collapsible: 'icon' as const,
    class: {
      gap: 'data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)+theme(spacing.4))]',
      container: 'data-[state=collapsed]:w-[calc(var(--sidebar-width-icon)+theme(spacing.4)+2px)]'
    }
  }, {
    variant: 'floating' as const,
    collapsible: 'none' as const,
    class: {
      root: 'p-2 border-0'
    }
  }, {
    variant: 'inset' as const,
    collapsible: 'none' as const,
    class: {
      root: 'p-2 border-0'
    }
  }]
})
