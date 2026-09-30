import { colorVariant, colors } from '../color'
import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    base: 'group relative block px-4 py-3 rounded-md text-sm/6 my-5 last:mb-0 [&_code]:text-xs/5 [&_code]:bg-default [&_pre]:bg-default [&>div]:my-2.5 [&_ul]:my-2.5 [&_ol]:my-2.5 *:last:mb-0! [&_ul]:ps-4.5 [&_ol]:ps-4.5 [&_li]:my-0 transition-colors border',
    icon: 'size-4 shrink-0 align-sub me-2 inline-block transition-colors text-accent',
    externalIcon: 'size-4 align-top absolute end-2 top-2 pointer-events-none transition-colors text-accent-default'
  },
  variants: {
    color: {
      ...colorVariant({ base: 'border-accent-default bg-accent-soft text-accent-default [&_a]:text-accent [&_a]:hover:border-accent [&_a]:outline-accent-focus [&_a]:focus-visible:outline-3 [&_a]:focus-visible:has-[>code]:outline-0 [&_code]:text-accent-default [&_code]:border-accent-default [&_a]:[&>code]:outline-accent-focus [&_a]:hover:[&>code]:border-accent [&_a]:hover:[&>code]:text-accent [&_a]:focus-visible:[&>code]:border-accent [&_a]:focus-visible:[&>code]:text-accent [&>ul]:marker:text-accent-faint' }),
      // Neutral is the plain callout, not a variant of the colored one.
      neutral: {
        base: 'border-default bg-tint text-default',
        icon: 'text-strong',
        externalIcon: 'text-faint'
      }
    },
    to: {
      true: { base: 'border-dashed' }
    }
  },
  compoundVariants: [{
    color: colors.filter(color => color !== 'neutral'),
    to: true,
    class: {
      base: 'hover:border-accent outline-accent-focus has-[>a:focus-visible]:outline-3 has-[>a:focus-visible]:border-accent',
      externalIcon: 'group-hover:text-accent'
    }
  }, {
    color: 'neutral',
    to: true,
    class: {
      base: 'hover:border-neutral outline-focus has-[>a:focus-visible]:outline-3 has-[>a:focus-visible]:border-neutral',
      externalIcon: 'group-hover:text-strong'
    }
  }],
  defaultVariants: {
    color: 'neutral'
  }
})
