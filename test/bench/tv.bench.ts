import { bench, describe } from 'vitest'
import { tv } from '../../src/runtime/utils/tv'
import buttonTheme from '#build/ui/button'
import navigationMenuTheme from '#build/ui/navigation-menu'
import tableTheme from '#build/ui/table'

// Representative invocation props for each component (mirrors the objects the
// components pass to `tv(...)(...)` at runtime).
const buttonProps = {
  color: 'primary',
  variant: 'solid',
  size: 'md',
  loading: false,
  block: false,
  square: false,
  leading: false,
  trailing: false
} as const
const tableProps = {
  sticky: false,
  loading: false,
  loadingColor: 'primary',
  loadingAnimation: 'carousel',
  externalScroll: false
} as const

// CodSpeed runs these under a simulator that counts instructions, and GitHub's
// hosted runners alternate between Intel and AMD CPUs whose cache sizes make
// glibc select different string routines. Anything under ~1ms picks up phantom
// regressions from that alone, so every bench body repeats its work enough to
// clear the bar. Scaling every group by the same factor keeps the ratios that
// these benchmarks exist to compare.
const ITERATIONS = 100

// Building the factory is the expensive step (deep-merges the whole variant
// matrix, joins every slot, flattens compound variants). Today it happens inside
// each component's `computed`, so every variant-prop change re-runs it.
describe('factory build', () => {
  bench('button (~6 slots)', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv({ extend: buttonTheme })
    }
  })

  bench('table (~13 slots)', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv({ extend: tableTheme })
    }
  })

  bench('navigation-menu (~31 slots)', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv({ extend: navigationMenuTheme })
    }
  })
})

// Invoking a prebuilt factory is the cheap step — this is all a variant-prop
// change should cost once the build is hoisted out of the invocation computed.
describe('invocation (prebuilt factory)', () => {
  const buttonFactory = tv({ extend: buttonTheme })
  const tableFactory = tv({ extend: tableTheme })

  bench('button', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      buttonFactory(buttonProps)
    }
  })

  bench('table', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tableFactory(tableProps)
    }
  })
})

// Build and invoke fused in one call, as every component does today. The gap
// between this and "invocation (prebuilt factory)" is the overhead saved by
// hoisting factory construction out of the per-variant-prop recomputation.
describe('build + invoke (current fused pattern)', () => {
  bench('button', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv({ extend: buttonTheme })(buttonProps)
    }
  })

  bench('table', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv({ extend: tableTheme })(tableProps)
    }
  })
})

// Table renders call `ui.td(...)` once per cell through the `wrapSlots` proxy.
// This models a 100-cell render, exercising the per-access wrapper-closure
// allocation and the replacer scan on every slot call.
describe('slot invocation', () => {
  const tableUi = tv({ extend: tableTheme })(tableProps)

  bench('td x100 (string class)', () => {
    for (let i = 0; i < 100; i++) {
      tableUi.td({ class: 'p-2', pinned: false })
    }
  })

  bench('td x100 (array class)', () => {
    for (let i = 0; i < 100; i++) {
      tableUi.td({ class: [undefined, 'p-2'], pinned: false })
    }
  })
})
