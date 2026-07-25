<script setup lang="ts">
import {
  PlaygroundInput,
  PlaygroundCommandPalette,
  PlaygroundCalendar,
  PlaygroundButtons,
  PlaygroundNotifications,
  PlaygroundTransactions,
  PlaygroundTransferFunds,
  PlaygroundInviteTeam,
  PlaygroundAnalytics,
  PlaygroundPinInput,
  PlaygroundBadges,
  PlaygroundDashboard,
  PlaygroundReportBug,
  PlaygroundGoal,
  PlaygroundSavingsTargets,
  PlaygroundTypography,
  PlaygroundShortcuts,
  PlaygroundNavigation,
  PlaygroundColorPicker,
  PlaygroundEmpty,
  PlaygroundAnnouncement,
  PlaygroundTabs,
  PlaygroundContributors,
  PlaygroundAuthForm,
  PlaygroundPrompt
} from '#components'

// Live, interactive component showcase — the Theme Studio's grid view, laid
// out as a virtualized masonry (UScrollArea lanes) of content-sized cards à
// la shadcn/HeroUI. Each tile is a self-contained, product-like block
// (header + body + footer action). Overlays are only shown embedded in
// richer examples (command palette, dashboard dropdown, select menus, auth
// form, chat), never as bare triggers.
const tiles = [
  { name: 'input', component: PlaygroundInput },
  { name: 'command-palette', component: PlaygroundCommandPalette },
  { name: 'calendar', component: PlaygroundCalendar },
  { name: 'buttons', component: PlaygroundButtons },
  { name: 'notifications', component: PlaygroundNotifications },
  { name: 'transactions', component: PlaygroundTransactions },
  { name: 'transfer-funds', component: PlaygroundTransferFunds },
  { name: 'invite-team', component: PlaygroundInviteTeam },
  { name: 'analytics', component: PlaygroundAnalytics },
  { name: 'pin-input', component: PlaygroundPinInput },
  { name: 'badges', component: PlaygroundBadges },
  { name: 'dashboard', component: PlaygroundDashboard },
  { name: 'report-bug', component: PlaygroundReportBug },
  { name: 'goal', component: PlaygroundGoal },
  { name: 'savings-targets', component: PlaygroundSavingsTargets },
  { name: 'typography', component: PlaygroundTypography },
  { name: 'shortcuts', component: PlaygroundShortcuts },
  { name: 'navigation', component: PlaygroundNavigation },
  { name: 'color-picker', component: PlaygroundColorPicker },
  { name: 'empty', component: PlaygroundEmpty },
  { name: 'announcement', component: PlaygroundAnnouncement },
  { name: 'tabs', component: PlaygroundTabs },
  { name: 'contributors', component: PlaygroundContributors },
  { name: 'auth-form', component: PlaygroundAuthForm },
  { name: 'prompt', component: PlaygroundPrompt }
]

// Lanes follow the CONTAINER, not the viewport — the preview pane changes
// width with fullscreen. Tile count follows lanes (the old per-breakpoint
// reveal) so narrow layouts aren't one endless column.
const scrollArea = useTemplateRef('scrollArea')
const { width } = useElementSize(computed(() => scrollArea.value?.$el))
const lanes = computed(() => width.value >= 1200 ? 4 : width.value >= 900 ? 3 : width.value >= 600 ? 2 : 1)

const REVEAL_COUNTS = [6, 12, 19, tiles.length] as const
const visibleTiles = computed(() => tiles.slice(0, REVEAL_COUNTS[lanes.value - 1]))
</script>

<template>
  <UScrollArea
    ref="scrollArea"
    :items="visibleTiles"
    :virtualize="{
      lanes,
      gap: 16,
      estimateSize: 360,
      paddingStart: 24,
      paddingEnd: 24,
      overscan: 0,
      getItemKey: (index: number) => visibleTiles[index]!.name
    }"
    class="playground-grid h-full px-4 sm:px-6"
  >
    <template #default="{ item }">
      <PlaygroundCard>
        <component :is="item.component" />
      </PlaygroundCard>
    </template>
  </UScrollArea>
</template>
