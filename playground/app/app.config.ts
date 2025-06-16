export default defineAppConfig({
  toaster: {
    position: 'bottom-right',
    expand: true,
    duration: 5000
  },
  overlay: {
    class: 'origin-top transition-transform duration-100',
    style: {
      '--overlay-value': 'calc(var(--overlay-count) - var(--overlay-index) - 1)',
      'scale': 'calc(100% - 5% * var(--overlay-value))',
      'translate': 'var(--tw-translate-x) calc(-1.25rem * var(--overlay-value))'
    }
  },
  ui: {
    colors: {
      primary: 'green',
      neutral: 'slate'
    }
  }
})
