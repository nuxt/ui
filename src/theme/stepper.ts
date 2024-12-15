import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex gap-4',
    header: 'flex',
    item: 'group text-center relative w-full',
    container: 'relative',
    trigger: 'rounded-full font-medium text-center align-middle flex items-center justify-center font-semibold group-data-[state=completed]:text-[var(--ui-bg)] group-data-[state=active]:text-[var(--ui-bg)] text-[var(--ui-text-muted)] bg-[var(--ui-bg-elevated)] focus-visible:outline-2 focus-visible:outline-offset-2',
    indicator: 'flex items-center justify-center size-full',
    icon: 'shrink-0',
    separator: 'absolute rounded-full group-data-[disabled]:opacity-75 bg-[var(--ui-border-accented)]',
    wrapper: '',
    title: 'font-medium text-[var(--ui-text)]',
    description: 'text-[var(--ui-text-muted)] text-wrap',
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
        item: 'flex text-start',
        separator: 'start-[calc(50%-1px)] -bottom-[10px] w-0.5'
      }
    },

    size: {
      xs: {
        trigger: 'size-6 text-xs',
        icon: 'size-3',
        title: 'text-xs',
        description: 'text-xs',
        wrapper: 'mt-1.5'
      },
      sm: {
        trigger: 'size-8 text-sm',
        icon: 'size-4',
        title: 'text-xs',
        description: 'text-xs',
        wrapper: 'mt-2'
      },
      md: {
        trigger: 'size-10 text-base',
        icon: 'size-5',
        title: 'text-sm',
        description: 'text-sm',
        wrapper: 'mt-2.5'
      },
      lg: {
        trigger: 'size-12 text-lg',
        icon: 'size-6',
        title: 'text-base',
        description: 'text-base',
        wrapper: 'mt-3'
      },
      xl: {
        trigger: 'size-14 text-xl',
        icon: 'size-7',
        title: 'text-lg',
        description: 'text-lg',
        wrapper: 'mt-3.5'
      }
    },

    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        trigger: `group-data-[state=completed]:bg-[var(--ui-${color})] group-data-[state=active]:bg-[var(--ui-${color})] focus-visible:outline-[var(--ui-${color})]`,
        separator: `group-data-[state=completed]:bg-[var(--ui-${color})]`
      }])),
      neutral: {
        trigger: `group-data-[state=completed]:bg-[var(--ui-bg-inverted)] group-data-[state=active]:bg-[var(--ui-bg-inverted)] focus-visible:outline-[var(--ui-border-inverted)]`,
        separator: `group-data-[state=completed]:bg-[var(--ui-bg-inverted)]`
      }
    }
  },

  compoundVariants: [{
    orientation: 'horizontal',
    size: 'xs',
    class: { separator: 'start-[calc(50%+16px)] end-[calc(-50%+16px)]' }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: { separator: 'start-[calc(50%+20px)] end-[calc(-50%+20px)]' }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: { separator: 'start-[calc(50%+28px)] end-[calc(-50%+28px)]' }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: { separator: 'start-[calc(50%+32px)] end-[calc(-50%+32px)]' }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: { separator: 'start-[calc(50%+36px)] end-[calc(-50%+36px)]' }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: { separator: 'top-[30px]', item: 'gap-1.5' }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: { separator: 'top-[38px]', item: 'gap-2' }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: { separator: 'top-[46px]', item: 'gap-2.5' }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: { separator: 'top-[54px]', item: 'gap-3' }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: { separator: 'top-[62px]', item: 'gap-3.5' }
  }],

  defaultVariants: {
    orientation: 'horizontal',
    size: 'md',
    color: 'primary'
  }
})
