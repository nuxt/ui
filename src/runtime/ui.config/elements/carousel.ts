export default {
  wrapper: 'relative',
  carousel: 'relative w-full flex snap-x overflow-x-auto snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden',
  item: 'min-w-full w-full snap-start',
  indicatorWrapper: 'absolute bottom-0 left-0 right-0 flex list-none justify-center p-0',
  indicator: 'mx-1 rounded-md h-3 w-3 bg-gray-700',
  indicatorActive: 'mx-1 rounded-md h-3 w-9 bg-primary-400',
  prevButton: {
    color: 'white',
    class: 'rtl:[&_span:first-child]:rotate-180 absolute left-0 top-1/2 transform -translate-y-1/2 z-[1]',
    icon: 'i-heroicons-chevron-left-20-solid',
    size: 'lg'
  },
  nextButton: {
    color: 'white',
    class: 'rtl:[&_span:last-child]:rotate-180 absolute right-0 top-1/2 transform -translate-y-1/2 z-[1]',
    icon: 'i-heroicons-chevron-right-20-solid ',
    size: 'lg'
  }
}
