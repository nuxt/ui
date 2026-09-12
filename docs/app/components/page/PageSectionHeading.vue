<script setup lang="ts">
/**
 * The row that opens a page section under the hero: a small caps title,
 * optionally a control beside it (`leading`), a rule, then the section's
 * figure (`meta`, a count in the mono caption every page shares) and whatever
 * else it keeps at its right edge (a link, controls). Below `sm` the trailing
 * part wraps under the title when it is wider than a word or two.
 */
defineProps<{
  title?: string
  /** The figure at the right edge, "12 posts"; the `meta` slot for one that needs markup. */
  meta?: string
  ui?: { root?: string, rule?: string, meta?: string }
}>()
</script>

<template>
  <div :class="['flex items-center gap-x-1.5 sm:gap-x-3.5 gap-y-3 min-h-9 mb-8', ui?.root]">
    <h2 v-if="title" class="text-xs text-muted whitespace-nowrap tracking-widest font-medium uppercase truncate">
      {{ title }}
    </h2>

    <slot name="leading" />

    <span :class="['flex-1 h-px bg-border min-w-6', ui?.rule]" />

    <span v-if="meta || $slots.meta" :class="['text-[13px] text-dimmed whitespace-nowrap font-mono tracking-wide', ui?.meta]">
      <slot name="meta">{{ meta }}</slot>
    </span>

    <slot />
  </div>
</template>
