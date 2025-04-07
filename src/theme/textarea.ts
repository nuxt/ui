import { defu } from 'defu'
import type { ModuleOptions } from '../module'
import input from './input'

export default (options: Required<ModuleOptions>) => {
  return defu({
    variants: {
      autoresize: {
        true: {
          base: 'resize-none'
        }
      }
    }
  }, input(options))
}
