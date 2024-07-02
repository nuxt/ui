export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    expand: true,
    duration: 5000
  },
  ui: {
    colors: {
      primary: 'sky',
      gray: 'cool'
    }
  }
})
