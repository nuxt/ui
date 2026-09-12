<script setup lang="ts">
import {
  PlaygroundInput,
  PlaygroundCommandPalette,
  PlaygroundCalendar,
  PlaygroundNotifications,
  PlaygroundTransactions,
  PlaygroundTransferFunds,
  PlaygroundInviteTeam,
  PlaygroundAnalytics,
  PlaygroundPinInput,
  PlaygroundDashboard,
  PlaygroundReportBug,
  PlaygroundGoal,
  PlaygroundSavingsTargets,
  PlaygroundShortcuts,
  PlaygroundNavigation,
  PlaygroundEmpty,
  PlaygroundAnnouncement,
  PlaygroundTabs,
  PlaygroundContributors,
  PlaygroundAuthForm,
  PlaygroundPrompt
} from '#components'

// Live, interactive component showcase, the Theme Studio's grid view, laid
// out as a virtualized masonry (UScrollArea lanes) of content-sized cards à
// la shadcn/HeroUI. Each tile is a self-contained, product-like block
// (header + body + footer action). Overlays are only shown embedded in
// richer examples (command palette, dashboard dropdown, select menus, auth
// form, chat), never as bare triggers.
const tiles = [
  { name: 'input', component: PlaygroundInput },
  { name: 'command-palette', component: PlaygroundCommandPalette },
  { name: 'calendar', component: PlaygroundCalendar },
  { name: 'notifications', component: PlaygroundNotifications },
  { name: 'transactions', component: PlaygroundTransactions },
  { name: 'transfer-funds', component: PlaygroundTransferFunds },
  { name: 'invite-team', component: PlaygroundInviteTeam },
  { name: 'analytics', component: PlaygroundAnalytics },
  { name: 'pin-input', component: PlaygroundPinInput },
  { name: 'dashboard', component: PlaygroundDashboard },
  { name: 'report-bug', component: PlaygroundReportBug },
  { name: 'goal', component: PlaygroundGoal },
  { name: 'savings-targets', component: PlaygroundSavingsTargets },
  { name: 'shortcuts', component: PlaygroundShortcuts },
  { name: 'navigation', component: PlaygroundNavigation },
  { name: 'empty', component: PlaygroundEmpty },
  { name: 'announcement', component: PlaygroundAnnouncement },
  { name: 'tabs', component: PlaygroundTabs },
  { name: 'contributors', component: PlaygroundContributors },
  { name: 'auth-form', component: PlaygroundAuthForm },
  { name: 'prompt', component: PlaygroundPrompt }
]

// Lanes follow the CONTAINER, not the viewport, the preview pane changes
// width with fullscreen. Tile count follows lanes (the old per-breakpoint
// reveal) so narrow layouts aren't one endless column.
/**
 * The landing renders the same tiles without the virtualizer: it shows them
 * all anyway, and a virtualized wall needs a measured DOM, so the server
 * would paint an empty box that only fills in on hydration.
 */
defineProps<{ static?: boolean }>()

const scrollArea = useTemplateRef('scrollArea')
// border-box: `compact` below switches this element's own padding, and a
// content-box width that moves with it would flip back and forth forever
const { width } = useElementSize(computed(() => scrollArea.value?.$el), undefined, { box: 'border-box' })
const lanes = computed(() => width.value >= 1200 ? 4 : width.value >= 900 ? 3 : width.value >= 600 ? 2 : 1)

// The gutters follow the container too, so the vertical padding matches the
// horizontal one and the tiles sit in an even frame at every width.
const compact = computed(() => width.value > 0 && width.value < 600)
const padding = computed(() => (compact.value ? 16 : 24))

const REVEAL_COUNTS = [6, 12, 19, tiles.length] as const
const visibleTiles = computed(() => tiles.slice(0, REVEAL_COUNTS[lanes.value - 1]))
</script>

<template>
  <!-- CSS columns, so the server paints the wall it will keep: the lanes and
       the tile count come from container queries rather than measurement. -->
  <div v-if="static" class="playground-wall">
    <div class="wall">
      <PlaygroundCard v-for="tile in tiles" :key="tile.name">
        <component :is="tile.component" />
      </PlaygroundCard>
    </div>
  </div>

  <UScrollArea
    v-else
    ref="scrollArea"
    :items="visibleTiles"
    :virtualize="{
      lanes,
      gap: 16,
      estimateSize: 360,
      paddingStart: padding,
      paddingEnd: padding,
      overscan: 0,
      getItemKey: (index: number) => visibleTiles[index]!.name
    }"
    :class="['playground-grid h-full', compact ? 'px-4' : 'px-6']"
  >
    <template #default="{ item }">
      <PlaygroundCard>
        <component :is="item.component" />
      </PlaygroundCard>
    </template>
  </UScrollArea>
</template>

<style scoped>
/* The lanes follow this box, not the viewport: the studio and the landing
   hand the wall very different widths. */
.playground-wall {
  container-type: inline-size;
}

.wall {
  padding: 16px;
  columns: 1;
  gap: 16px;
}

.wall > * {
  margin-bottom: 16px;
  break-inside: avoid;
}

/* Every tile, at every width: the lanes carry the narrow layouts rather than
   a shorter list. */
@container (min-width: 600px) {
  .wall { padding: 24px; columns: 2; }
}

@container (min-width: 900px) {
  .wall { columns: 3; }
}

@container (min-width: 1200px) {
  .wall { columns: 4; }
}
</style>
