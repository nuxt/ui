import { colorVariant } from '../color'
import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    base: 'group relative block px-4 py-3 rounded-md text-sm/6 my-5 last:mb-0 [&_code]:text-xs/5 [&_code]:bg-default [&_pre]:bg-default [&>div]:my-2.5 [&_ul]:my-2.5 [&_ol]:my-2.5 *:last:mb-0! [&_ul]:ps-4.5 [&_ol]:ps-4.5 [&_li]:my-0 transition-colors border',
    icon: 'size-4 shrink-0 align-sub me-2 inline-block transition-colors text-accent',
    externalIcon: 'size-4 align-top absolute end-2 top-2 pointer-events-none transition-colors text-accent-faint'
  },
  variants: {
    color: colorVariant({ base: 'border-accent-soft bg-accent-tint text-accent-default [&_a]:text-accent [&_a]:hover:border-accent [&_a]:outline-accent-focus [&_a]:focus-visible:outline-3 [&_a]:focus-visible:has-[>code]:outline-0 [&_code]:text-accent [&_code]:border-accent-soft [&_a]:[&>code]:outline-accent-focus [&_a]:hover:[&>code]:border-accent [&_a]:hover:[&>code]:text-accent [&_a]:focus-visible:[&>code]:border-accent [&_a]:focus-visible:[&>code]:text-accent [&>ul]:marker:text-accent-faint' }),
    to: {
      true: { base: 'border-dashed' }
    }
  },
  compoundVariants: [{
    to: true,
    class: {
      base: 'hover:border-accent outline-accent-focus has-[>a:focus-visible]:outline-3 has-[>a:focus-visible]:border-accent',
      externalIcon: 'group-hover:text-accent'
    }
  }],
  defaultVariants: {
    color: 'neutral'
  }
})
