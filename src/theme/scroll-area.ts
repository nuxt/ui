import type { ModuleOptions } from '../module'

export default (_options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative overflow-auto',
    viewport: 'relative',
    item: 'min-w-0 shrink-0 basis-full'
  },
  variants: {
    orientation: {
      vertical: {
        root: 'overflow-y-auto overflow-x-hidden'
      },
      horizontal: {
        root: 'overflow-x-auto overflow-y-hidden flex'
      }
    }
  }
})
