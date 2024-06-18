<script setup lang="ts">
const props = withDefaults(defineProps<{
  contributors: {
    username: string
  }[]
  level?: number
  max?: number
}>(), {
  level: 0,
  max: 5
})

const contributors = computed(() => props.contributors.slice(0, 5))

console.log('contributors.value', contributors.value)
</script>

<template>
  <div
    class="isolate rounded-full relative border-gradient h-full aspect-[1/1] p-12 before:absolute before:inset-px before:bg-gradient-to-b before:from-gray-950 before:to-gray-900 before:rounded-full"
    :style="{
      '--duration': `${(level + 1) * 5}s`,
      '--total': 5
    }"
  >
    <HomeContributors
      v-if="(level + 1) < max"
      :max="max"
      :level="level + 1"
      :contributors="props.contributors.slice(5)"
    />

    <div class="absolute inset-0 grid place-items-center">
      <UAvatar
        v-for="(contributor, index) in contributors"
        :key="contributor.username"
        :alt="contributor.username"
        :src="`https://ipx.nuxt.com/s_40x40/gh_avatar/${contributor.username}`"
        :srcset="`https://ipx.nuxt.com/s_80x80/gh_avatar/${contributor.username} 2x`"
        class="avatar ring-2 ring-gray-200 dark:ring-gray-800 lg:hover:ring-primary-500 dark:lg:hover:ring-primary-400"
        width="40"
        height="40"
        size="sm"
        loading="lazy"
        :style="{
          '--index': index
        }"
      >
        <NuxtLink :to="`https://github.com/${contributor.username}`" :aria-label="contributor.username" target="_blank" class="focus:outline-none" tabindex="-1">
          <span class="absolute inset-0" aria-hidden="true" />
        </NuxtLink>
      </UAvatar>
    </div>
  </div>
</template>

<style scoped>
.border-gradient:after {
  --angle: 0deg;
  --border-color: rgb(var(--color-gray-300));
  --highlight-color: rgb(var(--color-gray-900));

  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: -1px;
  opacity: 1;
  border-radius: 9999px;
  z-index: -1;
  background: var(--border-color);

  @supports (background: paint(houdini)) {
    background: linear-gradient(var(--angle), var(--border-color), var(--border-color), var(--border-color), var(--border-color), var(--highlight-color));
    animation: var(--duration) rotate linear infinite;
  }
}

.dark .border-gradient:after {
  --border-color: rgb(var(--color-gray-700));
  --highlight-color: white;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.avatar {
  /* Decimal value, 0-1 based on the child's index. */
  --d: calc(var(--index) / var(--total));
  /* Offset to get better starting placement on the circle */
  --r-offset: -0.25turn;
  /* Full circle */
  --r-amount: 1turn;
  /* Rotation based on the decimal and r modifiers */
  --r: calc((var(--r-amount) * var(--d)) + var(--r-offset));
  /* Rotate, transform out, then negative rotation so the content appears upright */
  --transform: rotate(var(--r)) translate(var(--radius)) rotate(calc(-1 * var(--r)));

  transform: var(--transform);
  transition: transform 1.5s ease-in-out;
  /* transition-delay: calc(0.1s * var(--i)); */
}
</style>
