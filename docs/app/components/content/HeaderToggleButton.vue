<script setup lang="ts">
import { motion } from 'motion-v'
import type { VariantType } from 'motion-v'

const props = defineProps<{
  open: boolean
}>()

const variants: { [k: string]: VariantType | ((custom: unknown) => VariantType) } = {
  normal: {
    rotate: 0,
    y: 0,
    opacity: 1
  },
  close: (custom: unknown) => {
    const c = custom as number
    return {
      rotate: c === 1 ? 45 : c === 3 ? -45 : 0,
      y: c === 1 ? 6 : c === 3 ? -6 : 0,
      opacity: c === 2 ? 0 : 1,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20
      }
    }
  }
}

const state = computed(() => props.open ? 'close' : 'normal')
</script>

<template>
  <UButton
    size="sm"
    variant="ghost"
    color="neutral"
    square
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <motion.line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        :variants="variants"
        :animate="state"
        :custom="1"
        class="outline-none"
      />
      <motion.line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        :variants="variants"
        :animate="state"
        :custom="2"
        class="outline-none"
      />
      <motion.line
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        :variants="variants"
        :animate="state"
        :custom="3"
        class="outline-none"
      />
    </svg>
  </UButton>
</template>
