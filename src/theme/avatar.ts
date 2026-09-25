import { colorVariant } from './color'

export default {
  slots: {
    root: 'inline-flex items-center justify-center shrink-0 select-none rounded-full align-middle bg-accent-soft',
    image: 'h-full w-full rounded-[inherit] object-cover',
    fallback: 'font-medium truncate text-accent-muted',
    icon: 'shrink-0 text-accent-muted'
  },
  variants: {
    color: colorVariant({ root: '', fallback: '', icon: '' }),
    size: {
      '3xs': {
        root: 'size-4 text-[8px]'
      },
      '2xs': {
        root: 'size-5 text-[10px]'
      },
      'xs': {
        root: 'size-6 text-xs'
      },
      'sm': {
        root: 'size-7 text-sm'
      },
      'md': {
        root: 'size-8 text-base'
      },
      'lg': {
        root: 'size-9 text-lg'
      },
      'xl': {
        root: 'size-10 text-xl'
      },
      '2xl': {
        root: 'size-11 text-[22px]'
      },
      '3xl': {
        root: 'size-12 text-2xl'
      }
    }
  },
  defaultVariants: {
    size: 'md',
    color: 'neutral'
  }
}
