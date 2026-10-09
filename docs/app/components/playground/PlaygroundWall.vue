<script setup lang="ts">
// The landing's wall: the Theme Studio's grid tiles without the virtualizer.
// It shows them all anyway, and a virtualized wall needs a measured DOM, so
// the server would paint an empty box that only fills in on hydration.
// Each tile hydrates on its own once it scrolls into view, so a phone only
// pays for the one or two it opens on.
const Input = defineLazyHydrationComponent('visible', () => import('./PlaygroundInput.vue'))
const CommandPalette = defineLazyHydrationComponent('visible', () => import('./PlaygroundCommandPalette.vue'))
const Calendar = defineLazyHydrationComponent('visible', () => import('./PlaygroundCalendar.vue'))
const Notifications = defineLazyHydrationComponent('visible', () => import('./PlaygroundNotifications.vue'))
const Transactions = defineLazyHydrationComponent('visible', () => import('./PlaygroundTransactions.vue'))
const TransferFunds = defineLazyHydrationComponent('visible', () => import('./PlaygroundTransferFunds.vue'))
const InviteTeam = defineLazyHydrationComponent('visible', () => import('./PlaygroundInviteTeam.vue'))
const Analytics = defineLazyHydrationComponent('visible', () => import('./PlaygroundAnalytics.vue'))
const PinInput = defineLazyHydrationComponent('visible', () => import('./PlaygroundPinInput.vue'))
const Dashboard = defineLazyHydrationComponent('visible', () => import('./PlaygroundDashboard.vue'))
const ReportBug = defineLazyHydrationComponent('visible', () => import('./PlaygroundReportBug.vue'))
const Goal = defineLazyHydrationComponent('visible', () => import('./PlaygroundGoal.vue'))
const SavingsTargets = defineLazyHydrationComponent('visible', () => import('./PlaygroundSavingsTargets.vue'))
const Shortcuts = defineLazyHydrationComponent('visible', () => import('./PlaygroundShortcuts.vue'))
const Navigation = defineLazyHydrationComponent('visible', () => import('./PlaygroundNavigation.vue'))
const Empty = defineLazyHydrationComponent('visible', () => import('./PlaygroundEmpty.vue'))
const Announcement = defineLazyHydrationComponent('visible', () => import('./PlaygroundAnnouncement.vue'))
const Tabs = defineLazyHydrationComponent('visible', () => import('./PlaygroundTabs.vue'))
const Contributors = defineLazyHydrationComponent('visible', () => import('./PlaygroundContributors.vue'))
const AuthForm = defineLazyHydrationComponent('visible', () => import('./PlaygroundAuthForm.vue'))
const Prompt = defineLazyHydrationComponent('visible', () => import('./PlaygroundPrompt.vue'))

const tiles = [
  { name: 'input', component: Input },
  { name: 'command-palette', component: CommandPalette },
  { name: 'calendar', component: Calendar },
  { name: 'notifications', component: Notifications },
  { name: 'transactions', component: Transactions },
  { name: 'transfer-funds', component: TransferFunds },
  { name: 'invite-team', component: InviteTeam },
  { name: 'analytics', component: Analytics },
  { name: 'pin-input', component: PinInput },
  { name: 'dashboard', component: Dashboard },
  { name: 'report-bug', component: ReportBug },
  { name: 'goal', component: Goal },
  { name: 'savings-targets', component: SavingsTargets },
  { name: 'shortcuts', component: Shortcuts },
  { name: 'navigation', component: Navigation },
  { name: 'empty', component: Empty },
  { name: 'announcement', component: Announcement },
  { name: 'tabs', component: Tabs },
  { name: 'contributors', component: Contributors },
  { name: 'auth-form', component: AuthForm },
  { name: 'prompt', component: Prompt }
]
</script>

<template>
  <!-- CSS columns, so the server paints the wall it will keep: the lanes and
       the tile count come from container queries rather than measurement. -->
  <div class="playground-wall">
    <div class="wall">
      <PlaygroundCard v-for="tile in tiles" :key="tile.name">
        <component :is="tile.component" />
      </PlaygroundCard>
    </div>
  </div>
</template>

<style scoped>
/* The lanes follow this box, not the viewport. */
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
