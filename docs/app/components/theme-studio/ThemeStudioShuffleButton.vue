<script setup lang="ts">
/** Rolls a random theme, the die tumbling through faces as it goes. */
import type { ButtonProps } from '@nuxt/ui'

withDefaults(defineProps<ButtonProps & {
  /** A full-width labelled row, for the mobile menu where the other controls stack. */
  vertical?: boolean
}>(), {
  variant: 'ghost'
})

const { shuffle } = useThemeStudio()
const { icon: iconSet } = useTheme()
const studioIcons = useStudioIcons()

const DICE_FACES = ['i-lucide-dice-1', 'i-lucide-dice-2', 'i-lucide-dice-3', 'i-lucide-dice-4', 'i-lucide-dice-5', 'i-lucide-dice-6']
const diceFace = ref(studioIcons.dice)
const rolling = ref(false)

// Only Lucide ships numbered faces; other packs spin their single die.
watch(() => studioIcons.dice, (die) => {
  if (!rolling.value) diceFace.value = die
})

// Keep in sync with the dice-roll keyframes: the stops are where the die hits
// an edge, each impact flips the face.
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
  // safety net for environments that never fire animationend
  rollTimers.push(setTimeout(onRollEnd, ROLL_MS + 400))
}

// The animation clock decides the end, a JS timer would race it and snap the
// tumble back a few frames early.
function onRollEnd(event?: AnimationEvent) {
  if (event && !event.animationName.includes('dice-roll')) return
  if (!rolling.value) return
  clearRollTimers()
  rolling.value = false
  // no swap here: the face thrown on the last bounce IS the result
}

onUnmounted(clearRollTimers)
</script>

<template>
  <UTooltip text="Random theme" :disabled="vertical">
    <UButton
      :icon="diceFace"
      :label="vertical ? 'Random theme' : undefined"
      color="neutral"
      :variant="vertical ? 'outline' : variant"
      :size="size"
      :block="vertical"
      aria-label="Random theme"
      :class="rolling && 'dice-bumping'"
      :ui="{ leadingIcon: [rolling && 'dice-rolling', vertical && 'text-dimmed'] }"
      @click="rollDice"
      @animationend="onRollEnd"
    />
  </UTooltip>
</template>

<style scoped>
/* Impact stops mirror HIT_FRACTIONS; rotation ends on -540° (pips are
   180°-symmetric, so the settled face reads upright). */
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

/* the icon span renders inside UButton, scoped rules need :deep() */
:deep(.dice-rolling) {
  animation: dice-roll 675ms linear forwards;
}

.dice-bumping {
  animation: dice-bump 675ms linear forwards;
}
</style>
