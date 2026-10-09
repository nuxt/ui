import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'flex gap-1.5',
    item: 'group relative flex flex-1 gap-3',
    container: 'relative flex items-center gap-1.5',
    indicator: 'group-data-[state=completed]:text-accent-contrast group-data-[state=active]:text-accent-contrast text-muted bg-soft group-data-[state=completed]:bg-accent group-data-[state=active]:bg-accent',
    separator: 'flex-1 rounded-full bg-soft',
    wrapper: 'w-full',
    date: 'text-faint text-xs/5',
    title: 'font-medium text-strong text-sm',
    description: 'text-muted text-wrap text-sm'
  },

  variants: {
    orientation: {
      horizontal: {
        root: 'flex-row w-full',
        item: 'flex-col',
        separator: 'h-0.5',
        wrapper: 'pe-[calc(var(--ui-control-size)/2+(--spacing(2.5)))]'
      },
      vertical: {
        root: 'flex-col',
        container: 'flex-col',
        separator: 'w-0.5',
        wrapper: 'mt-[calc(var(--ui-control-size)/2-(--spacing(2.5)))] pb-[calc(var(--ui-control-size)/2+(--spacing(2.5)))]'
      }
    },

    color: colorVariant({ root: '', indicator: '' }),

    size: {
      '3xs': { root: '[--ui-control-size:--spacing(4)]' },
      '2xs': { root: '[--ui-control-size:--spacing(5)]' },
      'xs': { root: '[--ui-control-size:--spacing(6)]' },
      'sm': { root: '[--ui-control-size:--spacing(7)]' },
      'md': { root: '[--ui-control-size:--spacing(8)]' },
      'lg': { root: '[--ui-control-size:--spacing(9)]' },
      'xl': { root: '[--ui-control-size:--spacing(10)]' },
      '2xl': { root: '[--ui-control-size:--spacing(11)]' },
      '3xl': { root: '[--ui-control-size:--spacing(12)]' }
    },

    reverse: {
      true: {
        separator: 'group-data-[state=active]:bg-accent group-data-[state=completed]:bg-accent'
      },
      false: {
        separator: 'group-data-[state=completed]:bg-accent'
      }
    }
  },

  defaultVariants: {
    size: 'md',
    color: 'primary'
  }
})
