import { defineTheme } from '../utils/theme'

const horizontal = 'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none'
const vertical = 'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none'

export const fieldGroupVariant = {
  fieldGroup: {
    horizontal: { base: `${horizontal} focus-visible:z-[1]` },
    vertical: { base: `${vertical} focus-visible:z-[1]` }
  }
}

// Reka UI renders a hidden native `<select>` or `<input>` right after the trigger of `Select` and `SelectMenu` when they have a `name`,
// so the trigger is never the `:last-child` of the group, ignore these hidden elements to find the last item instead
export const fieldGroupVariantWithHiddenInput = {
  fieldGroup: {
    horizontal: { base: 'first:not-nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-e-none not-first:nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-s-none not-first:not-nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-none focus-visible:z-[1]' },
    vertical: { base: 'first:not-nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-b-none not-first:nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-t-none not-first:not-nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-none focus-visible:z-[1]' }
  }
}

// For a field whose `root` is a box around what takes the focus
export const fieldGroupVariantRoot = {
  fieldGroup: {
    horizontal: { root: `${horizontal} has-focus-visible:z-1` },
    vertical: { root: `${vertical} has-focus-visible:z-1` }
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
