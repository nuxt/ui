import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative flex flex-wrap items-center gap-2 border border-default dark:border-strong bg-tint rounded-md px-4 py-3 my-5 last:mb-0',
    icon: 'size-4 shrink-0 text-strong',
    content: 'min-w-0',
    description: 'text-sm/6 text-default font-medium',
    actions: 'flex flex-wrap items-center gap-1.5 ms-auto'
  }
})
