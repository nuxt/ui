<script setup lang="ts">
import { reactiveOmit } from '@vueuse/core'
import type { ButtonProps, PageHeroProps, PageHeroSlots } from '@nuxt/ui'

const props = withDefaults(defineProps<PageHeroProps & {
  /** The pill above the title: its label, or button props (`to` makes it a link). */
  badge?: string | ButtonProps
  /** The title's first half. */
  lead?: string
  /** Its second half, in primary. */
  accent?: string
  /** Break between the halves rather than running them on one line. */
  breakLine?: boolean
}>(), {
  orientation: 'horizontal'
})

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

// The cells of the dot grid that twinkle, as [column, row] on its 28px
// lattice: a fixed pick rather than a random one, so the server and the
// client draw the same dots, spread from the left edge so a phone gets its
// share. Each runs its own cycle, offset so they never pulse together.
const TWINKLES = [
  [1, 3], [3, 11], [5, 6], [8, 15], [10, 2], [12, 9], [14, 17], [17, 5], [19, 12], [22, 1], [24, 8], [26, 14],
  [29, 4], [31, 10], [34, 16], [36, 7], [38, 2], [41, 13], [43, 6], [46, 18], [48, 3], [50, 11], [53, 8], [56, 15]
]
const twinkles = TWINKLES.map(([col, row], index) => ({
  // 13px: the cell's center less half the 2px dot
  left: `${col! * 28 + 13}px`,
  top: `${row! * 28 + 13}px`,
  animationDelay: `${(index * 0.9) % 5}s`,
  animationDuration: `${3 + (index % 4) * 0.5}s`
}))

// The library hero comes with generous padding; the docs one opens under the
// header and leaves the bottom to the `bottom` slot. Plain object, not a
// computed: `slots` isn't reactive, so there would be nothing to recompute.
const ui = {
  // the top padding sits on the root: the container's own responsive padding
  // is zeroed per breakpoint, and a `pt` there would lose to the theme's `py`
  root: 'overflow-hidden border-b border-default pt-14 sm:pt-22',
  // the second column only exists for a default slot: without one the text
  // keeps the width, and the placeholder that would fill it gets no gap
  container: ['py-0 sm:py-0 lg:py-0', slots.default ? 'gap-8 sm:gap-y-8 lg:gap-x-9' : 'gap-0 sm:gap-0 lg:grid-cols-1'],
  headline: 'mb-6',
  title: 'text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] tracking-[-.035em] text-balance',
  description: 'max-w-152 text-base sm:text-[17px] leading-relaxed text-pretty',
  links: 'gap-x-3'
}
</script>

<template>
  <UPageHero v-bind="heroProps" :ui="ui">
    <template #top>
      <!-- A dot grid fading in and out vertically, so the type sits on texture
           rather than on a hard band. -->
      <div aria-hidden="true" class="absolute inset-0 pointer-events-none bg-[radial-gradient(var(--ui-border-accented)_1px,transparent_1px)] bg-size-[28px_28px] opacity-50 mask-[linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />

      <!-- The horizon: a glow rising from the bottom edge, under a hairline
           that fades out at both ends. Both take their strength from the
           primary's chroma (the `horizon` rule below), so a mono theme,
           whose primary is black or white, gets a faint line and no wash. -->
      <div aria-hidden="true" class="horizon absolute inset-x-0 bottom-0 h-45 pointer-events-none bg-linear-to-t from-(--horizon-glow) to-transparent" />
      <div aria-hidden="true" class="horizon absolute inset-x-0 bottom-0 h-px pointer-events-none bg-[linear-gradient(to_right,transparent,var(--horizon-line)_30%,var(--horizon-line)_70%,transparent)]" />

      <!-- A few of the grid's dots light up in primary, under the same fade as the grid. -->
      <div aria-hidden="true" class="absolute inset-0 pointer-events-none mask-[linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]">
        <span v-for="(twinkle, index) in twinkles" :key="index" class="twinkle absolute size-px rounded-full bg-primary opacity-0" :style="twinkle" />
      </div>

      <slot name="top" />
    </template>

    <template v-if="badge" #headline>
      <UButton
        as="span"
        color="primary"
        variant="soft"
        v-bind="badge"
        size="xs"
        class="rounded-full"
      />
    </template>

    <template v-if="lead || accent" #title>
      {{ leadText }}<br v-if="breakLine"><span class="text-primary font-semibold">{{ accent }}</span>
    </template>

    <template v-for="name in forwarded" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>

    <template #bottom>
      <slot name="bottom" />

      <div class="h-14 sm:h-22" />
    </template>
  </UPageHero>
</template>

<style scoped>
/* A vivid primary has a chroma around 0.2 in oklch, black and white have
   none: both alphas follow it from a floor, so a colored theme keeps about
   the 15% wash it had and a mono theme gets a hint of one rather than a
   gray band. */
.horizon {
  --horizon-glow: oklch(from var(--ui-primary) l c h / calc(0.06 + c * 0.45));
  --horizon-line: oklch(from var(--ui-primary) l c h / calc(0.35 + c * 3));
}

.twinkle {
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(2);
  }
}

/* the grid stays still, the dots with it */
@media (prefers-reduced-motion: reduce) {
  .twinkle {
    animation: none;
  }
}
</style>
