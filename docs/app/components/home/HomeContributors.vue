<script setup lang="ts">
const props = withDefaults(defineProps<{
  contributors?: {
    username: string
  }[]
  level?: number
  max?: number
}>(), {
  level: 0,
  max: 4
})

const contributors = computed(() => props.contributors?.slice(0, 6) ?? [])

const el = ref(null)
const { width } = useElementSize(el)
</script>

<template>
  <div
    class="isolate rounded-full relative circle w-full aspect-[1/1] p-8 sm:p-12 md:p-14 lg:p-10 xl:p-16 before:absolute before:inset-px before:bg-(--ui-bg) before:rounded-full z-(--level)"
    :style="{
      '--duration': `${((level + 1) * 5)}s`,
      '--level': level + 1
    }"
  >
    <HomeContributors
      v-if="(level + 1) < max"
      :max="max"
      :level="level + 1"
      :contributors="props.contributors?.slice(6) ?? []"
    />

    <div
      ref="el"
      class="avatars absolute inset-0 grid"
      :style="{
        '--total': contributors.length,
        '--offset': `${width / 2}px`
      }"
    >
      <UTooltip
        v-for="(contributor, index) in contributors"
        :key="contributor.username"
        :text="contributor.username"
        :delay-duration="0"
      >
        <NuxtLink
          :to="`https://github.com/${contributor.username}`"
          :aria-label="contributor.username"
          target="_blank"
          class="avatar flex absolute top-1/2 left-1/2"
          tabindex="-1"
          :style="{
            '--index': index + 1
          }"
        >
          <UAvatar
            :alt="contributor.username"
            :src="`https://ipx.nuxt.com/s_40x40/gh_avatar/${contributor.username}`"
            :srcset="`https://ipx.nuxt.com/s_80x80/gh_avatar/${contributor.username} 2x`"
            class="ring-2 ring-(--ui-border) lg:hover:ring-(--ui-border-inverted) transition"
            width="40"
            height="40"
            size="sm"
            loading="lazy"
          />
        </NuxtLink>
      </UTooltip>
    </div>
  </div>
</template>

<style scoped>
.dark .circle:after {
  --highlight-color: var(--ui-border-inverted);
}
.circle:after {
  --start: 0deg;
  --end: 360deg;
  --border-color: var(--ui-border);
  --highlight-color: var(--ui-color-neutral-400);

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

.avatars {
  --start: calc(var(--level) * 36deg);
  --end: calc(360deg + (var(--level) * 36deg));
  transform: rotate(var(--angle));
  animation: calc(var(--duration) + 60s) rotate linear infinite;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

.avatar {
  --deg: calc(var(--index) * (360deg / var(--total)));
  --transformX: calc(cos(var(--deg)) * var(--offset));
  --transformY: calc(sin(var(--deg)) * var(--offset));
  transform: translate(calc(-50% + var(--transformX)), calc(-50% + var(--transformY))) rotate(calc(360deg - var(--angle)));
  transform-style: preserve-3d;
  backface-visibility: hidden;
}

@keyframes rotate {
  from {
    --angle: var(--start);
  }
  to {
    --angle: var(--end);
  }
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: true;
}
</style>
