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
      xs: { empty: 'p-[calc(var(--ui-control-py)+var(--spacing))] text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height)' },
      sm: { empty: 'p-[calc(var(--ui-control-py)+var(--spacing))] text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height)' },
      md: { empty: 'p-[calc(var(--ui-control-py)+var(--spacing))] text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height)' },
      lg: { empty: 'p-[calc(var(--ui-control-py)+var(--spacing))] text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height)' },
      xl: { empty: 'p-[calc(var(--ui-control-py)+var(--spacing))] text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)' }
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
