export default defineAppConfig({
  toaster: {
    position: 'bottom-right' as const,
    expand: true,
    duration: 5000
  },
  overlay: {
    class: 'origin-top transition-transform duration-600',
    style: {
      '--overlay-value': 'calc(var(--overlay-count) - var(--overlay-index) - 1)',
      'scale': 'calc(100% - 5% * var(--overlay-value))',
      'transform': 'translateY(calc(-1.25rem * var(--overlay-value)))'
    }
  },
  theme: {
    radius: 0.25,
    blackAsPrimary: false
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  }
})
