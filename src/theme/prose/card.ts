import { colorVariant } from '../color'

export default {
  slots: {
    base: 'group relative block my-5 p-4 sm:p-6 border border-default rounded-md bg-default transition-colors',
    icon: 'size-6 mb-2 block text-accent',
    title: 'text-highlighted font-semibold',
    description: 'text-[15px] text-muted *:first:mt-0 *:last:mb-0 *:my-1',
    externalIcon: 'size-4 align-top absolute end-2 top-2 text-dimmed pointer-events-none transition-colors'
  },
  variants: {
    color: colorVariant({ base: '', icon: '', externalIcon: '' }),
    to: {
      true: {
        base: 'hover:bg-accent-tint hover:border-accent outline-accent-focus has-[>a:focus-visible]:outline-3 has-[>a:focus-visible]:border-accent',
        externalIcon: 'group-hover:text-accent'
      }
    },
    title: {
      true: {
        description: 'mt-1'
      }
    }
  },
  defaultVariants: {
    color: 'primary'
  }
}
