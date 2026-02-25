<script setup lang="ts">
import { Motion } from 'motion-v'

const props = withDefaults(defineProps<{
  text: string
  duration?: number
  spread?: number
}>(), {
  duration: 2,
  spread: 2
})

const dynamicSpread = computed(() => props.text.length * props.spread)

const shimmerStyle = computed(() => ({
  '--spread': `${dynamicSpread.value}px`,
  'background-image': 'var(--bg), linear-gradient(var(--color-neutral-500), var(--color-neutral-500))'
} as Record<string, string>))
</script>

<template>
  <Motion
    :initial="{ backgroundPosition: '100% center' }"
    :animate="{ backgroundPosition: '0% center' }"
    :transition="{ repeat: Infinity, duration, ease: 'linear' }"
    :style="shimmerStyle"
    data-slot="base"
    class="inline-block bg-size-[250%_100%,auto] bg-clip-text text-transparent [background-repeat:no-repeat,padding-box] [--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--color-neutral-100),#0000_calc(50%+var(--spread)))]"
  >
    {{ text }}
  </Motion>
</template>
