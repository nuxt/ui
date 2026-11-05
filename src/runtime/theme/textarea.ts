import input from './input'
import { extendTheme } from '../utils/theme'

// Swaps one class of the input theme, and fails loudly once the input theme
// stops spelling it, rather than leaving a Textarea on the line of a control
function swap(classes: string, from: string, to: string) {
  if (!classes.includes(from)) {
    throw new Error(`[nuxt/ui] textarea theme: \`${from}\` is no longer in the input theme`)
  }
  return classes.replace(from, to)
}

export default extendTheme(input, {
  slots: {
    // The resize handle stops at one line of text
    base: (prev: string) => [prev, 'min-h-[calc(1lh+2*var(--ui-control-py))]'],
    // The leading and the trailing are as tall as a one-line input and center on
    // its first line, so a button lines up the same way it does in an input
    root: (prev: string) => [prev, 'items-start'],
    leading: (prev: string) => [prev, 'h-[calc(1lh+2*var(--ui-control-py))]'],
    trailing: (prev: string) => [prev, 'h-[calc(1lh+2*var(--ui-control-py))]']
  },
  variants: {
    // The text wraps, so it reads the reading line of the size, and the padding
    // gives back the difference so one row stays as tall as an input
    size: {
      xs: {
        root: (prev: string) => swap(swap(prev, '[--ui-control-py:calc(var(--ui-control-py-xs)-var(--ui-control-text-step,0px)/2)]', '[--ui-control-py:calc(var(--ui-control-py-xs)-(var(--ui-control-text-xs--leading)-var(--ui-control-text-xs--line-height))/2-var(--ui-control-text-step,0px)/2)]'), 'text-[calc(var(--ui-control-text-xs)+var(--ui-control-text-step,0px))]/[calc(var(--ui-control-text-xs--line-height)+var(--ui-control-text-step,0px))]', 'text-[calc(var(--ui-control-text-xs)+var(--ui-control-text-step,0px))]/[calc(var(--ui-control-text-xs--leading)+var(--ui-control-text-step,0px))]')
      },
      sm: {
        root: (prev: string) => swap(swap(prev, '[--ui-control-py:calc(var(--ui-control-py-sm)-var(--ui-control-text-step,0px)/2)]', '[--ui-control-py:calc(var(--ui-control-py-sm)-(var(--ui-control-text-sm--leading)-var(--ui-control-text-sm--line-height))/2-var(--ui-control-text-step,0px)/2)]'), 'text-[calc(var(--ui-control-text-sm)+var(--ui-control-text-step,0px))]/[calc(var(--ui-control-text-sm--line-height)+var(--ui-control-text-step,0px))]', 'text-[calc(var(--ui-control-text-sm)+var(--ui-control-text-step,0px))]/[calc(var(--ui-control-text-sm--leading)+var(--ui-control-text-step,0px))]')
      },
      md: {
        root: (prev: string) => swap(swap(prev, '[--ui-control-py:calc(var(--ui-control-py-md)-var(--ui-control-text-step,0px)/2)]', '[--ui-control-py:calc(var(--ui-control-py-md)-(var(--ui-control-text-md--leading)-var(--ui-control-text-md--line-height))/2-var(--ui-control-text-step,0px)/2)]'), 'text-[calc(var(--ui-control-text-md)+var(--ui-control-text-step,0px))]/[calc(var(--ui-control-text-md--line-height)+var(--ui-control-text-step,0px))]', 'text-[calc(var(--ui-control-text-md)+var(--ui-control-text-step,0px))]/[calc(var(--ui-control-text-md--leading)+var(--ui-control-text-step,0px))]')
      },
      lg: {
        root: (prev: string) => swap(swap(prev, '[--ui-control-py:calc(var(--ui-control-py-lg)-var(--ui-control-text-step,0px)/2)]', '[--ui-control-py:calc(var(--ui-control-py-lg)-(var(--ui-control-text-lg--leading)-var(--ui-control-text-lg--line-height))/2-var(--ui-control-text-step,0px)/2)]'), 'text-[calc(var(--ui-control-text-lg)+var(--ui-control-text-step,0px))]/[calc(var(--ui-control-text-lg--line-height)+var(--ui-control-text-step,0px))]', 'text-[calc(var(--ui-control-text-lg)+var(--ui-control-text-step,0px))]/[calc(var(--ui-control-text-lg--leading)+var(--ui-control-text-step,0px))]')
      },
      xl: {
        root: (prev: string) => swap(swap(prev, '[--ui-control-py:var(--ui-control-py-xl)]', '[--ui-control-py:calc(var(--ui-control-py-xl)-(var(--ui-control-text-xl--leading)-var(--ui-control-text-xl--line-height))/2)]'), 'text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)', 'text-(length:--ui-control-text-xl)/(--ui-control-text-xl--leading)')
      }
    },
    autoresize: {
      true: {
        base: 'resize-none'
      }
    }
  }
})
