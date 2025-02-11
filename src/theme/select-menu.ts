import { defu } from 'defu'
import type { ModuleOptions } from '../module'
import select from './select'

export default (options: Required<ModuleOptions>) => {
  return defu({
    slots: {
      input: 'border-b border-(--ui-border)',
      focusScope: 'flex flex-col min-h-0'
    }
  }, select(options))
}
