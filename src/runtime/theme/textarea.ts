import input from './input'
import { extendTheme } from '../utils/theme'

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
    // The text wraps, so it keeps a reading line height instead of the line of a
    // control, and 2px less padding so one row stays as tall as an input
    size: {
      md: {
        root: (prev: string) => prev.replace('[--ui-control-py:var(--ui-control-py-md)]', '[--ui-control-py:calc(var(--ui-control-py-md)-(--spacing(0.5)))]').replace('text-[calc(var(--ui-control-text-md)+var(--ui-control-text-step,0px))]/(--ui-control-text-md--line-height)', 'text-[calc(var(--ui-control-text-md)+var(--ui-control-text-step,0px))]/5')
      },
      lg: {
        root: (prev: string) => prev.replace('[--ui-control-py:var(--ui-control-py-lg)]', '[--ui-control-py:calc(var(--ui-control-py-lg)-(--spacing(0.5)))]').replace('text-[calc(var(--ui-control-text-lg)+var(--ui-control-text-step,0px))]/(--ui-control-text-lg--line-height)', 'text-[calc(var(--ui-control-text-lg)+var(--ui-control-text-step,0px))]/5')
      },
      xl: {
        root: (prev: string) => prev.replace('[--ui-control-py:var(--ui-control-py-xl)]', '[--ui-control-py:calc(var(--ui-control-py-xl)-(--spacing(0.5)))]').replace('text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)', 'text-(length:--ui-control-text-xl)/6')
      }
    },
    autoresize: {
      true: {
        base: 'resize-none'
      }
    }
  }
})
