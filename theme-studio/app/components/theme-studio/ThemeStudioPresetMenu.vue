<script setup lang="ts">
/** The presets trigger (label + popover listbox) plus the shuffle die. */
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

const { presets, activePreset, shuffle } = useThemeStudio()
const { icon: iconSet } = useTheme()
const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

/** Exposed so hosts (the fullscreen toolbar) can pin themselves while open. */
const open = defineModel<boolean>('open', { default: false })
const { hasCSSChanges, hasConfigChanges } = useTheme()

// The persisted preset (and any persisted edits) are client-only — resolve
// the label after mount so hydration matches the server's fallback.
const mounted = ref(false)
onMounted(() => (mounted.value = true))

// the boolean prop shadows the util in template scope — alias the handler
const onKeepPanels = keepPanels

/**
 * The shuffle die rolls: the icon spins once while cycling faces, then
 * settles on a random face that sticks around until the next roll.
 * Reduced-motion users get the plain shuffle.
 */
const DICE_FACES = ['i-lucide-dice-1', 'i-lucide-dice-2', 'i-lucide-dice-3', 'i-lucide-dice-4', 'i-lucide-dice-5', 'i-lucide-dice-6']
const diceFace = ref(studioIcons.dice)
const rolling = ref(false)

// Rest on the active pack's die; only Lucide ships the numbered faces the
// roll cycles through, so other packs just spin their single die/shuffle.
watch(() => studioIcons.dice, (die) => {
  if (!rolling.value) diceFace.value = die
})

// keep in sync with the dice-roll keyframes: total duration and the
// percentage stops where the die hits an edge — each impact flips the face.
// Tuned on the bench: 6 wall hits, constant travel, 1.3× slowdown per
// crossing, 1.5 turns with 0.8× spin decay, 12% squash, 12% button bump.
const ROLL_MS = 675
const HIT_FRACTIONS = [0.064, 0.147, 0.255, 0.395, 0.578, 0.815]
let rollTimers: Array<ReturnType<typeof setTimeout>> = []

function randomFace() {
  if (iconSet.value !== 'lucide') return studioIcons.dice
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

/**
 * The baseline preset's name — edits deliberately don't clear it (the
 * dirty dots carry divergence); 'Custom' only when no preset is set but
 * the theme differs from stock.
 */
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
        :icon="studioIcons.themes"
        :trailing-icon="appConfig.ui.icons.chevronDown"
        color="neutral"
        variant="subtle"
        :size="size"
        block
      />

      <template #content>
        <ThemeStudioPresetList @select="open = false" />
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
