import input, { replaceFocus } from './input'
import { fieldGroupVariant } from './field-group'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    root: (prev: string) => [prev, 'flex-wrap'],
    base: () => 'rounded-md text-strong transition-colors',
    item: 'px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-strong bg-soft text-default data-disabled:cursor-not-allowed data-disabled:opacity-75 wrap-anywhere data-[state=active]:bg-strong',
    itemText: '',
    itemDelete: 'inline-flex items-center rounded-xs text-faint hover:text-default hover:bg-strong disabled:pointer-events-none transition-colors',
    itemDeleteIcon: 'shrink-0',
    input: 'flex-1 border-0 bg-transparent placeholder:text-faint focus:outline-none disabled:cursor-not-allowed disabled:opacity-75'
  },
  variants: {
    ...fieldGroupVariant,
    size: {
      xs: {
        item: 'text-[10px]/3',
        itemDeleteIcon: 'size-3'
      },
      sm: {
        item: 'text-[10px]/3',
        itemDeleteIcon: 'size-3'
      },
      md: {
        item: 'text-xs',
        itemDeleteIcon: 'size-3.5'
      },
      lg: {
        item: 'text-xs',
        itemDeleteIcon: 'size-3.5'
      },
      xl: {
        item: 'text-sm',
        itemDeleteIcon: 'size-4'
      }
    },
    variant: (prev: typeof input.variants.variant) => Object.fromEntries(
      Object.entries(prev).map(([key, value]) => [key, { base: replaceFocus(value.base) }])
    ) as typeof prev
  },
  compoundVariants: (prev: typeof input.compoundVariants) => prev.map(item => ({
    ...item,
    class: typeof item.class.base === 'string' ? { ...item.class, base: replaceFocus(item.class.base) } : item.class
  }))
})
