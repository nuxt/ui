import select from './select'
import { extendTheme } from '../utils/theme'

export default extendTheme(select, {
  slots: {
    // A field as large as the highlight of an item, 1px inside the item: its padding
    // is theirs less that 1px, so its icon and text line up with them
    // It holds the focus as long as the menu is open, so it shows no focus outline
    filter: 'mx-[calc(--spacing(1)+1px)] mt-[calc(--spacing(1)+1px)] has-[>:focus-visible]:outline-0',
    focusScope: 'flex flex-col min-h-0 focus:outline-none',
    viewport: () => 'relative scroll-py-1 overflow-y-auto flex-1',
    content: (content: string) => [content, 'max-h-[min(15rem,var(--reka-combobox-content-available-height,15rem))] origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)'],
    trailingClear: 'p-0',
    empty: 'p-[calc(var(--ui-control-py)+(--spacing(1)))] text-center text-muted'
  },
  variants: {
    size: {
      xs: { filter: '[--ui-control-px:calc(var(--ui-control-py-xs)-1px)] [--ui-control-py:calc(var(--ui-control-py-xs)-1px-var(--ui-control-text-step,0px)/2)]', empty: 'text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height)' },
      sm: { filter: '[--ui-control-px:calc(var(--ui-control-py-sm)-1px)] [--ui-control-py:calc(var(--ui-control-py-sm)-1px-var(--ui-control-text-step,0px)/2)]', empty: 'text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height)' },
      md: { filter: '[--ui-control-px:calc(var(--ui-control-py-md)-1px)] [--ui-control-py:calc(var(--ui-control-py-md)-1px-var(--ui-control-text-step,0px)/2)]', empty: 'text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height)' },
      lg: { filter: '[--ui-control-px:calc(var(--ui-control-py-lg)-1px)] [--ui-control-py:calc(var(--ui-control-py-lg)-1px-var(--ui-control-text-step,0px)/2)]', empty: 'text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height)' },
      xl: { filter: '[--ui-control-px:calc(var(--ui-control-py-xl)-1px)] [--ui-control-py:calc(var(--ui-control-py-xl)-1px)]', empty: 'text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)' }
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
