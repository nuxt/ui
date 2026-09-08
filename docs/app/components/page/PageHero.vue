<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'
// as a string this stays an unresolved <nuxtlink> element, with no href
import { NuxtLink } from '#components'

/**
 * The hero every top-level page shares: an eyebrow pill, a two-tone title
 * whose accent half is set in the serif face, a lead paragraph, optional
 * actions, and a meta row along the bottom edge: figures on the left, and on
 * the right either the platforms the library runs on or where the figures
 * come from.
 */
const props = defineProps<{
  eyebrow?: string
  eyebrowIcon?: string
  /** Makes the eyebrow a link. */
  eyebrowTo?: string
  /** The title's first half, in the body face. */
  lead: string
  /** Its second half, in the serif italic. */
  accent: string
  /** Break between the halves rather than running them on one line. */
  breakLine?: boolean
  description?: string
  links?: ButtonProps[]
  stats?: { value: string, label: string, to?: string }[]
  /** The caption opposite the figures: alone, or leading the marks. */
  note?: string
  /** A glyph ahead of the note, when the note names its source. */
  noteIcon?: string
  /** The platforms behind the note, each its logo in its own color with its name. */
  marks?: { icon: string, label: string, color?: string }[]
}>()

// The space between the halves rides the lead: a whitespace-only node
// between the two would be condensed away by the template compiler.
const leadText = computed(() => (props.breakLine ? props.lead : `${props.lead} `))

const hasMeta = computed(() => !!(props.stats?.length || props.note || props.marks?.length))

// the figures' captions and the note share one voice
const captionClass = 'text-[11.5px] font-medium uppercase tracking-[.09em] text-muted whitespace-nowrap'
</script>

<template>
  <section class="relative overflow-hidden border-b border-default pt-14 sm:pt-22">
    <!-- A dot grid fading in and out vertically, so the type sits on texture
         rather than on a hard band. -->
    <div aria-hidden="true" class="absolute inset-0 pointer-events-none bg-[radial-gradient(var(--ui-border-accented)_1px,transparent_1px)] bg-size-[28px_28px] opacity-50 mask-[linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />

    <!-- The horizon: a glow rising from the bottom edge, under a hairline
         that fades out at both ends. -->
    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-45 pointer-events-none bg-linear-to-t from-primary/15 to-transparent" />
    <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-px pointer-events-none bg-[linear-gradient(to_right,transparent,var(--ui-primary)_30%,var(--ui-primary)_70%,transparent)]" />

    <UContainer class="relative flex flex-col gap-6">
      <UBadge
        v-if="eyebrow"
        :as="eyebrowTo ? NuxtLink : 'span'"
        :to="eyebrowTo"
        :icon="eyebrowIcon"
        :label="eyebrow"
        color="neutral"
        variant="outline"
        class="self-start rounded-full bg-default font-medium text-muted"
        :class="eyebrowTo && 'hover:text-highlighted hover:ring-accented transition-colors'"
        :ui="{ leadingIcon: 'text-primary' }"
      />

      <h1 class="max-w-205 text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] tracking-[-.035em] text-balance text-highlighted">
        <!-- the serif runs a size up: at the same em it reads smaller -->
        {{ leadText }}<br v-if="breakLine"><span class="font-[Instrument_Serif] font-normal italic text-[1.13em] tracking-[-.02em] text-primary">{{ accent }}</span>
      </h1>

      <p v-if="description" class="max-w-145 text-base sm:text-[17px] leading-relaxed text-muted text-pretty">
        {{ description }}
      </p>

      <div v-if="links?.length" class="flex flex-wrap gap-2.5 pt-2">
        <UButton v-for="(link, index) in links" :key="index" size="xl" v-bind="link" />
      </div>
    </UContainer>

    <UContainer v-if="hasMeta" class="relative pt-14 pb-7.5 flex flex-wrap items-end gap-x-10 sm:gap-x-14 gap-y-6">
      <component
        :is="stat.to ? NuxtLink : 'div'"
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to"
        :target="stat.to?.startsWith('http') ? '_blank' : undefined"
        class="group flex flex-col gap-1.5 focus-visible:outline-primary"
      >
        <span class="text-3xl sm:text-[34px] font-semibold leading-[.95] tracking-[-.03em] tabular-nums text-highlighted group-hover:text-primary transition-colors">
          {{ stat.value }}
        </span>
        <span :class="captionClass">
          {{ stat.label }}
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

    <div class="h-12 sm:h-16" />
  </section>
</template>
