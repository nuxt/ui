import select from './select'
import { extendTheme } from '../utils/theme'

export default extendTheme(select, {
  slots: {
    // A field inset like the items: its padding is theirs, so its text lines up with them
    filter: 'mx-1 mt-1 bg-soft ring ring-inset ring-default',
    focusScope: 'flex flex-col min-h-0 focus:outline-none',
    viewport: () => 'relative scroll-py-1 overflow-y-auto flex-1',
    content: (content: string) => [content, 'max-h-[min(15rem,var(--reka-combobox-content-available-height,15rem))] origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)'],
    trailingClear: 'p-0',
    empty: 'p-[calc(var(--ui-control-py)+(--spacing(1)))] text-center text-muted'
  },
  variants: {
    size: {
      xs: { filter: '[--ui-control-px:var(--ui-control-py-xs)]', empty: 'text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height)' },
      sm: { filter: '[--ui-control-px:var(--ui-control-py-sm)]', empty: 'text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height)' },
      md: { filter: '[--ui-control-px:var(--ui-control-py-md)]', empty: 'text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height)' },
      lg: { filter: '[--ui-control-px:var(--ui-control-py-lg)]', empty: 'text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height)' },
      xl: { filter: '[--ui-control-px:var(--ui-control-py-xl)]', empty: 'text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)' }
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
