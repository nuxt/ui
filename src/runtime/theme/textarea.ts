import input from './input'
import { extendTheme, omitVariants } from '../utils/theme'

// A Textarea has no `type` and takes no part in a FieldGroup
export default extendTheme(omitVariants(input, 'type', 'fieldGroup'), {
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
