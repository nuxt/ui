<script setup lang="ts">
import { kebabCase } from 'scule'

interface Star {
  x: number
  y: number
  size: number
}

const props = withDefaults(defineProps<{
  starCount?: number
  color?: string
  speed?: 'slow' | 'normal' | 'fast'
  size?: { min: number, max: number }
}>(), {
  starCount: 300,
  color: 'var(--ui-primary)',
  speed: 'normal',
  size: () => ({
    min: 1,
    max: 2
  })
})

const route = useRoute()

// Generate random star positions and sizes
const generateStars = (count: number): Star[] => {
  return Array.from({ length: count }, () => ({
    x: Math.floor(Math.random() * 2000),
    y: Math.floor(Math.random() * 2000),
    size: typeof props.size === 'number'
      ? props.size
      : Math.random() * (props.size.max - props.size.min) + props.size.min
  }))
}

// Define speed configurations once
const speedMap = {
  slow: { duration: 200, opacity: 0.5, ratio: 0.3 },
  normal: { duration: 150, opacity: 0.75, ratio: 0.3 },
  fast: { duration: 100, opacity: 1, ratio: 0.4 }
}

// Use a more efficient approach to generate and store stars
const stars = useState<{ slow: Star[], normal: Star[], fast: Star[] }>(`${kebabCase(route.path)}-stars`, () => {
  return {
    slow: generateStars(Math.floor(props.starCount * speedMap.slow.ratio)),
    normal: generateStars(Math.floor(props.starCount * speedMap.normal.ratio)),
    fast: generateStars(Math.floor(props.starCount * speedMap.fast.ratio))
  }
})

// Compute star layers with different speeds and opacities
const starLayers = computed(() => [
  { stars: stars.value.fast, ...speedMap.fast },
  { stars: stars.value.normal, ...speedMap.normal },
  { stars: stars.value.slow, ...speedMap.slow }
])
</script>

<template>
  <div class="absolute pointer-events-none z-[-1] inset-y-0 inset-x-5 sm:inset-x-7 lg:inset-x-9 overflow-hidden">
    <div class="stars size-full absolute inset-x-0 top-0">
      <div
        v-for="(layer, index) in starLayers"
        :key="index"
        class="star-layer"
        :style="{
          '--star-duration': `${layer.duration}s`,
          '--star-opacity': layer.opacity,
          '--star-color': color
        }"
      >
        <div
          v-for="(star, starIndex) in layer.stars"
          :key="starIndex"
          class="star absolute rounded-full"
          :style="{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'var(--star-color)',
            opacity: 'var(--star-opacity)'
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.stars {
  left: 50%;
  transform: translate(-50%);
  -webkit-mask-image: linear-gradient(
    180deg,
    rgba(217, 217, 217, 0) 0%,
    rgba(217, 217, 217, 0.8) 25%,
    #d9d9d9 50%,
    rgba(217, 217, 217, 0.8) 75%,
    rgba(217, 217, 217, 0) 100%
  );
  mask-image: linear-gradient(
    180deg,
    rgba(217, 217, 217, 0) 0%,
    rgba(217, 217, 217, 0.8) 25%,
    #d9d9d9 50%,
    rgba(217, 217, 217, 0.8) 75%,
    rgba(217, 217, 217, 0) 100%
  );
  -webkit-mask-size: cover;
  mask-size: cover;
}

.star-layer {
  animation: risingStarsAnimation linear infinite;
  animation-duration: var(--star-duration);
  will-change: transform;
}

@keyframes risingStarsAnimation {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2000px);
  }
}
</style>
