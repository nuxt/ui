import { defu } from 'defu'
import type { ModuleOptions } from '../module'
import select from './select'

export default (options: Required<ModuleOptions>) => {
  const selectTheme = select(options)
  return defu({
    slots: {
      input: 'border-b border-(--ui-border)',
      focusScope: 'flex flex-col min-h-0',
      content: `${selectTheme.slots.content} origin-(--reka-combobox-content-transform-origin)`
    }
  }, selectTheme)
}
