import { colorVariant } from './color'
import { fieldGroupVariantRoot } from './field-group'
import { defineTheme } from '../utils/theme'

// `root` is the box, a `div` around the segments. They take the focus, so the
// box follows it with `has-focus`.
export default defineTheme({
  slots: {
    root: 'group relative inline-flex items-center rounded-md select-none text-strong data-disabled:cursor-not-allowed transition-colors',
    segment: 'rounded-sm text-center outline-hidden data-placeholder:text-faint data-[segment=literal]:text-muted data-invalid:text-error data-disabled:cursor-not-allowed data-disabled:opacity-(--ui-disabled-opacity) transition-colors',
    // After the segments in the DOM, so they keep the first tab stops. The invisible
    // character gives the leading the baseline of the text, see `input.ts`. The box
    // has the padding here, so a button eats into it to sit as it does in an input
    leading: `order-first flex items-center before:content-['x'] before:w-0 before:invisible has-[>button]:-my-(--ui-control-py) has-[>button]:-ms-[calc(var(--ui-control-px)-var(--spacing))]`,
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    trailing: 'ms-auto flex items-center has-[>button]:-my-(--ui-control-py) has-[>button]:-me-[calc(var(--ui-control-px)-var(--spacing))]',
    trailingIcon: 'shrink-0 text-faint',
    separatorIcon: 'shrink-0 size-4 text-muted'
  },
  variants: {
    ...fieldGroupVariantRoot,
    // The segments sit closer than the content of another field
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(0.25)] [--ui-control-icon-size:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        segment: 'data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-10'
      },
      sm: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(0.5)] [--ui-control-icon-size:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        segment: 'data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-10'
      },
      md: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(0.5)] [--ui-control-icon-size:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        segment: 'data-[segment=day]:w-9 data-[segment=month]:w-9 data-[segment=year]:w-11'
      },
      lg: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(0.75)] [--ui-control-icon-size:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        segment: 'data-[segment=day]:w-9 data-[segment=month]:w-9 data-[segment=year]:w-11'
      },
      xl: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(0.75)] [--ui-control-icon-size:--spacing(6)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        segment: 'data-[segment=day]:w-10 data-[segment=month]:w-10 data-[segment=year]:w-12'
      }
    },
    variant: {
      outline: { root: 'bg-default ring ring-inset ring-strong outline-accent-focus has-focus-visible:outline-(length:--ui-focus-width) has-focus-visible:ring-accent', segment: 'focus:bg-soft' },
      soft: { root: 'bg-tint hover:bg-soft has-focus:bg-soft data-disabled:bg-tint outline-accent-focus has-focus-visible:outline-(length:--ui-focus-width)', segment: 'focus:bg-strong' },
      subtle: { root: 'bg-soft ring ring-inset ring-strong outline-accent-focus has-focus-visible:outline-(length:--ui-focus-width) has-focus-visible:ring-accent', segment: 'focus:bg-strong' },
      ghost: { root: 'bg-transparent hover:bg-soft has-focus:bg-soft data-disabled:bg-transparent dark:data-disabled:bg-transparent outline-accent-focus has-focus-visible:outline-(length:--ui-focus-width)', segment: 'focus:bg-strong' },
      none: { root: 'bg-transparent has-focus:outline-none', segment: 'focus:bg-soft' }
    },
    color: colorVariant({ root: '' }),
    leading: {
      true: ''
    },
    trailing: {
      true: ''
    },
    // The component turns it off on the trailing icon when the leading one is the loading icon
    loading: {
      true: {
        leadingIcon: 'animate-spin',
        trailingIcon: 'animate-spin'
      }
    },
    highlight: {
      true: { root: 'ring ring-inset ring-accent' }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
