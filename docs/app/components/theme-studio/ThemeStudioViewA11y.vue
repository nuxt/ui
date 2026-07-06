<script setup lang="ts">
import { contrastRatio } from '../../utils/theme-engine'

/**
 * WCAG contrast matrix for the CURRENT theme: every text-role token against
 * every surface token, plus inverted text on the solid semantic surfaces
 * (what buttons render). Colors are read from the live computed custom
 * properties, so the matrix is the resolved ground truth — custom palettes,
 * shade sliders and mode switches included.
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
const SOLIDS = [
  { token: '--ui-primary', label: 'Primary' },
  { token: '--ui-secondary', label: 'Secondary' },
  { token: '--ui-success', label: 'Success' },
  { token: '--ui-info', label: 'Info' },
  { token: '--ui-warning', label: 'Warning' },
  { token: '--ui-error', label: 'Error' }
]

interface Cell {
  fg: string
  bg: string
  ratio: number
}

const matrix = ref<Cell[][]>([])
const solidRow = ref<Cell[]>([])

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
}

/**
 * The theme applies through <style> tags useHead swaps asynchronously —
 * recompute a beat after any state that feeds them changes.
 */
const colorMode = useColorMode()
const appConfig = useAppConfig()
const cssVariables = useState('nuxt-ui-css-variables', () => ({}))
const customColors = useState('nuxt-ui-custom-colors', () => ({}))

let timeout: ReturnType<typeof setTimeout> | undefined
watch([() => colorMode.value, () => ({ ...appConfig.ui.colors }), cssVariables, customColors], () => {
  clearTimeout(timeout)
  timeout = setTimeout(compute, 80)
}, { deep: true })

onMounted(compute)
onUnmounted(() => clearTimeout(timeout))

function level(ratio: number): { label: string, color: 'success' | 'warning' | 'error' } {
  if (ratio >= 7) return { label: 'AAA', color: 'success' }
  if (ratio >= 4.5) return { label: 'AA', color: 'success' }
  if (ratio >= 3) return { label: 'AA18', color: 'warning' }
  return { label: 'Fail', color: 'error' }
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
                        {{ matrix[row][col].ratio.toFixed(1) }}
                      </span>
                      <UBadge :label="level(matrix[row][col].ratio).label" :color="level(matrix[row][col].ratio).color" variant="subtle" size="sm" />
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
                {{ cell.ratio.toFixed(1) }}
              </span>
              <UBadge :label="level(cell.ratio).label" :color="level(cell.ratio).color" variant="subtle" size="sm" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
