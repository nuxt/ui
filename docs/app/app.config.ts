export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    expand: true,
    duration: 5000
  },
  theme: {
    radius: 0.25
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  }
})
