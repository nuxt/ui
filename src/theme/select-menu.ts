import { defu } from 'defu'
import select from './select'

export default (config: { colors: string[] }) => {
  return defu({
    slots: {
      value: 'truncate',
      placeholder: 'truncate text-current/50',
      input: 'text-sm px-2.5 py-1.5 placeholder-gray-400 dark:placeholder-gray-500 border-0 border-b border-gray-200 dark:border-gray-800 focus:outline-none'
    }
  }, select(config))
}
