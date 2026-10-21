import input from './input'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    // The resize handle stops at one line of text
    base: (prev: string) => [prev, 'min-h-[calc(1lh+2*var(--ui-control-py))]'],
    // The leading and the trailing are as tall as a one-line input and center on
    // its first line, so a button lines up the same way it does in an input
    root: (prev: string) => [prev, 'items-start'],
    leading: (prev: string) => [prev, 'h-[calc(1lh+2*var(--ui-control-py))]'],
    trailing: (prev: string) => [prev, 'h-[calc(1lh+2*var(--ui-control-py))]']
  },
  variants: {
    autoresize: {
      true: {
        base: 'resize-none'
      }
    }
  }
})
