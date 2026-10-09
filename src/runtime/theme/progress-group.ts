import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'gap-2',
    base: 'flex overflow-hidden rounded-full bg-strong',
    segment: 'duration-200 ease-out motion-reduce:transition-none',
    indicator: 'size-full',
    status: 'flex text-faint duration-200 ease-out motion-reduce:transition-none',
    list: 'flex flex-col gap-1',
    item: 'flex items-center gap-1.5 min-w-0',
    itemLeadingIcon: 'shrink-0',
    itemLeadingDot: 'shrink-0 rounded-full',
    itemLabel: 'truncate',
    itemTrailing: 'ms-auto shrink-0 text-faint'
  },
  variants: {
    color: colorVariant({ indicator: 'bg-accent', itemLeadingIcon: 'text-accent', itemLeadingDot: 'bg-accent' }),
    size: {
      '2xs': {
        root: '[--ui-control-thickness:1px]',
        status: 'text-xs',
        list: 'text-xs',
        itemLeadingIcon: 'size-3',
        itemLeadingDot: 'size-1.5'
      },
      'xs': {
        root: '[--ui-control-thickness:--spacing(0.5)]',
        status: 'text-xs',
        list: 'text-xs',
        itemLeadingIcon: 'size-3',
        itemLeadingDot: 'size-1.5'
      },
      'sm': {
        root: '[--ui-control-thickness:--spacing(1)]',
        status: 'text-sm',
        list: 'text-sm',
        itemLeadingIcon: 'size-4',
        itemLeadingDot: 'size-2'
      },
      'md': {
        root: '[--ui-control-thickness:--spacing(2)]',
        status: 'text-sm',
        list: 'text-sm',
        itemLeadingIcon: 'size-4',
        itemLeadingDot: 'size-2'
      },
      'lg': {
        root: '[--ui-control-thickness:--spacing(3)]',
        status: 'text-sm',
        list: 'text-sm',
        itemLeadingIcon: 'size-4',
        itemLeadingDot: 'size-2'
      },
      'xl': {
        root: '[--ui-control-thickness:--spacing(4)]',
        status: 'text-base',
        list: 'text-base',
        itemLeadingIcon: 'size-5',
        itemLeadingDot: 'size-2.5'
      },
      '2xl': {
        root: '[--ui-control-thickness:--spacing(5)]',
        status: 'text-base',
        list: 'text-base',
        itemLeadingIcon: 'size-5',
        itemLeadingDot: 'size-2.5'
      }
    },
    orientation: {
      horizontal: {
        root: 'w-full flex flex-col',
        base: 'w-full h-(--ui-control-thickness) flex-row',
        segment: 'h-full transition-[width]',
        status: 'flex-row items-center justify-end w-(--percent) min-w-fit transition-[width]'
      },
      vertical: {
        root: 'h-full flex flex-row',
        base: 'h-full w-(--ui-control-thickness) flex-col',
        segment: 'w-full transition-[height]',
        status: 'flex-col justify-end h-(--percent) min-h-fit transition-[height]'
      }
    }
  },
  defaultVariants: {
    color: 'primary',
    size: 'md'
  }
})
