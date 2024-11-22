import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    trigger: ['rounded-[calc(var(--ui-radius)*1.5)] inline-flex p-1.5 ring ring-inset ring-[var(--ui-border-accented)] disabled:cursor-not-allowed focus:outline-none aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ui-primary)] hover:bg-[var(--ui-bg-elevated)]', options.theme.transitions && 'transition-colors'],
    triggerIcon: 'rounded-[var(--ui-radius)]',
    triggerContent: 'p-2 pr-4',
    picker: 'flex gap-4',
    selector: 'rounded',
    selectorBackground: 'w-full h-full relative rounded',
    selectorThumb: '-translate-y-1/2 -translate-x-1/2 absolute size-4 ring-2 ring-[var(--color-white)] rounded-full cursor-pointer',
    track: 'w-[8px] rounded relative',
    trackThumb: 'absolute transform -translate-y-1/2 -translate-x-[4px] size-4 rounded-full ring-2 ring-[var(--color-white)] cursor-pointer'
  },
  variants: {
    size: {
      xs: {
        triggerIcon: 'w-3 h-3',
        selector: 'w-38 h-38',
        track: 'h-38'
      },
      sm: {
        triggerIcon: 'w-4 h-4',
        selector: 'w-40 h-40',
        track: 'h-40'
      },
      md: {
        triggerIcon: 'w-5 h-5',
        selector: 'w-42 h-42',
        track: 'h-42'
      },
      lg: {
        triggerIcon: 'w-6 h-6',
        selector: 'w-44 h-44',
        track: 'h-44'
      },
      xl: {
        triggerIcon: 'w-7 h-7',
        selector: 'w-46 h-46',
        track: 'h-46'
      }
    }
  },
  compoundVariants: [],
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
