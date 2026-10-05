import input from './input'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    leading: 'absolute start-0 inset-y-(--ui-control-py) flex items-start ps-(--ui-control-px)',
    trailing: 'absolute end-0 inset-y-(--ui-control-py) flex items-start pe-(--ui-control-px)'
  },
  variants: {
    autoresize: {
      true: {
        base: 'resize-none'
      }
    }
  }
})
