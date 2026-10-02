import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: '',
    panel: 'flex',
    handle: 'group relative shrink-0 outline-focus focus-visible:outline-3 data-[panel-resize-handle-enabled=false]:cursor-default'
  },
  variants: {
    orientation: {
      horizontal: {
        handle: 'w-2 cursor-col-resize'
      },
      vertical: {
        handle: 'h-2 cursor-row-resize'
      }
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
})
