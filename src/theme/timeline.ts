import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'flex gap-4',
    header: 'flex',
    item: 'group text-center relative w-full',
    itemContainer: 'relative',
    itemIndicatorWrapper: 'rounded-full font-medium text-center align-middle flex items-center justify-center font-semibold group-data-[state=completed]:text-inverted group-data-[state=active]:text-inverted text-muted bg-elevated',
    itemIndicator: 'flex items-center justify-center size-full',
    itemIcon: 'shrink-0',
    itemLeadingAvatar: 'shrink-0',
    itemLeadingAvatarSize: '',
    itemSeparator: 'absolute rounded-full group-data-[disabled]:opacity-75 bg-accented',
    itemWrapper: '',
    itemTitle: 'font-medium text-default',
    itemDescription: 'text-muted text-wrap'
  },

  variants: {
    orientation: {
      horizontal: {
        root: 'flex-col',
        itemContainer: 'flex justify-center',
        itemSeparator: 'top-[calc(50%-2px)] h-0.5',
        itemWrapper: 'mt-1'
      },
      vertical: {
        header: 'flex-col gap-4',
        item: 'flex text-start',
        itemSeparator: 'start-[calc(50%-1px)] -bottom-[10px] w-0.5'
      }
    },

    size: {
      xs: {
        itemIndicatorWrapper: 'size-6 text-xs',
        icon: 'size-3',
        itemLeadingAvatarSize: '2xs',
        itemTitle: 'text-xs',
        itemDescription: 'text-xs',
        itemWrapper: 'mt-1.5'
      },
      sm: {
        itemIndicatorWrapper: 'size-8 text-sm',
        icon: 'size-4',
        itemLeadingAvatarSize: 'sm',
        itemTitle: 'text-xs',
        itemDescription: 'text-xs',
        itemWrapper: 'mt-2'
      },
      md: {
        itemIndicatorWrapper: 'size-10 text-base',
        icon: 'size-5',
        itemLeadingAvatarSize: 'lg',
        itemTitle: 'text-sm',
        itemDescription: 'text-sm',
        itemWrapper: 'mt-2.5'
      },
      lg: {
        itemIndicatorWrapper: 'size-12 text-lg',
        icon: 'size-6',
        itemLeadingAvatarSize: '2xl',
        itemTitle: 'text-base',
        itemDescription: 'text-base',
        itemWrapper: 'mt-3'
      },
      xl: {
        itemIndicatorWrapper: 'size-14 text-xl',
        icon: 'size-7',
        itemLeadingAvatarSize: '3xl',
        itemTitle: 'text-lg',
        itemDescription: 'text-lg',
        itemWrapper: 'mt-3.5'
      }
    },

    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        itemIndicatorWrapper: `group-data-[state=completed]:bg-${color} group-data-[state=active]:bg-${color} focus-visible:outline-${color}`,
        itemSeparator: `group-data-[state=completed]:bg-${color}`
      }])),
      neutral: {
        itemIndicatorWrapper: `group-data-[state=completed]:bg-inverted group-data-[state=active]:bg-inverted focus-visible:outline-inverted`,
        itemSeparator: `group-data-[state=completed]:bg-inverted`
      }
    }
  },

  compoundVariants: [{
    orientation: 'horizontal',
    size: 'xs',
    class: { itemSeparator: 'start-[calc(50%+16px)] end-[calc(-50%+16px)]' }
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: { itemSeparator: 'start-[calc(50%+20px)] end-[calc(-50%+20px)]' }
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: { itemSeparator: 'start-[calc(50%+28px)] end-[calc(-50%+28px)]' }
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: { itemSeparator: 'start-[calc(50%+32px)] end-[calc(-50%+32px)]' }
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: { itemSeparator: 'start-[calc(50%+36px)] end-[calc(-50%+36px)]' }
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: { itemSeparator: 'top-[30px]', item: 'gap-1.5' }
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: { itemSeparator: 'top-[38px]', item: 'gap-2' }
  }, {
    orientation: 'vertical',
    size: 'md',
    class: { itemSeparator: 'top-[46px]', item: 'gap-2.5' }
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: { itemSeparator: 'top-[54px]', item: 'gap-3' }
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: { itemSeparator: 'top-[62px]', item: 'gap-3.5' }
  }],

  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
