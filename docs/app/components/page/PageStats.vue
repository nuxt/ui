<script setup lang="ts">
// as a string this stays an unresolved <nuxtlink> element, with no href
import { NuxtLink } from '#components'

/**
 * A row of figures for the hero's `bottom` slot: the figures on the left,
 * each a link when it has somewhere to go, and on the right either the
 * platforms the library runs on (`marks`, led by the `note`) or a caption
 * saying where the figures come from (the `note` alone).
 */
defineProps<{
  items: { value: string, label: string, to?: string }[]
  /** The caption opposite the figures: alone, or leading the marks. */
  note?: string
  /** A glyph ahead of the note, when the note names its source. */
  noteIcon?: string
  /** The platforms behind the note, each its logo in its own color with its name. */
  marks?: { icon: string, label: string, color?: string }[]
}>()

// the figures' captions and the note share one voice
const captionClass = 'text-[11.5px] font-medium uppercase tracking-[.09em] text-muted whitespace-nowrap'
</script>

<template>
  <UContainer class="relative pt-14 pb-7.5 flex flex-wrap items-end gap-x-10 sm:gap-x-14 gap-y-6">
    <component
      :is="item.to ? NuxtLink : 'div'"
      v-for="item in items"
      :key="item.label"
      :to="item.to"
      :target="item.to?.startsWith('http') ? '_blank' : undefined"
      class="group flex flex-col gap-1.5 focus-visible:outline-primary"
    >
      <span class="text-3xl sm:text-[34px] font-semibold leading-[.95] tracking-[-.03em] tabular-nums text-highlighted group-hover:text-primary transition-colors">
        {{ item.value }}
      </span>
      <span :class="captionClass">
        {{ item.label }}
      </span>
    </component>

    <!-- the trailing side sits on the captions' baseline -->
    <div v-if="marks?.length" class="ms-auto pb-1 flex flex-wrap items-center gap-5">
      <span v-if="note" :class="captionClass">{{ note }}</span>

      <span v-for="mark in marks" :key="mark.label" class="flex items-center gap-2">
        <UIcon :name="mark.icon" class="size-5.5 shrink-0" :style="mark.color ? { color: mark.color } : undefined" />
        <span class="text-[15px] font-semibold tracking-[-.01em] text-highlighted">{{ mark.label }}</span>
      </span>
    </div>

    <span v-else-if="note" class="ms-auto pb-1 flex items-center gap-2">
      <UIcon v-if="noteIcon" :name="noteIcon" class="size-3.75 shrink-0 text-highlighted" />
      <span :class="captionClass">{{ note }}</span>
    </span>
  </UContainer>
</template>
