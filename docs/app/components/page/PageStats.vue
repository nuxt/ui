<script setup lang="ts">
// as a string this stays an unresolved <nuxtlink> element, with no href
import { NuxtLink } from '#components'

/**
 * A row of figures for the hero's `links` slot, each a link when it has
 * somewhere to go.
 */
defineProps<{
  items: { value: string, label: string, to?: string }[]
}>()
</script>

<template>
  <div class="relative flex flex-wrap items-end gap-4 sm:gap-x-6 lg:gap-x-8">
    <component
      :is="item.to ? NuxtLink : 'div'"
      v-for="item in items"
      :key="item.label"
      :to="item.to"
      :target="item.to?.startsWith('http') ? '_blank' : undefined"
      class="group flex flex-col gap-1.5 focus-visible:outline-primary"
    >
      <span class="text-3xl sm:text-4xl font-semibold leading-[.95] tracking-[-.03em] tabular-nums text-highlighted group-hover:text-primary transition-colors">
        {{ item.value }}
      </span>
      <span class="text-[9px] sm:text-[11.5px] font-medium uppercase tracking-[.09em] text-muted whitespace-nowrap">
        {{ item.label }}
      </span>
    </component>
  </div>
</template>
