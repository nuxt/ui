import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex gap-4',
    header: 'flex',
    item: 'group text-center relative w-full',
    content: 'size-full',
    trigger: '',
    wrapper: '',
    indicator: 'rounded-full font-medium text-center align-middle flex items-center justify-center group-data-[state=completed]:text-[var(--ui-bg)] group-data-[state=active]:text-[var(--ui-bg)] text-[var(--ui-text-muted)] bg-[var(--ui-bg-elevated)]',
    icon: 'shrink-0',
    separator: 'absolute rounded-full group-data-[disabled]:opacity-75 bg-[var(--ui-border-accented)]',
    title: 'font-medium text-[var(--ui-text)]',
    description: 'text-[var(--ui-text-muted)] text-wrap'
  },

  variants: {
    orientation: {
      horizontal: {
        root: 'flex-col',
        separator: 'top-[calc(50%-2px)] h-0.5',
        title: 'mt-1'
      },
      vertical: {
        header: 'flex-col gap-4',
        item: 'flex text-left gap-2',
        separator: 'left-[calc(50%-2px)] -bottom-[10px] w-0.5'
      }
    },

    size: {
      xs: {
        indicator: 'size-6 p-1 text-xs',
        icon: 'size-3',
        title: 'text-sm',
        description: 'text-xs'
      },
      sm: {
        indicator: 'size-8 p-1.5 text-sm',
        icon: 'size-4',
        title: 'text-sm',
        description: 'text-xs'
      },
      md: {
        indicator: 'size-10 text-base',
        icon: 'size-5',
        description: 'text-sm'
      },
      lg: {
        indicator: 'size-12 p-2 text-lg',
        icon: 'size-6',
        title: 'text-lg',
        description: 'text-base'
      },
      xl: {
        indicator: 'size-14 p-2 text-xl',
        icon: 'size-7',
        title: 'text-lg',
        description: 'text-base'
      }
    },

    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: `group-data-[state=completed]:bg-[var(--ui-${color})] group-data-[state=active]:bg-[var(--ui-${color})]`,
        separator: `group-data-[state=completed]:bg-[var(--ui-${color})]`
      }])),
      neutral: {
        indicator: `group-data-[state=completed]:bg-[var(--ui-bg-inverted)] group-data-[state=active]:bg-[var(--ui-bg-inverted)]`,
        separator: `group-data-[state=completed]:bg-[var(--ui-bg-inverted)]`
      }
    }
  },

  compoundVariants: [{
    orientation: 'horizontal',
    size: 'xs',
    class: { separator: 'left-[calc(50%+16px)] right-[calc(-50%+16px)]' }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: { separator: 'left-[calc(50%+20px)] right-[calc(-50%+20px)]' }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: { separator: 'left-[calc(50%+28px)] right-[calc(-50%+28px)]' }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: { separator: 'left-[calc(50%+32px)] right-[calc(-50%+32px)]' }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: { separator: 'left-[calc(50%+36px)] right-[calc(-50%+36px)]' }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: {
      separator: 'top-[30px]',
      title: 'mt-0.5'
    }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: {
      separator: 'top-[38px]',
      title: 'mt-1'
    }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: {
      separator: 'top-[46px]',
      title: 'mt-2'
    }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: {
      separator: 'top-[54px]',
      title: 'mt-2.5'
    }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: {
      separator: 'top-[62px]',
      title: 'mt-3.5'
    }
  }],

  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
    color: 'primary'
  }
})
