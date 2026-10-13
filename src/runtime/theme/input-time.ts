import field, { replaceFocus } from './field'
import { extendTheme } from '../utils/theme'

export default extendTheme(field, {
  slots: {
    base: (prev: string) => [prev, 'select-none'],
    segment: 'rounded-sm text-center outline-hidden data-placeholder:text-faint data-[segment=literal]:text-muted data-invalid:text-error data-disabled:cursor-not-allowed data-disabled:opacity-75 transition-colors',
    // After the segments in the DOM, so they keep the first tab stops
    leading: (prev: string) => [prev, 'order-first'],
    separatorIcon: 'shrink-0 size-4 text-muted'
  },
  variants: {
    size: {
      // The gap of the box is the one between segments: the leading and the trailing
      // make up the difference to the gap of the size
      xs: {
        base: (prev: string) => [prev, 'gap-0.25'],
        leading: 'me-[calc(var(--ui-control-gap)-(--spacing(0.25)))]',
        trailing: 'ps-[calc(var(--ui-control-gap)-(--spacing(0.25)))]',
        segment: 'not-data-[segment=literal]:w-8'
      },
      sm: {
        base: (prev: string) => [prev, 'gap-0.5'],
        leading: 'me-[calc(var(--ui-control-gap)-(--spacing(0.5)))]',
        trailing: 'ps-[calc(var(--ui-control-gap)-(--spacing(0.5)))]',
        segment: 'not-data-[segment=literal]:w-8'
      },
      md: {
        base: (prev: string) => [prev, 'gap-0.5'],
        leading: 'me-[calc(var(--ui-control-gap)-(--spacing(0.5)))]',
        trailing: 'ps-[calc(var(--ui-control-gap)-(--spacing(0.5)))]',
        segment: 'not-data-[segment=literal]:w-9'
      },
      lg: {
        base: (prev: string) => [prev, 'gap-0.75'],
        leading: 'me-[calc(var(--ui-control-gap)-(--spacing(0.75)))]',
        trailing: 'ps-[calc(var(--ui-control-gap)-(--spacing(0.75)))]',
        segment: 'not-data-[segment=literal]:w-9'
      },
      xl: {
        base: (prev: string) => [prev, 'gap-0.75'],
        leading: 'me-[calc(var(--ui-control-gap)-(--spacing(0.75)))]',
        trailing: 'ps-[calc(var(--ui-control-gap)-(--spacing(0.75)))]',
        segment: 'not-data-[segment=literal]:w-10'
      }
    },
    variant: (prev: typeof field.variants.variant) => Object.fromEntries(
      Object.entries(prev).map(([key, value]) => [key, { base: replaceFocus(value.base), segment: key === 'outline' || key === 'none' ? 'focus:bg-soft' : 'focus:bg-strong' }])
    ) as Record<keyof typeof prev, { base: string, segment: string }>
  }
})
