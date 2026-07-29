<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
import { blendColors, contrastRatio } from '@nuxt/ui-theme-studio/engine'

/**
 * WCAG contrast matrix for the current theme, read from the live computed
 * custom properties — the resolved ground truth.
 */
const FOREGROUNDS = [
  { token: '--ui-text-highlighted', label: 'Highlighted' },
  { token: '--ui-text', label: 'Text' },
  { token: '--ui-text-toned', label: 'Toned' },
  { token: '--ui-text-muted', label: 'Muted' },
  { token: '--ui-text-dimmed', label: 'Dimmed' },
  { token: '--ui-primary', label: 'Primary' },
  { token: '--ui-secondary', label: 'Secondary' },
  { token: '--ui-success', label: 'Success' },
  { token: '--ui-info', label: 'Info' },
  { token: '--ui-warning', label: 'Warning' },
  { token: '--ui-error', label: 'Error' }
]

const BACKGROUNDS = [
  { token: '--ui-bg', label: 'Default' },
  { token: '--ui-bg-muted', label: 'Muted' },
  { token: '--ui-bg-elevated', label: 'Elevated' },
  { token: '--ui-bg-accented', label: 'Accented' },
  { token: '--ui-bg-inverted', label: 'Inverted' }
]

/** Solid surfaces (buttons, badges) render --ui-text-inverted on the alias. */
const SOLIDS = FOREGROUNDS.slice(5)

// Tinted variants measure the composited pixel (alias alpha over the page),
// not the alias against a surface it never touches.
const VARIANTS = ['solid', 'outline', 'soft', 'subtle', 'ghost', 'link'] as const

const VARIANT_COLORS: Array<{ key: NonNullable<ButtonProps['color']>, label: string, icon: string }> = [
  { key: 'primary', label: 'Primary', icon: 'i-lucide-rocket' },
  { key: 'secondary', label: 'Secondary', icon: 'i-lucide-sparkles' },
  { key: 'success', label: 'Success', icon: 'i-lucide-circle-check' },
  { key: 'info', label: 'Info', icon: 'i-lucide-info' },
  { key: 'warning', label: 'Warning', icon: 'i-lucide-triangle-alert' },
  { key: 'error', label: 'Error', icon: 'i-lucide-circle-x' },
  { key: 'neutral', label: 'Neutral', icon: 'i-lucide-settings' }
]

interface Cell {
  fg: string
  bg: string
  ratio: number | null
}

const matrix = ref<Cell[][]>([])
const solidRow = ref<Cell[]>([])
const variantMatrix = ref<Cell[][]>([])

function resolveToken(styles: CSSStyleDeclaration, token: string): string {
  return styles.getPropertyValue(token).trim()
}

function compute() {
  if (!import.meta.client) return
  const styles = getComputedStyle(document.documentElement)

  matrix.value = FOREGROUNDS.map(fg => BACKGROUNDS.map((bg) => {
    const fgColor = resolveToken(styles, fg.token)
    const bgColor = resolveToken(styles, bg.token)
    return { fg: fgColor, bg: bgColor, ratio: contrastRatio(fgColor, bgColor) }
  }))

  const inverted = resolveToken(styles, '--ui-text-inverted')
  solidRow.value = SOLIDS.map((solid) => {
    const bgColor = resolveToken(styles, solid.token)
    return { fg: inverted, bg: bgColor, ratio: contrastRatio(inverted, bgColor) }
  })

  const page = resolveToken(styles, '--ui-bg')
  // Alpha of a token over the page background — `bg-primary/10` as a pixel.
  const tint = (token: string, alpha: number) => blendColors(resolveToken(styles, token), page, alpha) ?? ''

  variantMatrix.value = VARIANT_COLORS.map(({ key }) => {
    const specs = key === 'neutral'
      ? neutralSpecs(styles, page, inverted)
      : semanticSpecs(styles, `--ui-${key}`, page, inverted, tint)

    return specs.map(spec => ({ ...spec, ratio: contrastRatio(spec.fg, spec.bg) }))
  })
}

/** Per-variant fg/bg for a semantic alias, in VARIANTS order. */
function semanticSpecs(
  styles: CSSStyleDeclaration,
  token: string,
  page: string,
  inverted: string,
  tint: (token: string, alpha: number) => string
): Array<Omit<Cell, 'ratio'>> {
  const color = resolveToken(styles, token)
  const tinted = tint(token, 0.1)
  return [
    { fg: inverted, bg: color },
    { fg: color, bg: page },
    { fg: color, bg: tinted },
    { fg: color, bg: tinted },
    { fg: color, bg: page },
    { fg: color, bg: page }
  ]
}

/** Neutral resolves to surface/text tokens rather than a semantic alias. */
function neutralSpecs(styles: CSSStyleDeclaration, page: string, inverted: string): Array<Omit<Cell, 'ratio'>> {
  const text = resolveToken(styles, '--ui-text')
  const elevated = resolveToken(styles, '--ui-bg-elevated')
  return [
    { fg: inverted, bg: resolveToken(styles, '--ui-bg-inverted') },
    { fg: text, bg: page },
    { fg: text, bg: elevated },
    { fg: text, bg: elevated },
    { fg: text, bg: page },
    { fg: resolveToken(styles, '--ui-text-muted'), bg: page }
  ]
}

// The theme applies through <style> tags useHead swaps asynchronously —
// recompute a beat after any state that feeds them changes.
const colorMode = useColorMode()
const appConfig = useAppConfig()
// the owning composable's refs — never re-seed these channels here
const { cssVariablesData, customColorsData } = useTheme()

// useHead swaps the style tags asynchronously: wait a tick for the vnodes,
// then two frames so the new sheets are applied before reading computed
// styles — deterministic, unlike a wall-clock delay.
let pending = 0
let queued = false
function scheduleCompute() {
  cancelAnimationFrame(pending)
  // one queued tick at a time — curve drags would otherwise stack nextTick
  // callbacks, each spawning its own rAF chain
  if (queued) return
  queued = true
  nextTick(() => {
    queued = false
    pending = requestAnimationFrame(() => {
      pending = requestAnimationFrame(compute)
    })
  })
}

watch([() => colorMode.value, () => ({ ...appConfig.ui.colors }), cssVariablesData, customColorsData], scheduleCompute)

onMounted(compute)
onUnmounted(() => cancelAnimationFrame(pending))

function level(ratio: number | null): { label: string, color: 'success' | 'warning' | 'error' | 'neutral' } {
  // Unparseable color — signal unknown rather than a fabricated pass/fail.
  if (ratio === null) return { label: 'Unknown', color: 'neutral' }
  if (ratio >= 7) return { label: 'AAA', color: 'success' }
  if (ratio >= 4.5) return { label: 'AA', color: 'success' }
  if (ratio >= 3) return { label: 'AA18', color: 'warning' }
  return { label: 'Fail', color: 'error' }
}

/** Ratio display: numeric to 1 decimal, or an em dash when unmeasurable. */
function formatRatio(ratio: number | null): string {
  return ratio === null ? '—' : ratio.toFixed(1)
}
</script>

<template>
  <div class="h-full overflow-y-auto p-4 sm:p-6">
    <div class="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h2 class="text-sm font-semibold text-highlighted mb-1">
          Text on surfaces
        </h2>
        <p class="text-xs text-muted mb-4">
          WCAG 2.x contrast for every text role against every surface token, resolved from the live theme.
          AA needs 4.5:1 (3:1 for large text), AAA needs 7:1.
        </p>

        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr>
                <th class="text-left font-medium text-muted p-2" />
                <th v-for="bg in BACKGROUNDS" :key="bg.token" class="text-left font-medium text-muted p-2">
                  {{ bg.label }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(fg, row) in FOREGROUNDS" :key="fg.token">
                <th class="text-left font-medium text-muted p-2 whitespace-nowrap">
                  {{ fg.label }}
                </th>
                <td v-for="(bg, col) in BACKGROUNDS" :key="bg.token" class="p-1">
                  <div
                    v-if="matrix[row]?.[col]"
                    class="rounded-md px-2.5 py-2 flex items-center justify-between gap-2 ring ring-default"
                    :style="{ backgroundColor: matrix[row][col].bg }"
                  >
                    <span class="font-semibold" :style="{ color: matrix[row][col].fg }">Aa</span>
                    <span class="flex items-center gap-1.5">
                      <span class="tabular-nums font-mono opacity-80" :style="{ color: matrix[row][col].fg }">
                        {{ formatRatio(matrix[row][col].ratio) }}
                      </span>
                      <UBadge :label="level(matrix[row][col].ratio).label" :color="level(matrix[row][col].ratio).color" variant="solid" size="sm" />
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 class="text-sm font-semibold text-highlighted mb-1">
          Inverted text on solid surfaces
        </h2>
        <p class="text-xs text-muted mb-4">
          What solid buttons and badges render: the inverted text token on each semantic color.
        </p>

        <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
          <div
            v-for="(cell, index) in solidRow"
            :key="SOLIDS[index]!.token"
            class="rounded-md px-2.5 py-3 flex flex-col gap-1.5 ring ring-default"
            :style="{ backgroundColor: cell.bg }"
          >
            <span class="text-xs font-semibold" :style="{ color: cell.fg }">{{ SOLIDS[index]!.label }}</span>
            <span class="flex items-center gap-1.5">
              <span class="text-xs tabular-nums font-mono opacity-80" :style="{ color: cell.fg }">
                {{ formatRatio(cell.ratio) }}
              </span>
              <UBadge :label="level(cell.ratio).label" :color="level(cell.ratio).color" variant="solid" size="sm" />
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-sm font-semibold text-highlighted mb-1">
          Button &amp; badge variants
        </h2>
        <p class="text-xs text-muted mb-4">
          Every color × variant as it paints on the page background — tinted variants are measured against the
          composited pixel, not the raw alias.
        </p>

        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr>
                <th class="text-left font-medium text-muted p-2" />
                <th v-for="variant in VARIANTS" :key="variant" class="text-left font-medium text-muted p-2 capitalize">
                  {{ variant }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(color, row) in VARIANT_COLORS" :key="color.key">
                <th class="text-left font-medium text-muted p-2 whitespace-nowrap">
                  {{ color.label }}
                </th>
                <td v-for="(variant, col) in VARIANTS" :key="variant" class="p-1 align-top">
                  <UButton
                    v-if="variantMatrix[row]?.[col]"
                    as="span"
                    :color="color.key"
                    :variant="variant"
                    :icon="color.icon"
                    block
                    :label="formatRatio(variantMatrix[row][col].ratio)"
                    size="sm"
                    :ui="{ label: 'font-mono tabular-nums' }"
                  >
                    <template #trailing>
                      <UBadge
                        :label="level(variantMatrix[row][col].ratio).label"
                        :color="level(variantMatrix[row][col].ratio).color"
                        variant="solid"
                        size="sm"
                      />
                    </template>
                  </UButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
