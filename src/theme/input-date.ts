import { defuFn } from 'defu'
import input, { replaceFocus } from './input'
import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'

export default defuFn({
  slots: {
    root: () => undefined,
    base: () => 'group relative inline-flex items-center rounded-md select-none transition-colors',
    segment: 'rounded-sm text-center outline-hidden data-placeholder:text-dimmed data-[segment=literal]:text-muted data-invalid:text-error data-disabled:cursor-not-allowed data-disabled:opacity-75 transition-colors',
    separatorIcon: 'shrink-0 size-4 text-muted'
  },
  variants: {
    ...fieldGroupVariant,
    // No `root` slot here, so the color scopes `base`
    color: () => colorVariant({ base: '' }),
    size: {
      xs: {
        base: (prev: string) => [prev, 'gap-0.25'],
        segment: 'data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-10'
      },
      sm: {
        base: (prev: string) => [prev, 'gap-0.5'],
        segment: 'data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-10'
      },
      md: {
        base: (prev: string) => [prev, 'gap-0.5'],
        segment: 'data-[segment=day]:w-9 data-[segment=month]:w-9 data-[segment=year]:w-11'
      },
      lg: {
        base: (prev: string) => [prev, 'gap-0.75'],
        segment: 'data-[segment=day]:w-9 data-[segment=month]:w-9 data-[segment=year]:w-11'
      },
      xl: {
        base: (prev: string) => [prev, 'gap-0.75'],
        segment: 'data-[segment=day]:w-10 data-[segment=month]:w-10 data-[segment=year]:w-12'
      }
    },
    variant: (prev: Record<string, { base: string }>) => Object.fromEntries(
      Object.entries(prev).map(([key, value]) => [key, { base: replaceFocus(value.base) }])
    )
  },
  compoundVariants: (prev: Record<string, any>[]) => [...prev.map(item => ({
    ...item,
    class: typeof item.class.base === 'string' ? { ...item.class, base: replaceFocus(item.class.base) } : item.class
  })), {
    variant: 'outline',
    class: {
      segment: 'focus:bg-elevated'
    }
  }, {
    variant: 'soft',
    class: {
      segment: 'focus:bg-accented/50 group-hover:focus:bg-accented'
    }
  }, {
    variant: 'subtle',
    class: {
      segment: 'focus:bg-accented'
    }
  }, {
    variant: 'ghost',
    class: {
      segment: 'focus:bg-elevated group-hover:focus:bg-accented'
    }
  }, {
    variant: 'none',
    class: {
      segment: 'focus:bg-elevated'
    }
  }]
}, input)
