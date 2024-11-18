import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative focus:outline-none',
    viewport: 'overflow-hidden',
    container: 'flex items-start',
    item: 'min-w-0 shrink-0 basis-full',
    controls: '',
    arrows: '',
    prev: 'absolute rounded-full',
    next: 'absolute rounded-full',
    dots: 'absolute inset-x-0 -bottom-7 flex flex-wrap items-center justify-center gap-3',
    dot: ['cursor-pointer size-3 bg-[var(--ui-border-accented)] rounded-full', options.theme.transitions && 'transition']
  },
  variants: {
    orientation: {
      vertical: {
        container: 'flex-col -mt-4',
        item: 'pt-4',
        prev: '-top-12 left-1/2 -translate-x-1/2 rotate-90 rtl:-rotate-90',
        next: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90 rtl:-rotate-90'
      },
      horizontal: {
        container: 'flex-row -ms-4',
        item: 'ps-4',
        prev: '-start-12 top-1/2 -translate-y-1/2',
        next: '-end-12 top-1/2 -translate-y-1/2'
      }
    },
    active: {
      true: {
        dot: 'bg-[var(--ui-border-inverted)]'
      }
    }
  },
  defaultVariants: {
    orientation: 'horizontal'
  }
})
