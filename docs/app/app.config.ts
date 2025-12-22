export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    duration: 5000,
    max: 5,
    expand: true
  },
  theme: {
    radius: 0.25,
    blackAsPrimary: false,
    icons: 'lucide',
    font: 'Public Sans'
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  }
})
