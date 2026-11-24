import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    overlay: 'fixed inset-0',
    content: 'bg-overlay divide-y divide-default flex flex-col focus:outline-none',
    // With a description, the title line sits where it would alone, so the close stays on it
    header: 'group/header flex items-center gap-1.5 px-(--ui-gutter) py-4 min-h-(--ui-header-height) has-[>[data-slot$=-wrapper]>[data-slot$=-description]]:py-[calc((var(--ui-header-height)-1lh-1px)/2)]',
    wrapper: 'min-w-0 flex-1',
    body: 'flex-1 p-(--ui-gutter)',
    footer: 'flex items-center gap-1.5 px-(--ui-gutter) py-4',
    title: 'text-strong font-heading font-(--ui-font-weight-heading,--theme(--font-weight-semibold))',
    description: 'mt-1 text-muted text-sm',
    actions: 'flex items-center gap-1.5 shrink-0 ms-auto min-h-lh group-has-[>[data-slot$=-wrapper]>[data-slot$=-description]]/header:self-start',
    close: '-my-(--ui-control-py) -me-(--ui-control-py)'
  },
  variants: {
    transition: {
      true: {
        overlay: 'data-[state=open]:animate-[fade-in_200ms_var(--ease-out)] data-[state=closed]:animate-[fade-out_200ms_var(--ease-out)]',
        content: 'data-[state=open]:animate-[scale-in_200ms_var(--ease-out)] data-[state=closed]:animate-[scale-out_200ms_var(--ease-out)]'
      }
    },
    fullscreen: {
      true: {
        content: 'inset-0'
      },
      false: {
        content: 'w-[calc(100vw-2rem)] max-w-lg rounded-lg shadow-lg ring ring-default'
      }
    },
    overlay: {
      true: {
        overlay: 'bg-backdrop'
      }
    },
    scrollable: {
      true: {
        overlay: 'overflow-y-auto',
        content: 'relative'
      },
      false: {
        content: 'fixed',
        body: 'overflow-y-auto'
      }
    }
  },
  compoundVariants: [{
    scrollable: true,
    fullscreen: false,
    class: {
      overlay: 'grid place-items-center p-4 sm:py-8'
    }
  }, {
    scrollable: false,
    fullscreen: false,
    class: {
      content: 'top-1/2 left-1/2 -translate-1/2 max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)] overflow-hidden'
    }
  }]
})
