export default {
  slots: {
    root: 'overflow-hidden',
    viewport: 'relative flex',
    item: '',
    scrollbar: 'flex touch-none select-none p-0.5 data-[orientation=vertical]:w-2.5 data-[orientation=horizontal]:h-2.5 data-[orientation=vertical]:flex-col transition-opacity duration-160 ease-out data-[state=visible]:opacity-100 data-[state=hidden]:opacity-0',
    thumb: 'relative rounded-full bg-[var(--ui-bg-accented)]',
    corner: ''
  },
  variants: {
    orientation: {
      vertical: {
        root: '',
        viewport: 'flex-col',
        item: ''
      },
      horizontal: {
        root: '',
        viewport: 'flex-row',
        item: ''
      }
    }
  }
}
