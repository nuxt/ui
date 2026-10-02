import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative group/user',
    wrapper: '',
    name: 'font-medium',
    description: 'text-muted',
    avatar: 'shrink-0'
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'flex items-center'
      },
      vertical: {
        root: 'flex flex-col'
      }
    },
    to: {
      true: {
        root: 'rounded-md outline-focus has-focus-visible:outline-3 transition',
        name: 'text-default peer-hover:text-strong peer-focus-visible:text-strong transition-colors',
        description: 'peer-hover:text-default peer-focus-visible:text-default transition-colors',
        avatar: 'transform transition-transform ease-out motion-reduce:transition-none group-hover/user:scale-115 group-has-focus-visible/user:scale-115'
      },
      false: {
        name: 'text-strong',
        description: ''
      }
    },
    size: {
      '3xs': {
        root: 'gap-1',
        wrapper: 'flex items-center gap-1',
        name: 'text-xs',
        description: 'text-xs'
      },
      '2xs': {
        root: 'gap-1.5',
        wrapper: 'flex items-center gap-1.5',
        name: 'text-xs',
        description: 'text-xs'
      },
      'xs': {
        root: 'gap-1.5',
        wrapper: 'flex items-center gap-1.5',
        name: 'text-xs',
        description: 'text-xs'
      },
      'sm': {
        root: 'gap-2',
        name: 'text-xs',
        description: 'text-xs'
      },
      'md': {
        root: 'gap-2',
        name: 'text-sm',
        description: 'text-xs'
      },
      'lg': {
        root: 'gap-2.5',
        name: 'text-sm',
        description: 'text-sm'
      },
      'xl': {
        root: 'gap-2.5',
        name: 'text-base',
        description: 'text-sm'
      },
      '2xl': {
        root: 'gap-3',
        name: 'text-base',
        description: 'text-base'
      },
      '3xl': {
        root: 'gap-3',
        name: 'text-lg',
        description: 'text-base'
      }
    }
  }
})
