<script setup lang="ts">
import { resolveAlias, resolveShade } from '../../utils/theme-engine'
import type { ThemeDoc, Shade } from '../../utils/theme-engine'
import { themeIcons } from '../../utils/theme'

/** The presets listbox (theme chips, fonts and ramps) plus the shuffle die. */
const props = defineProps<{
  /** Button size — the toolbar uses the default, the header picker slims down. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  /**
   * The studio toolbar opts out of dismissing on its own chrome so the
   * color-mode switch stays usable while the list is open; other hosts
   * keep the stock dismiss behavior.
   */
  keepPanels?: boolean
}>()

const { presets, activePreset, applyPreset, shuffle } = useThemeStudio()

/** Exposed so hosts (the fullscreen toolbar) can pin themselves while open. */
const open = defineModel<boolean>('open', { default: false })
const { hasCSSChanges, hasConfigChanges } = useTheme()

// The persisted preset (and any persisted edits) are client-only — resolve
// the label after mount so hydration matches the server's fallback.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

/**
 * Each row leads with a mini theme chip: the doc's neutral ramp as the
 * page, its own icon in its primary — the theme in one glance, following
 * the current color mode (light 50→200 / dark 900→800, primary 500/400).
 */
function themeChip(doc: ThemeDoc) {
  const shade = (alias: 'primary' | 'neutral', step: Shade) => resolveShade(doc, resolveAlias(doc, alias), step)
  return {
    '--chip-bg-light': `linear-gradient(135deg, ${shade('neutral', 50)}, ${shade('neutral', 200)})`,
    '--chip-bg-dark': `linear-gradient(135deg, ${shade('neutral', 900)}, ${shade('neutral', 800)})`,
    '--chip-icon-light': doc.blackAsPrimary ? 'black' : shade('primary', 500),
    '--chip-icon-dark': doc.blackAsPrimary ? 'white' : shade('primary', 400)
  }
}

/** A taste of the doc's icon set (its own, or the default lucide). */
function iconSamples(doc: ThemeDoc): string[] {
  const sets = themeIcons as Record<string, Record<string, string>>
  const set = sets[doc.icons ?? 'lucide'] ?? sets.lucide!
  // upload, search and folder vary the most between the sets
  return ['upload', 'search', 'folder'].map(key => set[key]!)
}

const presetItems = computed(() => presets.map(preset => ({
  id: preset.id,
  label: preset.name,
  chipIcon: preset.icon,
  themeChip: themeChip(preset.doc),
  font: preset.doc.font?.sans ?? 'Public Sans',
  iconSamples: iconSamples(preset.doc)
})))

// the rows render their own font names — load the faces once
const { fonts } = useTheme()
onMounted(() => loadFontPreviews(fonts))

const selected = computed({
  get: () => activePreset.value,
  set: (id: string | undefined) => {
    const preset = presets.find(entry => entry.id === id)
    if (preset) applyPreset(preset)
    open.value = false
  }
})

// the boolean prop shadows the util in template scope — alias the handler
const onKeepPanels = keepPanels

/**
 * The shuffle die rolls: the icon spins once while cycling faces, then
 * settles on a random face that sticks around until the next roll.
 * Reduced-motion users get the plain shuffle.
 */
const DICE_FACES = ['i-lucide-dice-1', 'i-lucide-dice-2', 'i-lucide-dice-3', 'i-lucide-dice-4', 'i-lucide-dice-5', 'i-lucide-dice-6']
const diceFace = ref('i-lucide-dices')
const rolling = ref(false)

// keep in sync with the dice-roll keyframes: total duration and the
// percentage stops where the die hits an edge — each impact flips the face.
// Tuned on the bench: 6 wall hits, constant travel, 1.3× slowdown per
// crossing, 1.5 turns with 0.8× spin decay, 12% squash, 12% button bump.
const ROLL_MS = 675
const HIT_FRACTIONS = [0.064, 0.147, 0.255, 0.395, 0.578, 0.815]
let rollTimers: Array<ReturnType<typeof setTimeout>> = []

function randomFace() {
  return DICE_FACES[Math.floor(Math.random() * DICE_FACES.length)]!
}

function clearRollTimers() {
  rollTimers.forEach(timer => clearTimeout(timer))
  rollTimers = []
}

async function rollDice() {
  shuffle()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    diceFace.value = randomFace()
    return
  }
  // drop the class for a tick so a mid-roll re-click restarts the animation
  clearRollTimers()
  rolling.value = false
  await nextTick()
  rolling.value = true
  rollTimers = HIT_FRACTIONS.map(fraction => setTimeout(() => (diceFace.value = randomFace()), ROLL_MS * fraction))
  // animationend settles the roll; this is only a safety net for
  // environments that never fire it
  rollTimers.push(setTimeout(onRollEnd, ROLL_MS + 400))
}

/**
 * The animation clock decides the end — a JS timer would race it and
 *  snap the tumble back a few frames early.
 */
function onRollEnd(event?: AnimationEvent) {
  if (event && !event.animationName.includes('dice-roll')) return
  if (!rolling.value) return
  clearRollTimers()
  rolling.value = false
  // no swap here: the face thrown on the last bounce IS the result
}

onUnmounted(clearRollTimers)

/** The applied preset's name; 'Custom' once edits diverge from it. */
const presetLabel = computed(() => {
  if (!mounted.value) return 'Presets'
  const active = presets.find(preset => preset.id === activePreset.value)
  if (active) return active.name
  return (hasCSSChanges.value || hasConfigChanges.value) ? 'Custom' : 'Presets'
})
</script>

<template>
  <div class="flex gap-2">
    <UPopover
      v-model:open="open"
      :content="props.keepPanels ? { align: 'start', onInteractOutside: onKeepPanels } : { align: 'start' }"
      class="flex-1 min-w-0"
    >
      <UButton
        :label="presetLabel"
        icon="i-lucide-swatch-book"
        trailing-icon="i-lucide-chevron-down"
        color="neutral"
        variant="subtle"
        :size="size"
        block
      />

      <template #content>
        <UListbox
          v-model="selected"
          :items="presetItems"
          value-key="id"
          class="w-80"
          :ui="{
            root: 'ring-0 rounded-md',
            content: 'max-h-96',
            item: 'gap-3'
          }"
        >
          <template #item-leading="{ item }">
            <span
              class="flex items-center justify-center size-10 rounded-md ring ring-default shrink-0 bg-[image:var(--chip-bg-light)] dark:bg-[image:var(--chip-bg-dark)]"
              :style="item.themeChip"
            >
              <UIcon :name="item.chipIcon" class="size-4 text-(--chip-icon-light) dark:text-(--chip-icon-dark)" />
            </span>
          </template>

          <!-- the doc's font in its own face and a taste of its icon set -->
          <template #item-description="{ item }">
            <span class="flex items-center gap-2 pt-0.5">
              <span class="shrink-0 text-xs text-muted truncate" :style="{ fontFamily: `'${item.font}', sans-serif` }">{{ item.font }}</span>

              <span class="text-dimmed select-none">·</span>

              <span class="flex items-center gap-1 shrink-0">
                <UIcon v-for="name in item.iconSamples" :key="name" :name="name" class="size-3 text-dimmed" />
              </span>
            </span>
          </template>
        </UListbox>
      </template>
    </UPopover>

    <UTooltip text="Random theme">
      <UButton
        :icon="diceFace"
        color="neutral"
        variant="subtle"
        :size="size"
        aria-label="Random theme"
        :class="rolling && 'dice-bumping'"
        :ui="{ leadingIcon: rolling ? 'dice-rolling' : undefined }"
        @click="rollDice"
        @animationend="onRollEnd"
      />
    </UTooltip>
  </div>
</template>

<style scoped>
/* Bench-tuned (dice tuner artifact): a die in a fixed box — constant
   wall-to-wall travel, each crossing 1.3× slower than the last, spin
   decaying 0.8× per hit, 12% squash on impact, held ~10ms. Impact stops
   mirror HIT_FRACTIONS; the rotation ends on -540° (pips are 180°-
   symmetric, so the settled face still reads upright). */
@keyframes dice-roll {
  0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
  6.4% { transform: translate(-8px, 6px) rotate(-73deg) scale(0.88); }
  7.9% { transform: translate(-8px, 6px) rotate(-73deg) scale(1); }
  14.7% { transform: translate(7.2px, -5.6px) rotate(-149deg) scale(0.88); }
  16.2% { transform: translate(7.2px, -5.6px) rotate(-149deg) scale(1); }
  25.5% { transform: translate(-6px, -6.8px) rotate(-228deg) scale(0.88); }
  27% { transform: translate(-6px, -6.8px) rotate(-228deg) scale(1); }
  39.5% { transform: translate(6.8px, 4.8px) rotate(-310deg) scale(0.88); }
  41% { transform: translate(6.8px, 4.8px) rotate(-310deg) scale(1); }
  57.8% { transform: translate(-7.2px, 2.8px) rotate(-396deg) scale(0.88); }
  59.3% { transform: translate(-7.2px, 2.8px) rotate(-396deg) scale(1); }
  81.5% { transform: translate(5.6px, -6.4px) rotate(-485deg) scale(0.88); }
  83% { transform: translate(5.6px, -6.4px) rotate(-485deg) scale(1); }
  100% { transform: translate(0px, 0px) rotate(-540deg) scale(1); }
}

/* the container pops with every hit, fading as the die loses energy */
@keyframes dice-bump {
  0% { transform: scale(1); }
  2.9% { transform: scale(1); }
  6.4% { transform: scale(1.12); }
  9.9% { transform: scale(1); }
  11.2% { transform: scale(1); }
  14.7% { transform: scale(1.096); }
  18.2% { transform: scale(1); }
  22% { transform: scale(1); }
  25.5% { transform: scale(1.077); }
  29% { transform: scale(1); }
  36% { transform: scale(1); }
  39.5% { transform: scale(1.061); }
  43% { transform: scale(1); }
  54.3% { transform: scale(1); }
  57.8% { transform: scale(1.049); }
  61.3% { transform: scale(1); }
  78% { transform: scale(1); }
  81.5% { transform: scale(1.039); }
  85% { transform: scale(1); }
  100% { transform: scale(1); }
}

/* the icon span renders inside UButton — scoped rules need :deep() */
:deep(.dice-rolling) {
  animation: dice-roll 675ms linear forwards;
}

.dice-bumping {
  animation: dice-bump 675ms linear forwards;
}
</style>
