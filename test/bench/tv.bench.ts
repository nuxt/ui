import { bench, describe } from 'vitest'
import { tv } from '../../src/runtime/utils/tv'
import buttonTheme from '../../src/runtime/theme/button'
import navigationMenuTheme from '../../src/runtime/theme/navigation-menu'
import tableTheme from '../../src/runtime/theme/table'

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

// What components pass as overrides: `app.config.ui.<c>` when the user set one,
// and for Button its `active` variants folded in when `activeClass` is set.
const buttonOverrides = { variants: { active: { true: { base: 'font-bold' }, false: { base: '' } } } }
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
// so every variant-prop change re-runs it. The theme alone is a WeakMap hit,
// so this measures the shared path; the configured shapes are at the end.
describe('factory build', () => {
  bench('button (~6 slots)', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv(buttonTheme)
    }
  })

  bench('table (~13 slots)', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv(tableTheme)
    }
  })

  bench('navigation-menu (~31 slots)', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv(navigationMenuTheme)
    }
  })
})

// Invoking a prebuilt factory is the cheap step — this is all a variant-prop
// change should cost once the build is hoisted out of the invocation computed.
describe('invocation (prebuilt factory)', () => {
  const buttonFactory = tv(buttonTheme)
  const tableFactory = tv(tableTheme)

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
      tv(buttonTheme)(buttonProps)
    }
  })

  bench('table', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv(tableTheme)(tableProps)
    }
  })
})

// Table renders call `ui.td(...)` once per cell. This models a 100-cell render,
// exercising the fingerprint, the cache lookup and the replacer scan on every
// slot call.
describe('slot invocation', () => {
  const tableUi = tv(tableTheme)(tableProps)

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

// The shapes components call with an `app.config.ui.<c>` override, which the
// engine keys by content: the cost here is the key, not a fresh spec. Last on
// purpose, from when these built a fresh spec per iteration: the garbage they
// left made the CodSpeed runner's forced GC flush the JIT code of whatever was
// measured next, a 20x regression on the slot-invocation benches.
describe('configured shapes', () => {
  bench('factory build: button', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv(buttonTheme, buttonOverrides)
    }
  })

  bench('factory build: navigation-menu', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      tv(navigationMenuTheme, navigationMenuOverrides)
    }
  })

  // Button with `activeClass` set, the shape that used to resolve and compile
  // a fresh spec on every build.
  bench('build + invoke: button', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const ui = tv(buttonTheme, buttonOverrides)(buttonProps)
      ui.base()
      ui.label()
    }
  })

  bench('build + invoke: table', () => {
    for (let i = 0; i < ITERATIONS; i++) {
      const ui = tv(tableTheme, tableOverrides)(tableProps)
      ui.root()
      ui.td()
    }
  })
})
