export const fieldGroupVariant = {
  fieldGroup: {
    horizontal: 'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]',
    vertical: 'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]'
  }
}

// Reka UI renders a hidden native `<select>` or `<input>` right after the trigger of `Select` and `SelectMenu` when they have a `name`,
// so the trigger is never the `:last-child` of the group, ignore these hidden elements to find the last item instead
export const fieldGroupVariantWithHiddenInput = {
  fieldGroup: {
    horizontal: 'first:not-nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-e-none not-first:nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-s-none not-first:not-nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-none focus-visible:z-[1]',
    vertical: 'first:not-nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-b-none not-first:nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-t-none not-first:not-nth-last-[1_of_:not(input[aria-hidden],select[aria-hidden])]:rounded-none focus-visible:z-[1]'
  }
}

export const fieldGroupVariantWithRoot = {
  fieldGroup: {
    horizontal: {
      root: 'group has-focus-visible:z-[1]',
      base: 'group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none'
    },
    vertical: {
      root: 'group has-focus-visible:z-[1]',
      base: 'group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none'
    }
  }
}

export default {
  base: 'relative',
  variants: {
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: ''
    },
    orientation: {
      horizontal: 'inline-flex -space-x-px',
      vertical: 'flex flex-col -space-y-px'
    }
  },
  defaultVariants: {
    size: 'md'
  }
}
