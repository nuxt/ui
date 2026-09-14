<script setup lang="ts">
import type { NuxiMood } from '../composables/useNuxiIcon'

/**
 * Nuxi as an inline SVG, sized and colored by the parent like any icon.
 * `interactive` adds the window listeners: the face tracks the pointer
 * nearby and the typed easter eggs (hi, nuxi, spin, flip) play.
 */
const props = withDefaults(defineProps<{
  mood?: NuxiMood
  interactive?: boolean
}>(), {
  interactive: true
})

const emit = defineEmits<{
  (e: 'moodChange', mood: NuxiMood): void
}>()

const {
  maskId,
  svgEl,
  effectiveMood,
  faceTransform,
  eyeLeftPath,
  eyeRightPath,
  smileLeftPath,
  smileRightPath,
  smileOpacity,
  mouthD,
  mouthOpacity,
  eyeLeftTransform,
  eyeRightTransform,
  eyeLeftTransition,
  eyeRightTransition,
  mouthTransform,
  bodyClass,
  handleMouseEnter,
  handleMouseLeave,
  handleSvgClick
} = useNuxiIcon(props, emit)

const isSleeping = computed(() => effectiveMood.value === 'sleeping')
</script>

<template>
  <svg
    ref="svgEl"
    viewBox="0 0 300 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="overflow-visible"
    aria-hidden="true"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleSvgClick"
  >
    <defs>
      <mask :id="`nuxi-face-mask-${maskId}`">
        <rect width="300" height="200" fill="white" />
        <g :style="{ transform: faceTransform }">
          <path
            class="nuxi-eye"
            :style="{ transform: eyeLeftTransform, transition: eyeLeftTransition }"
            :d="eyeLeftPath"
            fill="black"
          />
          <path
            class="nuxi-eye"
            :style="{ transform: eyeRightTransform, transition: eyeRightTransition }"
            :d="eyeRightPath"
            fill="black"
          />
          <!-- the smile arcs show once the eyes scale down (happy) -->
          <path
            class="nuxi-eye"
            :style="{ opacity: smileOpacity, transition: 'opacity 0.3s ease' }"
            :d="smileLeftPath"
            fill="none"
            stroke="black"
            stroke-width="12"
            stroke-linecap="round"
          />
          <path
            class="nuxi-eye"
            :style="{ opacity: smileOpacity, transition: 'opacity 0.3s ease' }"
            :d="smileRightPath"
            fill="none"
            stroke="black"
            stroke-width="12"
            stroke-linecap="round"
          />
          <path
            class="nuxi-mouth"
            :style="{ transform: mouthTransform, opacity: mouthOpacity, transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), d 0.3s ease, opacity 0.3s ease' }"
            :d="mouthD"
            fill="black"
          />
        </g>
      </mask>
    </defs>

    <path
      class="nuxi-body"
      :class="bodyClass"
      d="M20 200H279C282.542 200 285.932 198.756 289 197C292.068 195.244 295.23 193.041 297 190C298.77 186.959 300.002 183.51 300 179.999C299.998 176.488 298.773 173.04 297 170.001L222 41C220.23 37.96 218.067 35.7552 215 34C211.933 32.2448 207.542 31 204 31C200.458 31 197.067 32.2448 194 34C190.933 35.7552 188.77 37.96 187 41L168 74L130 9.99764C128.228 6.95784 126.068 3.75491 123 2C119.932 0.245087 116.542 0 113 0C109.458 0 106.068 0.245087 103 2C99.9323 3.75491 96.7717 6.95784 95 9.99764L2.00001 170.001C0.226985 173.04 0.00154882 176.488 7.60801e-06 179.999C-0.0015336 183.51 0.229654 186.959 2.00001 190C3.77036 193.04 6.93246 195.244 10 197C13.0676 198.756 16.4578 200 20 200Z"
      fill="currentColor"
      :mask="`url(#nuxi-face-mask-${maskId})`"
    />

    <g
      v-if="isSleeping"
      class="nuxi-zzz"
      fill="currentColor"
      font-family="sans-serif"
      font-weight="800"
      letter-spacing="2"
    >
      <text class="nuxi-z nuxi-z-1" x="178" y="158" font-size="38">z</text>
      <text class="nuxi-z nuxi-z-2" x="202" y="125" font-size="54">z</text>
      <text class="nuxi-z nuxi-z-3" x="228" y="82" font-size="70">z</text>
    </g>
  </svg>
</template>

<style scoped>
.nuxi-body,
.nuxi-eye,
.nuxi-mouth {
  transform-box: fill-box;
  transform-origin: center;
}

.nuxi-body--idle { animation: nuxi-float 3.2s ease-in-out infinite; }
.nuxi-body--happy { animation: nuxi-happy 2.5s ease-in-out infinite; }
.nuxi-body--excited { animation: nuxi-excited 0.65s cubic-bezier(0.25, 1, 0.5, 1) forwards; }
.nuxi-body--thinking { animation: nuxi-thinking 1.6s ease-in-out infinite; }
.nuxi-body--sleeping {
  animation: nuxi-sleeping 5s ease-in-out infinite;
  transform-origin: center 92%;
}
.nuxi-body--surprised { animation: nuxi-surprised 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

.nuxi-z {
  animation: nuxi-z-float 3.2s ease-in-out infinite;
  opacity: 0;
}
.nuxi-z-1 { animation-delay: 0s; }
.nuxi-z-2 { animation-delay: 1.05s; }
.nuxi-z-3 { animation-delay: 2.1s; }

/* the face still reacts, the body holds still */
@media (prefers-reduced-motion: reduce) {
  .nuxi-body,
  .nuxi-z {
    animation: none;
  }
}

@keyframes nuxi-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes nuxi-happy {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-5px) rotate(2deg); }
  66% { transform: translateY(-3px) rotate(-1.5deg); }
}

@keyframes nuxi-excited {
  0%   { transform: scale(1, 1) translateY(0); }
  18%  { transform: scale(1.05, 0.9) translateY(5px); }
  45%  { transform: scale(0.93, 1.1) translateY(-14px); }
  65%  { transform: scale(1.04, 0.95) translateY(-6px); }
  80%  { transform: scale(0.98, 1.03) translateY(-10px); }
  100% { transform: scale(1, 1) translateY(-8px); }
}

@keyframes nuxi-thinking {
  0%, 100% { transform: rotate(-6deg) translateY(0px) scale(1, 1); }
  30% { transform: rotate(4deg) translateY(-6px) scale(0.98, 1.02); }
  60% { transform: rotate(-8deg) translateY(-2px) scale(1.02, 0.98); }
}

@keyframes nuxi-sleeping {
  0%   { transform: rotate(0deg) translateY(0px) scale(1, 1); }
  20%  { transform: rotate(-3deg) translateY(2px) scale(1.01, 0.99); }
  50%  { transform: rotate(-5deg) translateY(4px) scale(1.02, 0.98); }
  80%  { transform: rotate(-3deg) translateY(2px) scale(1.01, 0.99); }
  100% { transform: rotate(0deg) translateY(0px) scale(1, 1); }
}

@keyframes nuxi-surprised {
  0%   { transform: scale(1, 1) translateY(0); }
  15%  { transform: scale(1.1, 0.9) translateY(4px); }
  40%  { transform: scale(0.9, 1.12) translateY(-12px); }
  65%  { transform: scale(1.05, 0.96) translateY(-5px); }
  85%  { transform: scale(0.97, 1.02) translateY(-8px); }
  100% { transform: scale(1, 1) translateY(0); }
}

@keyframes nuxi-z-float {
  0%   { opacity: 0; transform: translate(0px, 0px) scale(0.5) rotate(-8deg); }
  12%  { opacity: 1; }
  75%  { opacity: 0.7; }
  100% { opacity: 0; transform: translate(20px, -80px) scale(1.1) rotate(10deg); }
}
</style>
