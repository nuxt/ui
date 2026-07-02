export default {
  slots: {
    root: 'flex w-full data-[orientation=vertical]:flex-col',
    panel: 'flex overflow-hidden',
    handle: 'group relative shrink-0 bg-border transition-colors data-[state=hover]:bg-accented data-[state=drag]:bg-primary focus-visible:outline-2 focus-visible:outline-primary data-[orientation=horizontal]:w-px data-[orientation=horizontal]:cursor-col-resize data-[orientation=vertical]:h-px data-[orientation=vertical]:cursor-row-resize before:absolute before:z-[1] data-[orientation=horizontal]:before:inset-y-0 data-[orientation=horizontal]:before:-inset-x-1 data-[orientation=vertical]:before:inset-x-0 data-[orientation=vertical]:before:-inset-y-1'
  }
}
