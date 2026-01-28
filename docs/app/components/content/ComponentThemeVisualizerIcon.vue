<script setup lang="ts">
import { motion } from 'motion-v'

const props = withDefaults(defineProps<{
  size?: number
  open?: boolean
}>(), {
  size: 16,
  open: false
})

// X lines: rotate to form X when open, rotate back and scale down when closing
const line1Variants = {
  open: {
    rotate: 45,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' as const }
  },
  closed: {
    rotate: 0,
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const }
  }
}

const line2Variants = {
  open: {
    rotate: -45,
    scale: 1,
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' as const }
  },
  closed: {
    rotate: 0,
    scale: 0,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const }
  }
}

// Eye: scale up when appearing, scale down when X appears
const eyeVariants = {
  open: {
    scale: 0,
    opacity: 0,
    scaleY: 1,
    transition: { duration: 0.15, ease: 'easeIn' as const }
  },
  closed: {
    scale: 1,
    opacity: 1,
    scaleY: [1, 1, 0.1, 1, 1],
    transition: {
      scale: { duration: 0.25, delay: 0.1, ease: 'easeOut' as const },
      opacity: { duration: 0.2, delay: 0.1, ease: 'easeOut' as const },
      scaleY: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        times: [0, 0.45, 0.5, 0.55, 1],
        delay: 0.5
      }
    }
  }
}

const pupilVariants = {
  open: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' as const }
  },
  closed: {
    opacity: [1, 1, 0, 1, 1],
    scale: [1, 1, 0, 1, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      times: [0, 0.45, 0.5, 0.55, 1],
      delay: 0.5
    }
  }
}

const currentState = computed(() => props.open ? 'open' : 'closed')
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <!-- X icon (two lines) -->
    <motion.line
      x1="4"
      y1="12"
      x2="20"
      y2="12"
      :variants="line1Variants"
      :animate="currentState"
      :style="{ transformOrigin: 'center' }"
      class="outline-none"
      tabindex="-1"
    />
    <motion.line
      x1="4"
      y1="12"
      x2="20"
      y2="12"
      :variants="line2Variants"
      :animate="currentState"
      :style="{ transformOrigin: 'center' }"
      class="outline-none"
      tabindex="-1"
    />

    <!-- Eye shape (with blink) -->
    <motion.path
      d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0"
      fill="none"
      :variants="eyeVariants"
      :animate="currentState"
      :style="{ transformOrigin: 'center' }"
      class="outline-none"
      tabindex="-1"
    />

    <!-- Pupil -->
    <motion.circle
      cx="12"
      cy="12"
      r="3"
      fill="none"
      :variants="pupilVariants"
      :animate="currentState"
      :style="{ transformOrigin: 'center' }"
      class="outline-none"
      tabindex="-1"
    />
  </svg>
</template>
