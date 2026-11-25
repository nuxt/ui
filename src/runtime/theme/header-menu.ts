import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    // The `inline` menu, under the header which stays above it. The component sets its `top` to
    // where the header ends when it opens, the header height is the fallback.
    root: 'fixed inset-x-0 bottom-0 top-(--ui-header-height) z-40 flex flex-col bg-overlay lg:hidden',
    // The Modal, Slideover or Drawer of the other modes
    overlay: 'lg:hidden',
    content: 'lg:hidden',
    body: 'flex-1 p-(--ui-gutter) overflow-y-auto'
  }
})
