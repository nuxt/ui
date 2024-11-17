import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    trigger: ['rounded-[calc(var(--ui-radius)*1.5)] p-1.5 inline-flex ring ring-inset ring-[var(--ui-border-accented)] disabled:cursor-not-allowed focus:outline-none aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 focus-visible:ring-2 focus-visible:ring-inset hover:bg-[var(--ui-bg-elevated)]', options.theme.transitions && 'transition-colors'],
    triggerIcon: 'rounded-[var(--ui-radius)] w-5 h-5',
    triggerContent: 'p-2 pr-4',
    picker: 'flex gap-4',
    selector: 'w-40 h-40 rounded',
    background: 'w-full h-full relative rounded',
    backgroundThumb: 'absolute size-4 ring-2 ring-[var(--color-white)] rounded-full cursor-pointer',
    track: 'w-[8px] h-40 rounded relative',
    trackThumb: 'absolute transform -translate-x-[4px] size-4 rounded-full ring-2 ring-[var(--color-white)] cursor-pointer'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        trigger: `focus-visible:ring-[var(--ui-${color})]`
      }])),
      neutral: ''
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: ''
    }
  },
  compoundVariants: [],
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
