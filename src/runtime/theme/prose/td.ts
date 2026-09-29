import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    base: 'py-3 px-4 text-sm align-top border-e border-b first:border-s border-muted [&_code]:text-xs/5 [&_p]:my-0 [&_p]:leading-6 [&_ul]:my-0 [&_ol]:my-0 [&_ul]:ps-4.5 [&_ol]:ps-4.5 [&_li]:leading-6 [&_li]:my-0.5'
  },
  variants: {
    align: {
      left: { base: 'text-start' },
      center: { base: 'text-center' },
      right: { base: 'text-end' }
    }
  },
  defaultVariants: {
    align: 'left'
  }
})
