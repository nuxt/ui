import field, { replaceFocus } from './field'
import { extendTheme } from '../utils/theme'

export default extendTheme(field, {
  slots: {
    root: (prev: string) => [prev, 'select-none'],
    segment: 'rounded-sm text-center outline-hidden data-placeholder:text-faint data-[segment=literal]:text-muted data-invalid:text-error data-disabled:cursor-not-allowed data-disabled:opacity-75 transition-colors',
    // After the segments in the DOM, so they keep the first tab stops
    leading: (prev: string) => [prev, 'order-first'],
    separatorIcon: 'shrink-0 size-4 text-muted'
  },
  variants: {
    size: {
      // The segments sit closer than the content of another field
      xs: {
        root: (prev: string) => [prev, '[--ui-control-gap:--spacing(0.25)]'],
        segment: 'not-data-[segment=literal]:w-8'
      },
      sm: {
        root: (prev: string) => [prev, '[--ui-control-gap:--spacing(0.5)]'],
        segment: 'not-data-[segment=literal]:w-8'
      },
      md: {
        root: (prev: string) => [prev, '[--ui-control-gap:--spacing(0.5)]'],
        segment: 'not-data-[segment=literal]:w-9'
      },
      lg: {
        root: (prev: string) => [prev, '[--ui-control-gap:--spacing(0.75)]'],
        segment: 'not-data-[segment=literal]:w-9'
      },
      xl: {
        root: (prev: string) => [prev, '[--ui-control-gap:--spacing(0.75)]'],
        segment: 'not-data-[segment=literal]:w-10'
      }
    },
    variant: (prev: typeof field.variants.variant) => Object.fromEntries(
      Object.entries(prev).map(([key, value]) => [key, { root: replaceFocus(value.root), segment: key === 'outline' || key === 'none' ? 'focus:bg-soft' : 'focus:bg-strong' }])
    ) as Record<keyof typeof prev, { root: string, segment: string }>
  }
})
