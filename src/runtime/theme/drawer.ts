import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    overlay: 'fixed inset-0 bg-backdrop data-[state=open]:animate-[fade-in_300ms_var(--ease-out)] data-[state=closed]:animate-[fade-out_300ms_var(--ease-out)]',
    /**
     * The component sets `--drawer-stack` to the number of drawers open above this one
     * and `--drawer-frontmost-*` to the size of the frontmost of them, so every level
     * peeks the same: a top or bottom drawer collapses to its height, a side drawer
     * keeps its width so its content doesn't reflow and shifts by the difference. reka-ui sets
     * `--drawer-swipe-progress` to how far the frontmost is swiped away, so `--stack` is
     * the depth this drawer recedes by. The `after` element extends the background past
     * the anchored edge, so dragging the drawer away from it doesn't open a gap.
     */
    content: 'group/drawer fixed bg-overlay ring ring-default flex focus:outline-none [interpolate-size:allow-keywords] transition-[translate,scale,height,width,filter] duration-300 ease-out data-swiping:duration-0 [--bleed:3rem] [--stack:max(0,calc(var(--drawer-stack,0)-var(--drawer-swipe-progress,0)))] scale-[calc(1-var(--stack)*0.05)] data-stacked:brightness-95 data-stacked:overflow-hidden after:pointer-events-none after:absolute after:bg-inherit',
    handle: 'shrink-0 bg-strong rounded-full opacity-70 hover:opacity-100 active:opacity-100 transition-opacity ease-out',
    /**
     * Content fades out quickly when a drawer opens above, and back in only once the
     * drawer has grown back to its own size, so nothing slides while it's visible.
     */
    container: 'w-full flex flex-col gap-4 p-4 overflow-y-auto transition-opacity duration-300 ease-out delay-200 group-data-stacked/drawer:opacity-0 group-data-stacked/drawer:delay-0 group-data-stacked/drawer:duration-100',
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
        content: 'inset-x-0 top-0 origin-bottom rounded-b-lg h-(--drawer-content-height,auto) data-stacked:h-(--drawer-frontmost-height) max-h-[96%] flex-col-reverse translate-y-[calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)+var(--stack)*1rem)] after:inset-x-0 after:bottom-full after:h-(--bleed) data-[state=open]:animate-[slide-in-from-top_300ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-top_300ms_var(--ease-out)]',
        handle: 'mb-4 w-12 h-1.5 mx-auto'
      },
      right: {
        content: 'inset-y-0 right-0 origin-left rounded-l-lg w-(--drawer-content-width,auto) max-w-[calc(100%-2rem)] flex-row rtl:flex-row-reverse [--stack-shift:calc(var(--drawer-own-width,0px)-var(--drawer-frontmost-width,0px))] translate-x-[calc(var(--drawer-swipe-movement-x,0px)-var(--stack)*1rem+var(--stack-shift))] data-stacked:[clip-path:inset(-1rem_max(0px,var(--stack-shift))_-1rem_-1rem)] after:inset-y-0 after:left-full after:w-(--bleed) data-[state=open]:animate-[slide-in-from-right_300ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-right_300ms_var(--ease-out)]',
        handle: 'ml-4 h-12 w-1.5 my-auto'
      },
      bottom: {
        content: 'inset-x-0 bottom-0 origin-top rounded-t-lg h-(--drawer-content-height,auto) data-stacked:h-(--drawer-frontmost-height) max-h-[96%] flex-col translate-y-[calc(var(--drawer-snap-point-offset,0px)+var(--drawer-swipe-movement-y,0px)-var(--stack)*1rem)] after:inset-x-0 after:top-full after:h-(--bleed) data-[state=open]:animate-[slide-in-from-bottom_300ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-bottom_300ms_var(--ease-out)]',
        handle: 'mt-4 w-12 h-1.5 mx-auto'
      },
      left: {
        content: 'inset-y-0 left-0 origin-right rounded-r-lg w-(--drawer-content-width,auto) max-w-[calc(100%-2rem)] flex-row-reverse rtl:flex-row [--stack-shift:calc(var(--drawer-own-width,0px)-var(--drawer-frontmost-width,0px))] translate-x-[calc(var(--drawer-swipe-movement-x,0px)+var(--stack)*1rem-var(--stack-shift))] data-stacked:[clip-path:inset(-1rem_-1rem_-1rem_max(0px,var(--stack-shift)))] after:inset-y-0 after:right-full after:w-(--bleed) data-[state=open]:animate-[slide-in-from-left_300ms_var(--ease-out)] data-[state=closed]:animate-[slide-out-to-left_300ms_var(--ease-out)]',
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
        content: 'm-4 max-h-[calc(100%-2rem)] rounded-lg overflow-hidden [--bleed:0px] [--initial-transform:calc(100%+1.5rem)]'
      }
    },
    snapPoints: {
      true: {
        content: '[--drawer-content-height:100%] [--drawer-content-width:100%]'
      }
    }
  }
})
