<script setup lang="ts">
import { Motion } from 'motion-v'

const props = withDefaults(defineProps<{
  text: string
  duration?: number
  spread?: number
  class?: any
}>(), {
  duration: 2,
  spread: 2
})

const initial = { backgroundPosition: '100% center' }
const animate = { backgroundPosition: '0% center' }

const transition = computed(() => ({ repeat: Infinity, duration: props.duration, ease: 'linear' as const }))

const dynamicSpread = computed(() => props.text.length * props.spread)

const shimmerStyle = computed(() => ({
  '--spread': `${dynamicSpread.value}px`,
  'background-image': 'var(--bg), linear-gradient(var(--ui-text-muted), var(--ui-text-muted))'
} as Record<string, string>))
</script>

<template>
  <Motion
    as="span"
    :initial="initial"
    :animate="animate"
    :transition="transition"
    :style="shimmerStyle"
    data-slot="base"
    :class="[props.class, 'bg-size-[250%_100%,auto] bg-clip-text text-transparent [background-repeat:no-repeat,padding-box] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--ui-text-highlighted),#0000_calc(50%+var(--spread)))] will-change-[background-position]']"
  >
    {{ text }}
  </Motion>
</template>
