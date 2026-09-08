<script setup lang="ts">
/**
 * The row that opens a page section under the hero: a small caps title, a
 * rule, and whatever the section keeps at its right edge (a count, a link,
 * controls). Below `sm` the trailing part wraps under the title when it is
 * wider than a word or two.
 */
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex flex-wrap sm:flex-nowrap items-center gap-x-3.5 gap-y-3 mb-5">
    <h2 class="text-xs font-medium uppercase tracking-widest text-muted whitespace-nowrap">
      {{ title }}
    </h2>

    <span class="hidden sm:block flex-1 h-px bg-border" />

    <slot />
  </div>
</template>
