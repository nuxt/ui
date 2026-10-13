import { defineTheme } from '../utils/theme'

const horizontal = 'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none'
const vertical = 'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none'

export const fieldGroupVariant = {
  fieldGroup: {
    horizontal: { base: `${horizontal} focus-visible:z-[1]` },
    vertical: { base: `${vertical} focus-visible:z-[1]` }
  }
}

// For a field whose `root` is a box around what takes the focus: a native
// element, or the segments of an InputDate
export const fieldGroupVariantRoot = {
  fieldGroup: {
    horizontal: { root: `${horizontal} has-[>:focus-visible]:z-1` },
    vertical: { root: `${vertical} has-[>:focus-visible]:z-1` }
  }
}

export default defineTheme({
  slots: {
    root: 'relative'
  },
  variants: {
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: ''
    },
    orientation: {
      horizontal: { root: 'inline-flex -space-x-px' },
      vertical: { root: 'flex flex-col -space-y-px' }
    }
  },
  defaultVariants: {
    size: 'md'
  }
})
