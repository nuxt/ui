import select from './select'
import { extendTheme } from '../utils/theme'

export default extendTheme(select, {
  slots: {
    // A field as large as an item, inset like the items: its padding is theirs, so its
    // icon and text line up with them
    // It holds the focus as long as the menu is open, so it shows no focus outline
    filter: 'mx-1 mt-1 has-[>:focus-visible]:outline-0',
    focusScope: 'flex flex-col min-h-0 focus:outline-none',
    viewport: () => 'relative scroll-py-1 overflow-y-auto flex-1',
    content: (content: string) => [content, 'max-h-[min(15rem,var(--reka-combobox-content-available-height,15rem))] origin-(--reka-combobox-content-transform-origin) w-(--reka-combobox-trigger-width)'],
    // A button 4px inside the box, like the other buttons of a field: it gives back to the
    // box the room it takes past the line, and its hover is a step above the fill of the box
    trailingClear: '-my-[calc(var(--ui-control-py)-(--spacing(1)))] -me-[calc(var(--ui-control-py)-(--spacing(1)))] p-[calc(var(--ui-control-py)-(--spacing(1)))] rounded-sm hover:bg-accent-strong active:bg-accent-strong',
    empty: 'p-[calc(var(--ui-control-py)+(--spacing(1)))] text-center text-muted'
  },
  variants: {
    size: {
      xs: {
        filter: '[--ui-control-px:calc(var(--ui-control-px-xs)-(--spacing(1)))]',
        empty: 'text-(length:--ui-control-text-xs)/(--ui-control-text-xs--line-height)'
      },
      sm: {
        filter: '[--ui-control-px:calc(var(--ui-control-px-sm)-(--spacing(1)))]',
        empty: 'text-(length:--ui-control-text-sm)/(--ui-control-text-sm--line-height)'
      },
      md: {
        filter: '[--ui-control-px:calc(var(--ui-control-px-md)-(--spacing(1)))]',
        empty: 'text-(length:--ui-control-text-md)/(--ui-control-text-md--line-height)'
      },
      lg: {
        filter: '[--ui-control-px:calc(var(--ui-control-px-lg)-(--spacing(1)))]',
        empty: 'text-(length:--ui-control-text-lg)/(--ui-control-text-lg--line-height)'
      },
      xl: {
        filter: '[--ui-control-px:calc(var(--ui-control-px-xl)-(--spacing(1)))]',
        empty: 'text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)'
      }
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
