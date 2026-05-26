<script setup lang="ts">
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'

const messages: UIMessage[] = [{
  id: '1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello! Can you help me with something?' }]
}]

const chat = new Chat({
  messages
})

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

const statusMessages = ['Searching...', 'Reading...', 'Analyzing...', 'Thinking...']
const currentIndex = ref(0)
const displayedText = ref(statusMessages[0]!)
const chars = 'abcdefghijklmnopqrstuvwxyz'

function scramble(from: string, to: string) {
  const maxLength = Math.max(from.length, to.length)
  let frame = 0
  const totalFrames = 15

  const step = () => {
    frame++
    let result = ''
    const progress = (frame / totalFrames) * maxLength

    for (let i = 0; i < maxLength; i++) {
      if (i < progress - 2) {
        result += to[i] || ''
      } else if (i < progress) {
        result += chars[Math.floor(Math.random() * chars.length)]
      } else {
        result += from[i] || ''
      }
    }

    displayedText.value = result

    if (frame < totalFrames) {
      requestAnimationFrame(step)
    } else {
      displayedText.value = to
    }
  }

  requestAnimationFrame(step)
}

let matrixInterval: ReturnType<typeof setInterval> | undefined
let textInterval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  nextStep()
  matrixInterval = setInterval(nextStep, 120)
  textInterval = setInterval(() => {
    const prev = displayedText.value
    currentIndex.value = (currentIndex.value + 1) % statusMessages.length
    scramble(prev, statusMessages[currentIndex.value]!)
  }, 3000)
})

onUnmounted(() => {
  clearInterval(matrixInterval)
  clearInterval(textInterval)
})
</script>

<template>
  <UChatMessages
    :messages="chat.messages"
    status="submitted"
    :should-scroll-to-bottom="false"
  >
    <template #indicator>
      <div class="flex items-center gap-2 text-muted overflow-hidden">
        <div
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

        <UChatShimmer :text="displayedText" class="text-sm font-mono" />
      </div>
    </template>
  </UChatMessages>
</template>
