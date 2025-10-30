export default defineAppConfig({
  dir: 'ltr' as 'ltr' | 'rtl',
  toaster: {
    position: 'bottom-right' as const,
    duration: 5000,
    max: 5,
    expand: true,
    disableSwipe: false
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  }
})
