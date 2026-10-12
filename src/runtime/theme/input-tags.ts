import input, { withinFocus } from './input'
import { extendTheme } from '../utils/theme'

// Same box as Input, with the tags and the native input in a container that
// has the padding of the size in place of the input
export default extendTheme(input, {
  slots: {
    base: () => 'flex-1 border-0 bg-transparent text-strong placeholder:text-faint focus:outline-none disabled:cursor-not-allowed disabled:opacity-75',
    // The tags wrap in their own container, so the leading and the trailing stay
    // centered on the box whatever its number of lines
    tags: 'flex flex-wrap items-center flex-1 min-w-0 gap-(--ui-control-gap) px-(--ui-control-px) py-(--ui-control-py)',
    item: 'px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-strong bg-soft text-default data-disabled:cursor-not-allowed data-disabled:opacity-75 wrap-anywhere data-[state=active]:bg-strong',
    itemText: '',
    itemDelete: 'inline-flex items-center rounded-xs text-faint hover:text-default hover:bg-strong disabled:pointer-events-none transition-colors',
    itemDeleteIcon: 'shrink-0'
  },
  variants: {
    // Next to a leading or a trailing, the padding of the container is the gap to it
    leading: {
      true: { base: () => undefined, tags: 'ps-(--ui-control-gap)' }
    },
    trailing: {
      true: { base: () => undefined, tags: 'pe-(--ui-control-gap)' }
    },
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
    // The tags and the input take the focus, two levels down from the box
    variant: (prev: typeof input.variants.variant) => Object.fromEntries(
      Object.entries(prev).map(([key, value]) => [key, { root: withinFocus(value.root) }])
    ) as typeof prev
  }
})
