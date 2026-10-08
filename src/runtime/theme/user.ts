import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative group/user gap-(--ui-control-gap)',
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
        root: '[--ui-control-gap:--spacing(1)]',
        wrapper: 'flex items-center gap-(--ui-control-gap)',
        name: 'text-xs',
        description: 'text-xs'
      },
      '2xs': {
        root: '[--ui-control-gap:--spacing(1.5)]',
        wrapper: 'flex items-center gap-(--ui-control-gap)',
        name: 'text-xs',
        description: 'text-xs'
      },
      'xs': {
        root: '[--ui-control-gap:--spacing(1.5)]',
        wrapper: 'flex items-center gap-(--ui-control-gap)',
        name: 'text-xs',
        description: 'text-xs'
      },
      'sm': {
        root: '[--ui-control-gap:--spacing(2)]',
        name: 'text-xs',
        description: 'text-xs'
      },
      'md': {
        root: '[--ui-control-gap:--spacing(2)]',
        name: 'text-sm',
        description: 'text-xs'
      },
      'lg': {
        root: '[--ui-control-gap:--spacing(2.5)]',
        name: 'text-sm',
        description: 'text-sm'
      },
      'xl': {
        root: '[--ui-control-gap:--spacing(2.5)]',
        name: 'text-base',
        description: 'text-sm'
      },
      '2xl': {
        root: '[--ui-control-gap:--spacing(3)]',
        name: 'text-base',
        description: 'text-base'
      },
      '3xl': {
        root: '[--ui-control-gap:--spacing(3)]',
        name: 'text-lg',
        description: 'text-base'
      }
    }
  },
  defaultVariants: {
    size: 'md'
  }
})
