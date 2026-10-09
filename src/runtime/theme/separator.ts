import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'flex items-center text-center',
    border: 'border-accent-default',
    container: 'font-medium text-default flex',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    label: 'text-sm'
  },
  variants: {
    color: colorVariant({ root: '' }),
    orientation: {
      horizontal: {
        root: 'w-full flex-row',
        border: 'w-full border-t-(length:--ui-control-thickness)',
        container: 'whitespace-nowrap'
      },
      vertical: {
        root: 'h-full flex-col',
        border: 'h-full border-s-(length:--ui-control-thickness)',
        container: ''
      }
    },
    size: {
      xs: { root: '[--ui-control-thickness:1px]' },
      sm: { root: '[--ui-control-thickness:2px]' },
      md: { root: '[--ui-control-thickness:3px]' },
      lg: { root: '[--ui-control-thickness:4px]' },
      xl: { root: '[--ui-control-thickness:5px]' }
    },
    position: {
      start: '',
      center: '',
      end: ''
    },
    type: {
      solid: {
        border: 'border-solid'
      },
      dashed: {
        border: 'border-dashed'
      },
      dotted: {
        border: 'border-dotted'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    position: 'start',
    class: { container: 'me-3' }
  }, {
    orientation: 'horizontal',
    position: 'center',
    class: { container: 'mx-3' }
  }, {
    orientation: 'horizontal',
    position: 'end',
    class: { container: 'ms-3' }
  }, {
    orientation: 'vertical',
    position: 'start',
    class: { container: 'mb-2' }
  }, {
    orientation: 'vertical',
    position: 'center',
    class: { container: 'my-2' }
  }, {
    orientation: 'vertical',
    position: 'end',
    class: { container: 'mt-2' }
  }],
  defaultVariants: {
    color: 'neutral',
    size: 'xs',
    type: 'solid'
  }
})
