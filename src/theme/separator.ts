import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex items-center align-center text-center',
    border: '',
    container: 'font-medium text-[var(--ui-text)] flex',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    avatarSize: '2xs',
    label: 'text-sm'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, { border: `border-[var(--ui-${color})]` }])),
      neutral: { border: 'border-[var(--ui-border)]' }
    },
    orientation: {
      horizontal: {
        root: 'w-full flex-row',
        border: 'w-full',
        container: 'mx-3 whitespace-nowrap'
      },
      vertical: {
        root: 'h-full flex-col',
        border: 'h-full',
        container: 'my-2'
      }
    },
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: ''
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
