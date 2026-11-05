import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative',
    // Keep the container centered, but never let its start edge slide under the indicator (`w-32`).
    // Keyed on the indicator's `absolute` class so an in-flow override (e.g. `sticky`) drops the gutter.
    container: `flex flex-col mx-auto max-w-2xl lg:peer-[${options.theme.prefix ? `[class~='${options.theme.prefix}:absolute']` : '.absolute'}]/indicator:ms-[max(--spacing(32),calc((100%-var(--container-2xl))/2))]`,
    header: '',
    meta: 'flex items-center gap-3 mb-2',
    date: 'text-sm/6 text-toned truncate',
    badge: '',
    title: 'relative text-xl text-pretty font-semibold text-highlighted',
    description: 'text-base text-pretty text-muted mt-1',
    imageWrapper: 'relative overflow-hidden rounded-lg aspect-[16/9] mt-5 group/changelog-version-image',
    image: 'object-cover object-top w-full h-full',
    authors: 'flex flex-wrap gap-x-4 gap-y-1.5',
    footer: 'border-t border-default pt-5 flex items-center justify-between',
    indicator: 'peer/indicator absolute start-0 top-0 w-32 hidden lg:flex items-center justify-end gap-3 min-w-0',
    dot: 'size-4 rounded-full bg-default ring ring-default flex items-center justify-center my-1',
    dotInner: 'size-2 rounded-full bg-primary'
  },
  variants: {
    body: {
      false: {
        footer: 'mt-5'
      }
    },
    badge: {
      false: {
        meta: 'lg:hidden'
      }
    },
    to: {
      true: {
        title: ['outline-primary/25 has-focus-visible:outline-3 rounded-xs', options.theme.transitions && 'transition'],
        image: 'transform transition-transform ease-out motion-reduce:transition-none group-hover/changelog-version-image:scale-105 group-has-focus-visible/changelog-version-image:scale-105'
      }
    },
    hidden: {
      true: {
        date: 'lg:hidden'
      }
    }
  }
})
