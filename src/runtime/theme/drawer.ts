import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    overlay: 'fixed inset-0 bg-backdrop data-[state=open]:animate-[fade-in_300ms_var(--ease-out)] data-[state=closed]:animate-[fade-out_300ms_var(--ease-out)]',
    /**
     * The stack variables mirror what reka-ui publishes on a drawer that has a nested
     * one open: `--nested-drawers` counts them, `--drawer-swipe-progress` tracks the
     * child being swiped away and `--drawer-frontmost-height` is the height to recede by.
     * The `after` element extends the background past the anchored edge, so dragging
     * the drawer away from it doesn't open a gap.
     */
    content: 'fixed bg-overlay ring ring-default flex focus:outline-none will-change-transform transition-[transform,translate,scale,height] duration-300 ease-out data-swiping:duration-0 [--bleed:3rem] [--peek:1rem] [--stack-step:0.05] [--stack-height:var(--drawer-frontmost-height,var(--drawer-height,0px))] [--stack-progress:clamp(0,var(--drawer-swipe-progress,0),1)] [--stack-peek-offset:max(0px,calc((var(--nested-drawers,0)-var(--stack-progress))*var(--peek)))] [--stack-scale-base:max(0,calc(1-(var(--nested-drawers,0)*var(--stack-step))))] [--stack-scale:clamp(0,calc(var(--stack-scale-base)+(var(--stack-step)*var(--stack-progress))),1)] [--stack-shrink:calc(1-var(--stack-scale))] scale-(--stack-scale) data-nested-drawer-open:overflow-hidden data-nested-drawer-open:brightness-95 after:pointer-events-none after:absolute after:bg-inherit',
    handle: 'shrink-0 bg-strong rounded-full opacity-70 hover:opacity-100 active:opacity-100 transition-opacity ease-out',
    container: 'w-full flex flex-col gap-4 p-4 overflow-y-auto',
    header: 'flex items-center gap-1.5 min-h-8',
    wrapper: 'min-w-0 flex-1',
    title: 'text-strong font-heading font-(--ui-font-weight-heading,--theme(--font-weight-semibold))',
    description: 'mt-1 text-muted text-sm',
    actions: 'flex items-center gap-1.5 shrink-0 ms-auto',
    body: 'flex-1',
    footer: 'flex flex-col gap-1.5',
    close: ''
  },
  variants: {
    direction: {
      top: {
        content: 'inset-x-0 top-0 origin-top rounded-b-lg h-(--drawer-content-height,auto) max-h-[96%] flex-col-reverse translate-y-[calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)+var(--stack-peek-offset)+(var(--stack-shrink)*var(--stack-height)))] data-nested-drawer-open:h-(--stack-height) after:inset-x-0 after:bottom-full after:h-(--bleed) data-[state=open]:animate-[slide-in-from-top_300ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-top_300ms_var(--ease-out)]',
        handle: 'mb-4 w-12 h-1.5 mx-auto'
      },
      right: {
        content: 'inset-y-0 right-0 origin-right rounded-l-lg w-(--drawer-content-width,auto) max-w-[calc(100%-2rem)] flex-row rtl:flex-row-reverse translate-x-[calc(var(--drawer-swipe-movement-x,0px)-var(--stack-peek-offset)-(var(--stack-shrink)*100%))] after:inset-y-0 after:left-full after:w-(--bleed) data-[state=open]:animate-[slide-in-from-right_300ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-right_300ms_var(--ease-out)]',
        handle: 'ml-4 h-12 w-1.5 my-auto'
      },
      bottom: {
        content: 'inset-x-0 bottom-0 origin-bottom rounded-t-lg h-(--drawer-content-height,auto) max-h-[96%] flex-col translate-y-[calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)-var(--stack-peek-offset)-(var(--stack-shrink)*var(--stack-height)))] data-nested-drawer-open:h-(--stack-height) after:inset-x-0 after:top-full after:h-(--bleed) data-[state=open]:animate-[slide-in-from-bottom_300ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-bottom_300ms_var(--ease-out)]',
        handle: 'mt-4 w-12 h-1.5 mx-auto'
      },
      left: {
        content: 'inset-y-0 left-0 origin-left rounded-r-lg w-(--drawer-content-width,auto) max-w-[calc(100%-2rem)] flex-row-reverse rtl:flex-row translate-x-[calc(var(--drawer-swipe-movement-x,0px)+var(--stack-peek-offset)+(var(--stack-shrink)*100%))] after:inset-y-0 after:right-full after:w-(--bleed) data-[state=open]:animate-[slide-in-from-left_300ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-left_300ms_var(--ease-out)]',
        handle: 'mr-4 h-12 w-1.5 my-auto'
      }
    },
    inset: {
      true: {
        /**
         * The margin does the insetting, so every direction keeps the offsets of its
         * anchored edge. A floating drawer has no edge to extend past, so `--bleed` goes
         * to zero, and `--initial-transform` makes the `slide-*` keyframes travel past
         * the gap instead of peeking through it while closed.
         */
        content: 'm-4 rounded-lg overflow-hidden [--bleed:0px] [--initial-transform:calc(100%+1.5rem)]'
      }
    },
    snapPoints: {
      true: {
        content: '[--drawer-content-height:100%] [--drawer-content-width:100%]'
      }
    }
  }
})
