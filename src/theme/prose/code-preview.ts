export default {
  slots: {
    root: 'my-5',
    preview: 'flex justify-center border border-muted relative p-4 rounded-md',
    code: '[&>div>pre]:rounded-t-none [&>div]:my-0'
  },
  variants: {
    code: {
      true: {
        preview: 'border-b-0 rounded-b-none'
      }
    }
  }
}
