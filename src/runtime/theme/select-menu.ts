import select from './select'
import { extendTheme } from '../utils/theme'

export default extendTheme(select, {
  slots: {
    filter: 'rounded-none border-b border-default',
    focusScope: 'flex flex-col min-h-0 focus:outline-none',
    viewport: () => 'relative scroll-py-1 overflow-y-auto flex-1',
    content: (content: string) => [content, 'max-h-[min(15rem,var(--reka-combobox-content-available-height,15rem))] origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)'],
    trailingClear: 'p-0',
    empty: 'text-center text-muted'
  },
  variants: {
    size: {
      xs: { empty: 'p-2 text-xs' },
      sm: { empty: 'p-2.5 text-xs' },
      md: { empty: 'p-2.5 text-sm' },
      lg: { empty: 'p-3 text-sm' },
      xl: { empty: 'p-3 text-base' }
    },
    virtualize: {
      true: {
        viewport: 'p-1 isolate'
      },
      false: {
        viewport: 'divide-y divide-default'
      }
    }
  }
})
