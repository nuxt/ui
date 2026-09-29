import { colorVariant, colors } from '../color'
import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    base: 'group relative block px-4 py-3 rounded-md text-sm/6 my-5 last:mb-0 [&_code]:text-xs/5 [&_code]:bg-default [&_pre]:bg-default [&>div]:my-2.5 [&_ul]:my-2.5 [&_ol]:my-2.5 *:last:mb-0! [&_ul]:ps-4.5 [&_ol]:ps-4.5 [&_li]:my-0 transition-colors border',
    icon: 'size-4 shrink-0 align-sub me-2 inline-block transition-colors text-accent',
    externalIcon: 'size-4 align-top absolute end-2 top-2 pointer-events-none transition-colors text-accent-soft-foreground'
  },
  variants: {
    color: {
      ...colorVariant({ base: 'border-accent-border-soft bg-accent-soft text-accent-soft-foreground [&_a]:text-accent [&_a]:hover:border-accent [&_a]:outline-accent-focus [&_a]:focus-visible:outline-3 [&_a]:focus-visible:has-[>code]:outline-0 [&_code]:text-accent-soft-foreground [&_code]:border-accent-border-soft [&_a]:[&>code]:outline-accent-focus [&_a]:hover:[&>code]:border-accent [&_a]:hover:[&>code]:text-accent [&_a]:focus-visible:[&>code]:border-accent [&_a]:focus-visible:[&>code]:text-accent [&>ul]:marker:text-accent-border' }),
      // Neutral is the plain callout, not a variant of the colored one.
      neutral: {
        base: 'border-muted bg-muted text-default',
        icon: 'text-highlighted',
        externalIcon: 'text-dimmed'
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
      base: 'hover:border-inverted outline-inverted/25 has-[>a:focus-visible]:outline-3 has-[>a:focus-visible]:border-inverted',
      externalIcon: 'group-hover:text-highlighted'
    }
  }],
  defaultVariants: {
    color: 'neutral'
  }
})
