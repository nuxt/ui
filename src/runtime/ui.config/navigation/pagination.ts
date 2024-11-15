import type { ButtonColor } from '../../types'

export default {
  wrapper: 'flex items-center -space-x-px',
  base: '',
  rounded: 'first:rounded-s-md last:rounded-e-md',
  default: {
    size: 'sm',
    activeButton: {
      color: 'primary' as ButtonColor
    },
    inactiveButton: {
      color: 'white' as ButtonColor
    },
    firstButton: {
      color: 'white' as ButtonColor,
      class: 'rtl:[&_span:first-child]:rotate-180',
      icon: 'i-heroicons-chevron-double-left-20-solid'
    },
    lastButton: {
      color: 'white' as ButtonColor,
      class: 'rtl:[&_span:last-child]:rotate-180',
      icon: 'i-heroicons-chevron-double-right-20-solid'
    },
    prevButton: {
      color: 'white' as ButtonColor,
      class: 'rtl:[&_span:first-child]:rotate-180',
      icon: 'i-heroicons-chevron-left-20-solid'
    },
    nextButton: {
      color: 'white' as ButtonColor,
      class: 'rtl:[&_span:last-child]:rotate-180',
      icon: 'i-heroicons-chevron-right-20-solid'
    }
  }
}
