import input from './input'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    leading: 'absolute inset-s-0 inset-y-(--ui-control-py) ps-(--ui-control-px) flex items-start',
    trailing: 'absolute inset-e-0 inset-y-(--ui-control-py) pe-(--ui-control-px) flex items-start'
  },
  variants: {
    autoresize: {
      true: {
        base: 'resize-none'
      }
    }
  }
})
