export default {
  slots: {
    root: 'group/sidebar peer text-default hidden lg:block [--sidebar-width:28rem] [--sidebar-width-icon:4rem]',
    gap: 'relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear',
    container: 'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear lg:flex',
    inner: 'flex size-full flex-col overflow-hidden bg-default divide-y divide-default',
    header: 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16',
    wrapper: '',
    title: 'text-highlighted font-semibold',
    description: 'mt-1 text-muted text-sm',
    close: 'absolute top-4 end-4',
    body: 'flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6',
    footer: 'flex items-center gap-1.5 p-4 sm:px-6',
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
        gap: 'data-[state=collapsed]:w-0',
        container: 'data-[state=collapsed]:w-0'
      },
      icon: {
        gap: 'data-[state=collapsed]:w-(--sidebar-width-icon)',
        container: 'data-[state=collapsed]:w-(--sidebar-width-icon)',
        header: 'group-data-[state=collapsed]/sidebar:overflow-hidden group-data-[state=collapsed]/sidebar:p-2',
        body: 'group-data-[state=collapsed]/sidebar:overflow-hidden',
        footer: 'group-data-[state=collapsed]/sidebar:overflow-hidden group-data-[state=collapsed]/sidebar:p-2'
      },
      none: {}
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
  }]
}
