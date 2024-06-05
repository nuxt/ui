import type { ModuleOptions } from '../module'
import input from './input'

export default (options: Required<ModuleOptions>) => {
  return input(options)
}
