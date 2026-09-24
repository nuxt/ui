export default {
  slots: {
    root: [
      'relative w-full text-xs text-muted',
      '[--ts-chart-tooltip-background:var(--ui-bg)]',
      '[--ts-chart-tooltip-color:var(--ui-text-highlighted)]',
      '[--ts-chart-tooltip-border:1px_solid_var(--ui-border)]',
      '[--ts-chart-tooltip-border-radius:calc(var(--ui-radius)*1.5)]',
      '[--ts-chart-tooltip-shadow:var(--shadow-lg)]',
      '[--ts-chart-tooltip-padding:--spacing(2)]',
      '[--ts-chart-tooltip-font:inherit]'
    ],
    base: ''
  },
  variants: {
    type: {
      line: '',
      area: '',
      bar: ''
    }
  }
}
