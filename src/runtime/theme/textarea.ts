import input from './input'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    leading: 'absolute inset-s-0 flex items-start',
    trailing: 'absolute inset-e-0 flex items-start'
  },
  variants: {
    autoresize: {
      true: {
        base: 'resize-none'
      }
    },
    size: {
      xs: {
        leading: (prev: string) => [prev, 'inset-y-(--ui-control-py)'],
        trailing: (prev: string) => [prev, 'inset-y-(--ui-control-py)']
      },
      sm: {
        leading: (prev: string) => [prev, 'inset-y-(--ui-control-py)'],
        trailing: (prev: string) => [prev, 'inset-y-(--ui-control-py)']
      },
      md: {
        leading: (prev: string) => [prev, 'inset-y-(--ui-control-py)'],
        trailing: (prev: string) => [prev, 'inset-y-(--ui-control-py)']
      },
      lg: {
        leading: (prev: string) => [prev, 'inset-y-(--ui-control-py)'],
        trailing: (prev: string) => [prev, 'inset-y-(--ui-control-py)']
      },
      xl: {
        leading: (prev: string) => [prev, 'inset-y-(--ui-control-py)'],
        trailing: (prev: string) => [prev, 'inset-y-(--ui-control-py)']
      }
    }
  }
})
