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
// out as a masonry of content-sized cards à la shadcn/HeroUI. Each tile is a
// self-contained, product-like block (header + body + footer action). Overlays
// are only shown embedded in richer examples (command palette, dashboard
// dropdown, select menus, auth form, chat), never as bare triggers. Tiles are
// progressively revealed as the viewport widens to keep the columns balanced.
const tiles = [
  { name: 'input', component: PlaygroundInput, class: '' },
  { name: 'command-palette', component: PlaygroundCommandPalette, class: '' },
  { name: 'calendar', component: PlaygroundCalendar, class: '' },
  { name: 'buttons', component: PlaygroundButtons, class: '' },
  { name: 'notifications', component: PlaygroundNotifications, class: '' },
  { name: 'transactions', component: PlaygroundTransactions, class: '' },
  { name: 'transfer-funds', component: PlaygroundTransferFunds, class: 'hidden sm:block' },
  { name: 'invite-team', component: PlaygroundInviteTeam, class: 'hidden sm:block' },
  { name: 'analytics', component: PlaygroundAnalytics, class: 'hidden sm:block' },
  { name: 'pin-input', component: PlaygroundPinInput, class: 'hidden sm:block' },
  { name: 'badges', component: PlaygroundBadges, class: 'hidden sm:block' },
  { name: 'dashboard', component: PlaygroundDashboard, class: 'hidden sm:block' },
  { name: 'report-bug', component: PlaygroundReportBug, class: 'hidden lg:block' },
  { name: 'goal', component: PlaygroundGoal, class: 'hidden lg:block' },
  { name: 'savings-targets', component: PlaygroundSavingsTargets, class: 'hidden lg:block' },
  { name: 'typography', component: PlaygroundTypography, class: 'hidden lg:block' },
  { name: 'shortcuts', component: PlaygroundShortcuts, class: 'hidden lg:block' },
  { name: 'navigation', component: PlaygroundNavigation, class: 'hidden lg:block' },
  { name: 'color-picker', component: PlaygroundColorPicker, class: 'hidden lg:block' },
  { name: 'empty', component: PlaygroundEmpty, class: 'hidden xl:block' },
  { name: 'announcement', component: PlaygroundAnnouncement, class: 'hidden xl:block' },
  { name: 'tabs', component: PlaygroundTabs, class: 'hidden xl:block' },
  { name: 'contributors', component: PlaygroundContributors, class: 'hidden xl:block' },
  { name: 'auth-form', component: PlaygroundAuthForm, class: 'hidden xl:block' },
  { name: 'prompt', component: PlaygroundPrompt, class: 'hidden xl:block' }
]

const columnsClass = 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4'
</script>

<template>
  <div class="w-full mx-auto px-4 sm:px-6">
    <div :class="columnsClass">
      <PlaygroundCard v-for="tile in tiles" :key="tile.name" :class="tile.class">
        <component :is="tile.component" />
      </PlaygroundCard>
    </div>
  </div>
</template>
