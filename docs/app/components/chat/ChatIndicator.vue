<script setup lang="ts">
const size = 4
const gap = 2
const totalDots = size * size

const patterns = [
  [[0], [1], [2], [3], [7], [11], [15], [14], [13], [12], [8], [4], [5], [6], [10], [9]],
  [[0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15]],
  [[5, 6, 9, 10], [1, 4, 7, 8, 11, 14], [0, 3, 12, 15], [1, 4, 7, 8, 11, 14], [5, 6, 9, 10]],
  [[0], [1, 4], [2, 5, 8], [3, 6, 9, 12], [7, 10, 13], [11, 14], [15]]
]

const activeDots = ref<Set<number>>(new Set())
let patternIndex = 0
let stepIndex = 0

function nextStep() {
  const pattern = patterns[patternIndex]
  if (!pattern) return

  activeDots.value = new Set(pattern[stepIndex])
  stepIndex++

  if (stepIndex >= pattern.length) {
    stepIndex = 0
    patternIndex = (patternIndex + 1) % patterns.length
  }
}

let matrixInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  nextStep()
  matrixInterval = setInterval(nextStep, 120)
})

onUnmounted(() => {
  clearInterval(matrixInterval)
})
</script>

<template>
  <div
    aria-hidden="true"
    class="shrink-0 grid size-4"
    :style="{
      gridTemplateColumns: `repeat(${size}, 1fr)`,
      gap: `${gap}px`
    }"
  >
    <span
      v-for="i in totalDots"
      :key="i"
      class="rounded-sm bg-current transition-opacity duration-100"
      :class="activeDots.has(i - 1) ? 'opacity-100' : 'opacity-20'"
    />
  </div>
</template>
