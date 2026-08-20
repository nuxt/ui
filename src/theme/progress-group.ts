import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'gap-2',
    base: 'flex overflow-hidden rounded-full bg-accented',
    segment: 'duration-200 ease-out motion-reduce:transition-none',
    indicator: 'size-full',
    status: 'flex text-dimmed duration-200 ease-out motion-reduce:transition-none',
    list: 'flex flex-col gap-1',
    item: 'flex items-center gap-1.5 min-w-0',
    itemLeadingIcon: 'shrink-0',
    itemLeadingDot: 'shrink-0 rounded-full',
    itemLabel: 'truncate',
    itemTrailing: 'ms-auto shrink-0 text-dimmed'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        indicator: `bg-${color}`,
        itemLeadingIcon: `text-${color}`,
        itemLeadingDot: `bg-${color}`
      }])),
      neutral: {
        indicator: 'bg-inverted',
        itemLeadingIcon: 'text-highlighted',
        itemLeadingDot: 'bg-inverted'
      }
    },
    size: {
      '2xs': {
        status: 'text-xs',
        list: 'text-xs',
        itemLeadingIcon: 'size-3',
        itemLeadingDot: 'size-1.5'
      },
      'xs': {
        status: 'text-xs',
        list: 'text-xs',
        itemLeadingIcon: 'size-3',
        itemLeadingDot: 'size-1.5'
      },
      'sm': {
        status: 'text-sm',
        list: 'text-sm',
        itemLeadingIcon: 'size-4',
        itemLeadingDot: 'size-2'
      },
      'md': {
        status: 'text-sm',
        list: 'text-sm',
        itemLeadingIcon: 'size-4',
        itemLeadingDot: 'size-2'
      },
      'lg': {
        status: 'text-sm',
        list: 'text-sm',
        itemLeadingIcon: 'size-4',
        itemLeadingDot: 'size-2'
      },
      'xl': {
        status: 'text-base',
        list: 'text-base',
        itemLeadingIcon: 'size-5',
        itemLeadingDot: 'size-2.5'
      },
      '2xl': {
        status: 'text-base',
        list: 'text-base',
        itemLeadingIcon: 'size-5',
        itemLeadingDot: 'size-2.5'
      }
    },
    orientation: {
      horizontal: {
        root: 'w-full flex flex-col',
        base: 'w-full flex-row',
        segment: 'h-full transition-[width]',
        status: 'flex-row items-center justify-end w-(--percent) min-w-fit transition-[width]'
      },
      vertical: {
        root: 'h-full flex flex-row',
        base: 'h-full flex-col',
        segment: 'w-full transition-[height]',
        status: 'flex-col justify-end h-(--percent) min-h-fit transition-[height]'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    size: '2xs',
    class: 'h-px'
  }, {
    orientation: 'horizontal',
    size: 'xs',
    class: 'h-0.5'
  }, {
    orientation: 'horizontal',
    size: 'sm',
    class: 'h-1'
  }, {
    orientation: 'horizontal',
    size: 'md',
    class: 'h-2'
  }, {
    orientation: 'horizontal',
    size: 'lg',
    class: 'h-3'
  }, {
    orientation: 'horizontal',
    size: 'xl',
    class: 'h-4'
  }, {
    orientation: 'horizontal',
    size: '2xl',
    class: 'h-5'
  }, {
    orientation: 'vertical',
    size: '2xs',
    class: 'w-px'
  }, {
    orientation: 'vertical',
    size: 'xs',
    class: 'w-0.5'
  }, {
    orientation: 'vertical',
    size: 'sm',
    class: 'w-1'
  }, {
    orientation: 'vertical',
    size: 'md',
    class: 'w-2'
  }, {
    orientation: 'vertical',
    size: 'lg',
    class: 'w-3'
  }, {
    orientation: 'vertical',
    size: 'xl',
    class: 'w-4'
  }, {
    orientation: 'vertical',
    size: '2xl',
    class: 'w-5'
  }],
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
