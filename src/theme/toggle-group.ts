import { fieldGroupVariantWithHiddenInput } from './field-group'

// Reka renders a hidden input after the items when the group has a `name`, so the rounding skips it like `Select`.
// The pressed item is lifted above its neighbors so its border shows, and the focused one above both.
export default {
  slots: {
    root: 'relative',
    item: ''
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'inline-flex items-center gap-1'
      },
      vertical: {
        root: 'flex flex-col gap-1'
      }
    },
    fieldGroup: {
      horizontal: {
        root: 'gap-0 -space-x-px',
        item: `${fieldGroupVariantWithHiddenInput.fieldGroup.horizontal} data-[state=on]:z-[1] focus-visible:z-[2]`
      },
      vertical: {
        root: 'gap-0 -space-y-px',
        item: `${fieldGroupVariantWithHiddenInput.fieldGroup.vertical} data-[state=on]:z-[1] focus-visible:z-[2]`
      }
    }
  }
}
