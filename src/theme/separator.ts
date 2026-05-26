import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex items-center align-center text-center',
    border: '',
    container: 'font-medium text-default flex',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    avatarSize: '2xs',
    label: 'text-sm'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, { border: `border-${color}` }])),
      neutral: { border: 'border-default' }
    },
    orientation: {
      horizontal: {
        root: 'w-full flex-row',
        border: 'w-full',
        container: 'whitespace-nowrap'
      },
      vertical: {
        root: 'h-full flex-col',
        border: 'h-full',
        container: ''
      }
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: ''
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
  }, {
    orientation: 'horizontal',
    size: 'xs',
    class: { border: 'border-t' }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: { border: 'border-t-[2px]' }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: { border: 'border-t-[3px]' }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: { border: 'border-t-[4px]' }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: { border: 'border-t-[5px]' }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: { border: 'border-s' }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: { border: 'border-s-[2px]' }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: { border: 'border-s-[3px]' }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: { border: 'border-s-[4px]' }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: { border: 'border-s-[5px]' }
  }],
  defaultVariants: {
    color: 'neutral',
    size: 'xs',
    type: 'solid'
  }
})
