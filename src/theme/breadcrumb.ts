import { colorVariant } from './color'

export default {
  slots: {
    root: 'relative min-w-0',
    list: 'flex items-center gap-1.5',
    item: 'flex min-w-0',
    link: 'group relative flex items-center gap-1.5 text-sm min-w-0 rounded-md outline-accent-focus focus-visible:outline-3',
    linkLeadingIcon: 'shrink-0 size-5',
    linkLeadingAvatar: 'shrink-0',
    linkLabel: 'truncate',
    separator: 'flex',
    separatorIcon: 'shrink-0 size-5 text-muted'
  },
  variants: {
    active: {
      true: {
        link: 'font-semibold text-accent'
      },
      false: {
        link: 'text-muted font-medium'
      }
    },
    disabled: {
      true: {
        link: 'cursor-not-allowed opacity-75'
      }
    },
    to: {
      true: ''
    },
    color: colorVariant({ root: '' })
  },
  compoundVariants: [{
    disabled: false,
    active: false,
    to: true,
    class: {
      link: 'hover:text-default transition-colors'
    }
  }],
  defaultVariants: {
    color: 'primary'
  }
}
