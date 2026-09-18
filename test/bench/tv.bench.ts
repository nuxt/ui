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

// What components actually spread beside `extend`: Button always injects its
// `active` variants (`defu({ variants: { active } }, appConfig.ui?.button)`), the
// others spread `app.config.ui.<c>` when the user set one.
const buttonOverrides = { variants: { active: { true: { base: '' }, false: { base: '' } } } }
const tableOverrides = { slots: { td: 'p-1' } }
const navigationMenuOverrides = { slots: { link: 'font-medium' } }

// CodSpeed runs these under a simulator that counts instructions, and GitHub's
// hosted runners alternate between Intel and AMD CPUs whose cache sizes make
// glibc select different string routines. Anything under ~1ms picks up phantom
// regressions from that alone, so every bench body repeats its work enough to
// clear the bar. Scaling every group by the same factor keeps the ratios that
// these benchmarks exist to compare.
const ITERATIONS = 100

// Building the factory deep-merges the whole variant matrix, joins every slot
// and flattens compound variants. It happens inside each component's `computed`,
// so every variant-prop change re-runs it. `{ extend: theme }` alone is the
// shape the engine shares across rebuilds, so it measures the WeakMap hit; the
// `configured` cases spread `app.config.ui.<c>` in, the way every component
// does, and pay the resolve on each build.
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

  bench('button, configured', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv({ extend: buttonTheme, ...buttonOverrides })
    }
  })

  bench('navigation-menu, configured', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv({ extend: navigationMenuTheme, ...navigationMenuOverrides })
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

  // Button's real shape: `defu` injects `variants.active` on every build, so it
  // never hits the shared entry and resolves plus compiles each time.
  bench('button, configured', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const ui = tv({ extend: buttonTheme, ...buttonOverrides })(buttonProps)
      ui.base()
      ui.label()
    }
  })

  bench('table, configured', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const ui = tv({ extend: tableTheme, ...tableOverrides })(tableProps)
      ui.root()
      ui.td()
    }
  })
})

// Table renders call `ui.td(...)` once per cell. This models a 100-cell render,
// exercising the fingerprint, the cache lookup and the replacer scan on every
// slot call.
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
