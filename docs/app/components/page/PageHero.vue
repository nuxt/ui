<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { BadgeProps, PageHeroProps, PageHeroSlots } from '@nuxt/ui'
// as a string this stays an unresolved <nuxtlink> element, with no href
import { NuxtLink } from '#components'

/**
 * UPageHero in the docs' clothes: the docs' dot grid and horizon behind it,
 * a badge for a headline, and a two-tone title whose accent half is set in
 * primary. Everything else (description, links, orientation, the slots) is
 * the library hero's own and passes through, `bottom` included: a page
 * that wants figures along the bottom edge puts them there.
 */
const props = defineProps<PageHeroProps & {
  /** The pill above the title: its label, or badge props plus `to` to make it a link. */
  badge?: string | (BadgeProps & { to?: string, target?: string })
  /** The title's first half. */
  lead?: string
  /** Its second half, in primary. */
  accent?: string
  /** Break between the halves rather than running them on one line. */
  breakLine?: boolean
}>()

const slots = defineSlots<PageHeroSlots>()

const heroProps = reactiveOmit(props, 'badge', 'lead', 'accent', 'breakLine', 'ui')

// a bare string is the label
const badge = computed(() => (typeof props.badge === 'string' ? { label: props.badge } : props.badge))

// The library hero's slots pass through, only the ones given: forwarding a
// slot that isn't there would still count as one for UPageHero and render
// its wrapper. `top` and `bottom` are wrapped below, `headline` and `title`
// only when the badge or the two-tone title doesn't take them.
const forwarded = computed(() => Object.keys(slots).filter(name =>
  !['top', 'bottom'].includes(name)
  && !(name === 'headline' && badge.value)
  && !(name === 'title' && (props.lead || props.accent))
) as (keyof PageHeroSlots)[])

// The space between the halves rides the lead: a whitespace-only node
// between the two would be condensed away by the template compiler.
const leadText = computed(() => (props.breakLine ? props.lead : `${props.lead} `))

// The library hero is a centered vertical stack with generous padding; the
// docs one aligns left, opens under the header and leaves the bottom to the
// `bottom` slot. The header stack's rhythm (headline, title, description,
// links) is the theme's, only its measures change.
const ui = computed(() => ({
  // the top padding sits on the root: the container's own responsive padding
  // is zeroed per breakpoint, and a `pt` there would lose to the theme's `py`
  root: 'overflow-hidden border-b border-default pt-14 sm:pt-22',
  container: 'relative py-0 sm:py-0 lg:py-0 gap-0',
  wrapper: 'text-start',
  headline: 'justify-start mb-6',
  title: 'max-w-205 text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] tracking-[-.035em] text-balance',
  description: 'max-w-145 text-base sm:text-[17px] leading-relaxed text-pretty',
  footer: 'mt-8',
  links: 'justify-start gap-2.5',
  ...props.ui
}))
</script>

<template>
  <UPageHero v-bind="heroProps" :ui="ui">
    <template #top>
      <!-- A dot grid fading in and out vertically, so the type sits on texture
           rather than on a hard band. -->
      <div aria-hidden="true" class="absolute inset-0 pointer-events-none bg-[radial-gradient(var(--ui-border-accented)_1px,transparent_1px)] bg-size-[28px_28px] opacity-50 mask-[linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />

      <!-- The horizon: a glow rising from the bottom edge, under a hairline
           that fades out at both ends. -->
      <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-45 pointer-events-none bg-linear-to-t from-primary/15 to-transparent" />
      <div aria-hidden="true" class="absolute inset-x-0 bottom-0 h-px pointer-events-none bg-[linear-gradient(to_right,transparent,var(--ui-primary)_30%,var(--ui-primary)_70%,transparent)]" />

      <slot name="top" />
    </template>

    <template v-if="badge" #headline>
      <UBadge
        :as="badge.to ? NuxtLink : 'span'"
        color="neutral"
        variant="outline"
        v-bind="badge"
        class="rounded-full bg-default font-medium text-muted"
        :class="badge.to && 'hover:text-highlighted hover:ring-accented transition-colors'"
        :ui="{ leadingIcon: 'text-primary', trailingIcon: 'text-primary' }"
      />
    </template>

    <template v-if="lead || accent" #title>
      {{ leadText }}<br v-if="breakLine"><span class="text-[1.13em] tracking-[-.02em] text-primary font-semibold">{{ accent }}</span>
    </template>

    <template v-for="name in forwarded" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>

    <template #bottom>
      <slot name="bottom" />

      <div class="h-12 sm:h-16" />
    </template>
  </UPageHero>
</template>
