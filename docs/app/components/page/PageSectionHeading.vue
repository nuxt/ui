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
}>()
</script>

<template>
  <div class="flex flex-wrap sm:flex-nowrap items-center gap-x-3.5 gap-y-3 min-h-17 pb-8">
    <h2 v-if="title" class="text-xs font-medium uppercase tracking-widest text-muted whitespace-nowrap">
      {{ title }}
    </h2>

    <slot name="leading" />

    <span class="flex-1 h-px bg-border" />

    <span v-if="meta || $slots.meta" class="text-[13px] text-dimmed whitespace-nowrap font-mono tracking-wide">
      <slot name="meta">{{ meta }}</slot>
    </span>

    <slot />
  </div>
</template>
