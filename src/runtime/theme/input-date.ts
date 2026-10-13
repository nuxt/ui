import { colorVariant } from './color'
import { fieldGroupVariant } from './field-group'
import { defineTheme } from '../utils/theme'

// The box is a `div` around the segments: `root` has the tokens, the padding and
// the gap of the size, and the leading and the trailing are in its flow. The
// segments take the focus, so the box follows it with `has-focus`.
export default defineTheme({
  slots: {
    root: 'group relative inline-flex items-center rounded-md select-none text-strong transition-colors',
    segment: 'rounded-sm text-center outline-hidden data-placeholder:text-faint data-[segment=literal]:text-muted data-invalid:text-error data-disabled:cursor-not-allowed data-disabled:opacity-75 transition-colors',
    // After the segments in the DOM, so they keep the first tab stops.
    // The box sits on a line of text by its first item: an invisible character
    // gives the leading the baseline of the text, so an icon doesn't move the box
    leading: `order-first flex items-center before:content-['x'] before:w-0 before:invisible`,
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    // At the end of the box, whatever sits between the two
    trailing: 'ms-auto flex items-center',
    trailingIcon: 'shrink-0 text-faint',
    separatorIcon: 'shrink-0 size-4 text-muted'
  },
  variants: {
    fieldGroup: {
      horizontal: { root: fieldGroupVariant.fieldGroup.horizontal.base },
      vertical: { root: fieldGroupVariant.fieldGroup.vertical.base }
    },
    // The segments sit closer than the content of another field
    size: {
      xs: {
        root: '[--ui-control-px:--spacing(2)] [--ui-control-py:--spacing(1)] [--ui-control-gap:--spacing(0.25)] [--ui-control-icon:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)',
        segment: 'data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-10'
      },
      sm: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(0.5)] [--ui-control-icon:--spacing(4)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-xs)+var(--ui-control-text-step,0px))]/4',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)',
        segment: 'data-[segment=day]:w-8 data-[segment=month]:w-8 data-[segment=year]:w-10'
      },
      md: {
        root: '[--ui-control-px:--spacing(2.5)] [--ui-control-py:--spacing(1.5)] [--ui-control-gap:--spacing(0.5)] [--ui-control-icon:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)',
        segment: 'data-[segment=day]:w-9 data-[segment=month]:w-9 data-[segment=year]:w-11'
      },
      lg: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(0.75)] [--ui-control-icon:--spacing(5)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-[calc(var(--text-sm)+var(--ui-control-text-step,0px))]/5',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)',
        segment: 'data-[segment=day]:w-9 data-[segment=month]:w-9 data-[segment=year]:w-11'
      },
      xl: {
        root: '[--ui-control-px:--spacing(3)] [--ui-control-py:--spacing(2)] [--ui-control-gap:--spacing(0.75)] [--ui-control-icon:--spacing(6)] px-(--ui-control-px) py-(--ui-control-py) gap-(--ui-control-gap) text-base',
        leadingIcon: 'size-(--ui-control-icon)',
        trailingIcon: 'size-(--ui-control-icon)',
        segment: 'data-[segment=day]:w-10 data-[segment=month]:w-10 data-[segment=year]:w-12'
      }
    },
    variant: {
      outline: { root: 'bg-default ring ring-inset ring-strong outline-accent-focus has-focus-visible:outline-3 has-focus-visible:ring-accent', segment: 'focus:bg-soft' },
      soft: { root: 'bg-tint hover:bg-soft has-focus:bg-soft disabled:bg-tint outline-accent-focus has-focus-visible:outline-3', segment: 'focus:bg-strong' },
      subtle: { root: 'bg-soft ring ring-inset ring-strong outline-accent-focus has-focus-visible:outline-3 has-focus-visible:ring-accent', segment: 'focus:bg-strong' },
      ghost: { root: 'bg-transparent hover:bg-soft has-focus:bg-soft disabled:bg-transparent dark:disabled:bg-transparent outline-accent-focus has-focus-visible:outline-3', segment: 'focus:bg-strong' },
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
