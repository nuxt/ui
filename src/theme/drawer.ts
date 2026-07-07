import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    overlay: ['fixed inset-0 bg-elevated/75', options.theme.transitions && 'data-[state=open]:animate-[fade-in_200ms_var(--ease-out)] data-[state=closed]:animate-[fade-out_200ms_var(--ease-out)]'],
    content: ['fixed bg-default ring ring-default flex focus:outline-none', options.theme.transitions && 'will-change-transform transition-transform ease-out data-[swiping]:duration-0'],
    handle: ['shrink-0 !bg-accented', options.theme.transitions && 'transition-opacity ease-out'],
    container: 'w-full flex flex-col gap-4 p-4 overflow-y-auto',
    header: 'flex items-center gap-1.5 min-h-8',
    wrapper: 'min-w-0 flex-1',
    title: 'text-highlighted font-semibold',
    description: 'mt-1 text-muted text-sm',
    actions: 'flex items-center gap-1.5 shrink-0 ms-auto',
    body: 'flex-1',
    footer: 'flex flex-col gap-1.5',
    close: ''
  },
  variants: {
    direction: {
      top: {
        content: ['mb-24 flex-col-reverse translate-y-[calc(var(--drawer-swipe-movement-y,0px)+var(--drawer-snap-point-offset,0px))]', options.theme.transitions && 'data-[state=open]:animate-[slide-in-from-top_200ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-top_200ms_var(--ease-out)]'],
        handle: 'mb-4'
      },
      right: {
        content: ['flex-row rtl:flex-row-reverse translate-x-[calc(var(--drawer-swipe-movement-x,0px)+var(--drawer-snap-point-offset,0px))]', options.theme.transitions && 'data-[state=open]:animate-[slide-in-from-right_200ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-right_200ms_var(--ease-out)]'],
        handle: '!ml-4'
      },
      bottom: {
        content: ['mt-24 flex-col translate-y-[calc(var(--drawer-swipe-movement-y,0px)+var(--drawer-snap-point-offset,0px))]', options.theme.transitions && 'data-[state=open]:animate-[slide-in-from-bottom_200ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-bottom_200ms_var(--ease-out)]'],
        handle: 'mt-4'
      },
      left: {
        content: ['flex-row-reverse rtl:flex-row translate-x-[calc(var(--drawer-swipe-movement-x,0px)+var(--drawer-snap-point-offset,0px))]', options.theme.transitions && 'data-[state=open]:animate-[slide-in-from-left_200ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-left_200ms_var(--ease-out)]'],
        handle: '!mr-4'
      }
    },
    inset: {
      true: {
        content: 'rounded-lg after:hidden overflow-hidden [--initial-transform:calc(100%+1.5rem)]'
      }
    },
    snapPoints: {
      true: ''
    }
  },
  compoundVariants: [{
    direction: ['top', 'bottom'],
    class: {
      content: 'h-auto max-h-[96%]',
      handle: '!w-12 !h-1.5 mx-auto'
    }
  }, {
    direction: ['top', 'bottom'],
    snapPoints: true,
    class: {
      content: 'h-full'
    }
  }, {
    direction: ['right', 'left'],
    class: {
      content: 'w-auto max-w-[calc(100%-2rem)]',
      handle: '!h-12 !w-1.5 mt-auto mb-auto'
    }
  }, {
    direction: ['right', 'left'],
    snapPoints: true,
    class: {
      content: 'w-full'
    }
  },
  {
    direction: 'top',
    inset: true,
    class: {
      content: 'inset-x-4 top-4'
    }
  }, {
    direction: 'top',
    inset: false,
    class: {
      content: 'inset-x-0 top-0 rounded-b-lg'
    }
  }, {
    direction: 'bottom',
    inset: true,
    class: {
      content: 'inset-x-4 bottom-4'
    }
  }, {
    direction: 'bottom',
    inset: false,
    class: {
      content: 'inset-x-0 bottom-0 rounded-t-lg'
    }
  }, {
    direction: 'left',
    inset: true,
    class: {
      content: 'inset-y-4 left-4'
    }
  }, {
    direction: 'left',
    inset: false,
    class: {
      content: 'inset-y-0 left-0 rounded-r-lg'
    }
  }, {
    direction: 'right',
    inset: true,
    class: {
      content: 'inset-y-4 right-4'
    }
  }, {
    direction: 'right',
    inset: false,
    class: {
      content: 'inset-y-0 right-0 rounded-l-lg'
    }
  }]
})
