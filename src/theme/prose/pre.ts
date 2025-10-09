export default {
  slots: {
    root: 'relative my-5 group',
    header: 'flex items-center gap-1.5 border border-muted bg-default border-b-0 relative rounded-t-md px-4 py-3',
    filename: 'text-default text-sm/6',
    icon: 'size-4 shrink-0',
    copy: 'absolute top-[11px] right-[11px] lg:opacity-0 lg:group-hover:opacity-100 transition',
    base: 'group font-mono text-sm/6 border border-muted bg-muted rounded-md px-4 py-3 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none'
  },
  variants: {
    filename: {
      true: {
        root: '[&>pre]:rounded-t-none [&>pre]:my-0 my-5'
      }
    }
  }
}
