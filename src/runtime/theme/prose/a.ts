import { defineTheme } from '../../utils/theme'

// Inline code in a link is opaque, `bg-tint` painted over `bg-default`, so the
// link's underline doesn't show through it.
export default defineTheme({
  slots: {
    base: 'text-primary border-b border-transparent hover:border-primary font-medium rounded-xs outline-focus focus-visible:outline-3 focus-visible:has-[>code]:outline-0 [&>code]:border-dashed [&>code]:bg-default [&>code]:bg-linear-to-b [&>code]:from-tint [&>code]:to-tint [&>code]:outline-focus focus-visible:[&>code]:outline-3 hover:[&>code]:border-primary hover:[&>code]:text-primary focus-visible:[&>code]:border-primary focus-visible:[&>code]:text-primary transition-colors [&>code]:transition-colors'
  }
})
