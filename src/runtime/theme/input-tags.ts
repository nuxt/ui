import { colorVariant } from './color'
import { fieldGroupVariantRoot } from './field-group'
import { defineTheme } from '../utils/theme'

// `root` is the box, `base` the native input. The tags and the input are in a
// container that has the padding of the size.
export default defineTheme({
  slots: {
    root: 'relative inline-flex items-center rounded-md cursor-text data-disabled:cursor-not-allowed data-disabled:opacity-(--ui-disabled-opacity) transition-colors',
    base: 'flex-1 border-0 bg-transparent text-strong placeholder:text-faint focus:outline-none disabled:cursor-not-allowed',
    // The tags wrap in their own container, so the leading and the trailing stay
    // centered on the box whatever its number of lines
    tags: 'flex flex-wrap items-center flex-1 min-w-0 gap-(--ui-control-gap) px-(--ui-control-px) py-(--ui-control-py)',
    // After the input in the DOM, so the input keeps the first tab stop. The
    // invisible character gives the leading the baseline of the text, see `input.ts`
    leading: `order-first flex items-center ps-(--ui-control-px) has-[>button]:ps-1 before:content-['x'] before:w-0 before:invisible`,
    leadingIcon: 'shrink-0 text-faint',
    leadingAvatar: 'shrink-0',
    trailing: 'flex items-center pe-(--ui-control-px) has-[>button]:pe-1',
    trailingIcon: 'shrink-0 text-faint',
    item: 'px-1.5 py-0.5 rounded-sm font-medium inline-flex items-center gap-0.5 ring ring-inset ring-strong bg-soft text-default data-disabled:cursor-not-allowed wrap-anywhere data-[state=active]:bg-strong',
    itemText: '',
    itemDelete: 'inline-flex items-center rounded-xs text-faint hover:text-default hover:bg-strong disabled:pointer-events-none transition-colors',
    itemDeleteIcon: 'shrink-0'
  },
  variants: {
    ...fieldGroupVariantRoot,
    size: {
      xs: {
        root: '[--ui-control-px:var(--ui-control-px-xs)] [--ui-control-py:var(--ui-control-py-xs)] [--ui-control-gap:var(--ui-control-gap-xs)] [--ui-control-icon-size:var(--ui-control-icon-size-xs)] text-[calc(var(--ui-control-text-xs)+var(--ui-control-text-step,0px))]/(--ui-control-text-xs--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        item: 'text-[10px]/3',
        itemDeleteIcon: 'size-3'
      },
      sm: {
        root: '[--ui-control-px:var(--ui-control-px-sm)] [--ui-control-py:var(--ui-control-py-sm)] [--ui-control-gap:var(--ui-control-gap-sm)] [--ui-control-icon-size:var(--ui-control-icon-size-sm)] text-[calc(var(--ui-control-text-sm)+var(--ui-control-text-step,0px))]/(--ui-control-text-sm--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        item: 'text-[10px]/3',
        itemDeleteIcon: 'size-3'
      },
      md: {
        root: '[--ui-control-px:var(--ui-control-px-md)] [--ui-control-py:var(--ui-control-py-md)] [--ui-control-gap:var(--ui-control-gap-md)] [--ui-control-icon-size:var(--ui-control-icon-size-md)] text-[calc(var(--ui-control-text-md)+var(--ui-control-text-step,0px))]/(--ui-control-text-md--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        item: 'text-xs',
        itemDeleteIcon: 'size-3.5'
      },
      lg: {
        root: '[--ui-control-px:var(--ui-control-px-lg)] [--ui-control-py:var(--ui-control-py-lg)] [--ui-control-gap:var(--ui-control-gap-lg)] [--ui-control-icon-size:var(--ui-control-icon-size-lg)] text-[calc(var(--ui-control-text-lg)+var(--ui-control-text-step,0px))]/(--ui-control-text-lg--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        item: 'text-xs',
        itemDeleteIcon: 'size-3.5'
      },
      xl: {
        root: '[--ui-control-px:var(--ui-control-px-xl)] [--ui-control-py:var(--ui-control-py-xl)] [--ui-control-gap:var(--ui-control-gap-xl)] [--ui-control-icon-size:var(--ui-control-icon-size-xl)] text-(length:--ui-control-text-xl)/(--ui-control-text-xl--line-height)',
        leadingIcon: 'size-(--ui-control-icon-size)',
        trailingIcon: 'size-(--ui-control-icon-size)',
        item: 'text-sm',
        itemDeleteIcon: 'size-4'
      }
    },
    // The input takes the focus, two levels down from the box
    variant: {
      outline: { root: 'bg-default ring ring-inset ring-strong outline-accent-focus has-[input:focus-visible]:outline-(length:--ui-focus-width) has-[input:focus-visible]:ring-accent' },
      soft: { root: 'bg-tint hover:bg-soft has-[input:focus]:bg-soft data-disabled:bg-tint outline-accent-focus has-[input:focus-visible]:outline-(length:--ui-focus-width)' },
      subtle: { root: 'bg-soft ring ring-inset ring-strong outline-accent-focus has-[input:focus-visible]:outline-(length:--ui-focus-width) has-[input:focus-visible]:ring-accent' },
      ghost: { root: 'bg-transparent hover:bg-soft has-[input:focus]:bg-soft data-disabled:bg-transparent dark:data-disabled:bg-transparent outline-accent-focus has-[input:focus-visible]:outline-(length:--ui-focus-width)' },
      none: { root: 'bg-transparent' }
    },
    color: colorVariant({ root: '' }),
    // Next to a leading or a trailing, the padding of the container is the gap to it
    leading: {
      true: { tags: 'ps-(--ui-control-gap)' }
    },
    trailing: {
      true: { tags: 'pe-(--ui-control-gap)' }
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
