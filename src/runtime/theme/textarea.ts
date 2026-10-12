import input from './input'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    root: 'relative inline-flex items-start',
    leading: 'order-first flex items-start',
    trailing: 'flex items-start'
  },
  variants: {
    autoresize: {
      true: {
        input: 'resize-none'
      }
    },
    // The leading and the trailing line up with the first line of text
    size: {
      xs: {
        leading: (prev: string) => [prev, 'pt-(--ui-control-py)'],
        trailing: (prev: string) => [prev, 'pt-(--ui-control-py)']
      },
      sm: {
        leading: (prev: string) => [prev, 'pt-(--ui-control-py)'],
        trailing: (prev: string) => [prev, 'pt-(--ui-control-py)']
      },
      md: {
        leading: (prev: string) => [prev, 'pt-(--ui-control-py)'],
        trailing: (prev: string) => [prev, 'pt-(--ui-control-py)']
      },
      lg: {
        leading: (prev: string) => [prev, 'pt-(--ui-control-py)'],
        trailing: (prev: string) => [prev, 'pt-(--ui-control-py)']
      },
      xl: {
        leading: (prev: string) => [prev, 'pt-(--ui-control-py)'],
        trailing: (prev: string) => [prev, 'pt-(--ui-control-py)']
      }
    }
  }
})
