export default {
  wrapper: 'relative',
  container: 'relative w-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth',
  item: 'flex flex-none snap-center',
  arrows: {
    wrapper: 'flex items-center justify-between'
  },
  indicators: {
    wrapper: 'absolute flex items-center justify-center gap-3 bottom-4 inset-x-0',
    base: 'rounded-full h-3 w-3',
    active: 'bg-primary-500 dark:bg-primary-400',
    inactive: 'bg-gray-100 dark:bg-gray-800 mix-blend-overlay'
  },
  default: {
    prevButton: {
      color: 'black' as const,
      class: 'rtl:[&_span:first-child]:rotate-180 absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full',
      icon: 'i-heroicons-chevron-left-20-solid'
    },
    nextButton: {
      color: 'black' as const,
      class: 'rtl:[&_span:last-child]:rotate-180 absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full',
      icon: 'i-heroicons-chevron-right-20-solid '
    }
  }
}
