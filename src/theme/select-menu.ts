import { defuFn } from 'defu'
import type { ModuleOptions } from '../module'
import select from './select'

export default (options: Required<ModuleOptions>) => {
  return defuFn({
    slots: {
      input: 'border-b border-default',
      focusScope: 'flex flex-col min-h-0',
      content: (content: string) => [content, 'origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)']
    }
  }, select(options))
}
