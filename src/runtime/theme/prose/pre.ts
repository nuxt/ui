import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative my-5 group',
    header: 'flex items-center gap-1.5 border border-default dark:border-strong bg-default border-b-0 relative rounded-t-md px-4 py-3',
    filename: 'text-default text-sm/6',
    icon: 'size-4 shrink-0',
    copy: 'absolute top-[11px] end-[11px] lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100 transition',
    base: 'group font-mono text-sm/6 border border-default dark:border-strong bg-tint rounded-md px-4 py-3 whitespace-pre-wrap wrap-break-word overflow-x-auto outline-focus focus-visible:outline-3 focus-visible:border-primary **:[.line]:block **:[.line.highlight]:-mx-4 **:[.line.highlight]:px-4 **:[.line.highlight]:bg-soft!'
  },
  variants: {
    filename: {
      true: {
        root: '[&>pre]:rounded-t-none [&>pre]:my-0 my-5'
      }
    }
  }
})
