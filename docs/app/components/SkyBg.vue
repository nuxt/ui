<script setup lang="ts">
import { kebabCase } from 'scule'

interface Star {
  x: number
  y: number
  size: number
  twinkleDelay: number
  id: string
}

const props = withDefaults(defineProps<{
  starCount?: number
  color?: string
  size?: { min: number, max: number }
  speed?: 'slow' | 'normal' | 'fast'
  isIndex?: boolean
}>(), {
  starCount: 50,
  color: 'var(--ui-primary)',
  size: () => ({
    min: 1,
    max: 3
  }),
  speed: 'normal',
  isIndex: false
})

const route = useRoute()

// Generate random stars
const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, () => {
    const x = Math.floor(Math.random() * 100)
    const y = Math.floor(Math.random() * 100)
    const size = Math.random() * (props.size.max - props.size.min) + props.size.min
    const twinkleDelay = Math.random() * 5

    return { x, y, size, twinkleDelay, id: Math.random().toString(36).substring(2, 9) }
  })
}

// Generate all stars
const stars = useState<Star[]>(`${kebabCase(route.path)}-sky`, () => generateStars(props.starCount))

// Compute twinkle animation duration based on speed
const twinkleDuration = computed(() => {
  const speedMap: Record<string, string> = {
    slow: '4s',
    normal: '2s',
    fast: '1s'
  }
  return speedMap[props.speed]
})
</script>

<template>
  <div class="absolute pointer-events-none z-[-1] overflow-hidden" :class="isIndex ? 'inset-y-0 left-4 right-4 lg:right-[50%]' : 'inset-0'">
    <div
      v-for="star in stars"
      :key="star.id"
      class="star absolute"
      :style="{
        'left': `${star.x}%`,
        'top': `${star.y}%`,
        'transform': 'translate(-50%, -50%)',
        '--star-size': `${star.size}px`,
        '--star-color': color,
        '--twinkle-delay': `${star.twinkleDelay}s`,
        '--twinkle-duration': twinkleDuration
      }"
    />
  </div>
</template>

<style scoped>
.star {
  width: var(--star-size);
  height: var(--star-size);
  background-color: var(--star-color);
  border-radius: 50%;
  animation: twinkle var(--twinkle-duration) ease-in-out infinite;
  animation-delay: var(--twinkle-delay);
  will-change: opacity;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}
</style>
