import input from './input'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    // The leading and the trailing line up with the first line of text
    root: (prev: string) => [prev, 'items-start'],
    leading: (prev: string) => [prev, 'items-start pt-(--ui-control-py)'],
    trailing: (prev: string) => [prev, 'items-start pt-(--ui-control-py)']
  },
  variants: {
    autoresize: {
      true: {
        base: 'resize-none'
      }
    }
  }
})
