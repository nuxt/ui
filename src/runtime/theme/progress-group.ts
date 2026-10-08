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
    itemLeadingIcon: 'shrink-0 size-(--ui-control-icon)',
    itemLeadingDot: 'shrink-0 rounded-full size-(--ui-control-size)',
    itemLabel: 'truncate',
    itemTrailing: 'ms-auto shrink-0 text-faint'
  },
  variants: {
    color: colorVariant({ indicator: 'bg-accent', itemLeadingIcon: 'text-accent', itemLeadingDot: 'bg-accent' }),
    size: {
      '2xs': {
        root: '[--ui-control-thickness:1px] [--ui-control-icon:--spacing(3)] [--ui-control-size:--spacing(1.5)]',
        status: 'text-xs',
        list: 'text-xs'
      },
      'xs': {
        root: '[--ui-control-thickness:--spacing(0.5)] [--ui-control-icon:--spacing(3)] [--ui-control-size:--spacing(1.5)]',
        status: 'text-xs',
        list: 'text-xs'
      },
      'sm': {
        root: '[--ui-control-thickness:--spacing(1)] [--ui-control-icon:--spacing(4)] [--ui-control-size:--spacing(2)]',
        status: 'text-sm',
        list: 'text-sm'
      },
      'md': {
        root: '[--ui-control-thickness:--spacing(2)] [--ui-control-icon:--spacing(4)] [--ui-control-size:--spacing(2)]',
        status: 'text-sm',
        list: 'text-sm'
      },
      'lg': {
        root: '[--ui-control-thickness:--spacing(3)] [--ui-control-icon:--spacing(4)] [--ui-control-size:--spacing(2)]',
        status: 'text-sm',
        list: 'text-sm'
      },
      'xl': {
        root: '[--ui-control-thickness:--spacing(4)] [--ui-control-icon:--spacing(5)] [--ui-control-size:--spacing(2.5)]',
        status: 'text-base',
        list: 'text-base'
      },
      '2xl': {
        root: '[--ui-control-thickness:--spacing(5)] [--ui-control-icon:--spacing(5)] [--ui-control-size:--spacing(2.5)]',
        status: 'text-base',
        list: 'text-base'
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
