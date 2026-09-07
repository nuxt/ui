<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

/**
 * The hero every top-level page shares: an eyebrow pill, a two-tone title
 * whose accent half is set in the serif face, a lead paragraph, optional
 * actions, and an optional row of figures along the bottom edge.
 */
const props = withDefaults(defineProps<{
  eyebrow?: string
  eyebrowIcon?: string
  /** The title's first half, in the body face. */
  lead: string
  /** Its second half, in the serif italic. */
  accent: string
  /** Break between the halves rather than running them on one line. */
  breakLine?: boolean
  description?: string
  links?: ButtonProps[]
  stats?: { value: string, label: string, to?: string }[]
  /** Sits opposite the figures, where they come from. */
  note?: string
  /** `horizon` glows along the bottom edge, `halo` above the title. */
  backdrop?: 'horizon' | 'halo' | 'none'
}>(), {
  eyebrowIcon: 'i-lucide-sparkles',
  backdrop: 'horizon'
})

// The space between the halves rides the lead: a whitespace-only node
// between the two would be condensed away by the template compiler.
const leadText = computed(() => (props.breakLine ? props.lead : `${props.lead} `))
</script>

<template>
  <section class="relative overflow-hidden border-b border-default pt-14 sm:pt-22">
    <!-- A dot grid fading in and out vertically, so the type sits on texture
         rather than on a hard band. -->
    <div aria-hidden="true" class="absolute inset-0 pointer-events-none bg-[radial-gradient(var(--ui-border-accented)_1px,transparent_1px)] bg-[size:28px_28px] opacity-50 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />

    <template v-if="backdrop === 'horizon'">
      <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-45 pointer-events-none bg-linear-to-t from-primary/15 to-transparent" />
      <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-px pointer-events-none bg-linear-to-r from-transparent via-primary to-transparent" />
    </template>
    <div v-else-if="backdrop === 'halo'" aria-hidden="true" class="absolute -top-70 left-1/2 -translate-x-1/2 w-[1000px] h-[540px] pointer-events-none bg-radial from-primary/20 to-transparent to-70%" />

    <div class="relative max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
      <UBadge
        v-if="eyebrow"
        :icon="eyebrowIcon"
        :label="eyebrow"
        color="neutral"
        variant="outline"
        size="lg"
        class="self-start rounded-full bg-default font-medium text-muted"
        :ui="{ leadingIcon: 'text-primary' }"
      />

      <h1 class="max-w-[820px] text-4xl sm:text-5xl lg:text-6xl font-medium leading-none tracking-tighter text-balance text-highlighted">
        <!-- the serif runs a size up: at the same em it reads smaller -->
        {{ leadText }}<br v-if="breakLine"><span class="font-[family-name:Instrument_Serif] font-normal italic text-[1.13em] tracking-tight text-(--ui-color-primary-700) dark:text-(--ui-color-primary-400)">{{ accent }}</span>
      </h1>

      <p v-if="description" class="max-w-[580px] text-base sm:text-[17px] leading-relaxed text-muted text-pretty">
        {{ description }}
      </p>

      <div v-if="links?.length" class="flex flex-wrap gap-2.5 pt-2">
        <UButton v-for="(link, index) in links" :key="index" size="xl" v-bind="link" />
      </div>
    </div>

    <div v-if="stats?.length || note" class="relative max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 pb-8 flex flex-wrap items-end gap-x-10 sm:gap-x-14 gap-y-6">
      <component
        :is="stat.to ? 'NuxtLink' : 'div'"
        v-for="stat in stats"
        :key="stat.label"
        :to="stat.to"
        :target="stat.to?.startsWith('http') ? '_blank' : undefined"
        class="group flex flex-col gap-1.5 focus-visible:outline-primary"
      >
        <span class="text-3xl sm:text-4xl font-semibold leading-[.95] tracking-tight tabular-nums text-highlighted group-hover:text-primary transition-colors">
          {{ stat.value }}
        </span>
        <span class="text-xs font-medium uppercase tracking-widest text-muted whitespace-nowrap">
          {{ stat.label }}
        </span>
      </component>

      <span v-if="note" class="ms-auto text-xs text-muted whitespace-nowrap">{{ note }}</span>
    </div>

    <div class="h-12 sm:h-16" />
  </section>
</template>
