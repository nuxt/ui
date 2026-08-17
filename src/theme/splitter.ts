export default {
  slots: {
    root: 'flex w-full',
    panel: 'flex overflow-hidden',
    handle: 'group relative shrink-0 bg-border transition-colors data-[state=hover]:bg-accented data-[state=drag]:bg-primary focus-visible:outline-2 focus-visible:outline-primary data-[panel-resize-handle-enabled=false]:cursor-default'
  },
  variants: {
    orientation: {
      horizontal: {
        handle: 'w-px cursor-col-resize'
      },
      vertical: {
        root: 'flex-col',
        handle: 'h-px cursor-row-resize'
      }
    }
  }
}
