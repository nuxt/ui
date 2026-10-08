import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'flex gap-4',
    header: 'flex',
    item: 'group text-center relative w-full',
    container: 'relative',
    trigger: 'rounded-full text-center align-middle flex items-center justify-center font-semibold group-data-[state=completed]:text-accent-contrast group-data-[state=active]:text-accent-contrast text-muted bg-soft focus-visible:outline-3 group-data-[state=completed]:bg-accent group-data-[state=active]:bg-accent outline-accent-focus size-(--ui-control-size)',
    indicator: 'flex items-center justify-center size-full',
    icon: 'shrink-0 size-(--ui-control-icon)',
    separator: 'absolute rounded-full group-data-disabled:opacity-75 bg-strong group-data-[state=completed]:bg-accent',
    wrapper: 'mt-(--ui-control-gap)',
    title: 'font-medium text-default',
    description: 'text-muted text-wrap',
    content: 'size-full'
  },

  variants: {
    orientation: {
      horizontal: {
        root: 'flex-col',
        container: 'flex justify-center',
        separator: 'top-[calc(50%-2px)] h-0.5',
        wrapper: 'mt-1'
      },
      vertical: {
        header: 'flex-col gap-4',
        item: 'flex text-start gap-(--ui-control-gap)',
        separator: 'inset-s-[calc(50%-1px)] top-[calc(var(--ui-control-size)+6px)] bottom-[-10px] w-0.5'
      }
    },

    size: {
      xs: {
        root: '[--ui-control-size:--spacing(6)] [--ui-control-icon:--spacing(3)] [--ui-control-gap:--spacing(1.5)]',
        trigger: 'text-xs',
        title: 'text-xs',
        description: 'text-xs'
      },
      sm: {
        root: '[--ui-control-size:--spacing(8)] [--ui-control-icon:--spacing(4)] [--ui-control-gap:--spacing(2)]',
        trigger: 'text-sm',
        title: 'text-xs',
        description: 'text-xs'
      },
      md: {
        root: '[--ui-control-size:--spacing(10)] [--ui-control-icon:--spacing(5)] [--ui-control-gap:--spacing(2.5)]',
        trigger: 'text-base',
        title: 'text-sm',
        description: 'text-sm'
      },
      lg: {
        root: '[--ui-control-size:--spacing(12)] [--ui-control-icon:--spacing(6)] [--ui-control-gap:--spacing(3)]',
        trigger: 'text-lg',
        title: 'text-base',
        description: 'text-base'
      },
      xl: {
        root: '[--ui-control-size:--spacing(14)] [--ui-control-icon:--spacing(7)] [--ui-control-gap:--spacing(3.5)]',
        trigger: 'text-xl',
        title: 'text-lg',
        description: 'text-lg'
      }
    },

    color: colorVariant({ root: '' })
  },

  compoundVariants: [{
    orientation: 'horizontal',
    size: 'xs',
    class: { separator: 'inset-s-[calc(50%+16px)] inset-e-[calc(-50%+16px)]' }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: { separator: 'inset-s-[calc(50%+20px)] inset-e-[calc(-50%+20px)]' }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: { separator: 'inset-s-[calc(50%+28px)] inset-e-[calc(-50%+28px)]' }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: { separator: 'inset-s-[calc(50%+32px)] inset-e-[calc(-50%+32px)]' }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: { separator: 'inset-s-[calc(50%+36px)] inset-e-[calc(-50%+36px)]' }
  }],

  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
