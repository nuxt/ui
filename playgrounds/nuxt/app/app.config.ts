export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    expand: true,
    duration: 5000
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  }
})
