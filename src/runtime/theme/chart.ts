import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    // The tooltip can sit under the pointer, and its popper wrapper would take the hover away from the chart.
    root: [
      'relative w-full text-xs text-muted **:data-reka-popper-content-wrapper:pointer-events-none',
      // The surface of the TanStack Charts tooltip, shown when a `definition` brings its own.
      '[--ts-chart-tooltip-background:var(--ui-bg)] [--ts-chart-tooltip-color:var(--ui-text-highlighted)] [--ts-chart-tooltip-border:1px_solid_var(--ui-border)] [--ts-chart-tooltip-border-radius:var(--radius-sm)] [--ts-chart-tooltip-shadow:var(--shadow-sm)] [--ts-chart-tooltip-padding:--spacing(1.5)_--spacing(2.5)] [--ts-chart-tooltip-font:inherit]'
    ],
    // The chart surface is focusable for keyboard navigation between points. Browsers outline a focused
    // `<svg>` on click too, so its width is zero until keyboard focus.
    base: 'opacity-0 in-data-measured:opacity-100 transition-opacity duration-150 [&_.ts-chart]:rounded-md [&_.ts-chart]:outline-0 [&_.ts-chart]:outline-primary/25 [&_.ts-chart:focus-visible]:outline-3 [&_.ts-chart:focus-visible]:ring [&_.ts-chart:focus-visible]:ring-primary',
    tooltip: 'flex-col items-stretch gap-1 h-auto min-w-32 py-1.5 pointer-events-none',
    tooltipTitle: 'font-medium text-highlighted',
    tooltipRow: 'flex items-center gap-1.5 text-muted data-[active=true]:text-highlighted',
    tooltipIndicator: 'size-2 shrink-0 rounded-full',
    tooltipLabel: 'truncate',
    tooltipValue: 'ms-auto ps-4 font-medium text-highlighted tabular-nums',
    center: 'absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0 in-data-measured:opacity-100 transition-opacity duration-150'
  },
  variants: {
    type: {
      line: '',
      area: '',
      bar: '',
      donut: ''
    }
  }
})
