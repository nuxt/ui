import input, { replaceFocus } from './input'
import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { extendTheme } from '../utils/theme'

export default extendTheme(input, {
  slots: {
    root: () => undefined,
    base: () => 'group relative inline-flex items-center rounded-md select-none text-strong transition-colors',
    segment: 'rounded-sm text-center outline-hidden data-placeholder:text-faint data-[segment=literal]:text-muted data-invalid:text-error-default data-disabled:cursor-not-allowed data-disabled:opacity-75 transition-colors',
    separatorIcon: 'shrink-0 size-4 text-muted'
  },
  variants: {
    ...fieldGroupVariant,
    // No `root` slot here, so the color and the size tokens go on `base`
    color: () => colorVariant({ base: '' }),
    size: {
      xs: {
        root: () => undefined,
        base: (prev: string) => [prev, input.variants.size.xs.root, 'gap-0.25'],
        segment: 'data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-10'
      },
      sm: {
        root: () => undefined,
        base: (prev: string) => [prev, input.variants.size.sm.root, 'gap-0.5'],
        segment: 'data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-10'
      },
      md: {
        root: () => undefined,
        base: (prev: string) => [prev, input.variants.size.md.root, 'gap-0.5'],
        segment: 'data-[segment=day]:w-9 data-[segment=month]:w-9 data-[segment=year]:w-11'
      },
      lg: {
        root: () => undefined,
        base: (prev: string) => [prev, input.variants.size.lg.root, 'gap-0.75'],
        segment: 'data-[segment=day]:w-9 data-[segment=month]:w-9 data-[segment=year]:w-11'
      },
      xl: {
        root: () => undefined,
        base: (prev: string) => [prev, input.variants.size.xl.root, 'gap-0.75'],
        segment: 'data-[segment=day]:w-10 data-[segment=month]:w-10 data-[segment=year]:w-12'
      }
    },
    variant: (prev: typeof input.variants.variant) => Object.fromEntries(
      Object.entries(prev).map(([key, value]) => [key, { base: replaceFocus(value.base), segment: key === 'outline' || key === 'none' ? 'focus:bg-soft' : 'focus:bg-strong' }])
    ) as Record<keyof typeof prev, { base: string, segment: string }>
  },
  compoundVariants: (prev: typeof input.compoundVariants) => [...prev.map(item => ({
    ...item,
    class: typeof item.class.base === 'string' ? { ...item.class, base: replaceFocus(item.class.base) } : item.class
  }))]
})
