<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { DropdownMenuItem, NavigationMenuItem, TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')

const teams = [
  { label: 'Nuxt', avatar: { src: 'https://github.com/nuxt.png', alt: 'Nuxt' } },
  { label: 'NuxtHub', avatar: { src: 'https://github.com/nuxt-hub.png', alt: 'NuxtHub' } },
  { label: 'NuxtLabs', avatar: { src: 'https://github.com/nuxtlabs.png', alt: 'NuxtLabs' } }
]
const selectedTeam = ref(teams[0]!)

const teamItems = computed<DropdownMenuItem[][]>(() => [
  teams.map(team => ({ ...team, onSelect: () => { selectedTeam.value = team } })),
  [
    { label: 'Create team', icon: 'i-lucide-circle-plus' },
    { label: 'Manage teams', icon: 'i-lucide-cog' }
  ]
])

const links: NavigationMenuItem[][] = [[{
  label: 'Home',
  icon: 'i-lucide-house',
  active: true
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  badge: '4'
}, {
  label: 'Customers',
  icon: 'i-lucide-users'
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  type: 'trigger',
  children: [
    { label: 'General' },
    { label: 'Members' },
    { label: 'Notifications' },
    { label: 'Security' }
  ]
}], [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info'
}]]

const user = {
  name: 'Benjamin Canac',
  avatar: { src: 'https://github.com/benjamincanac.png', alt: 'Benjamin Canac' }
}

const userItems: DropdownMenuItem[][] = [[{
  type: 'label',
  label: user.name,
  avatar: user.avatar
}], [
  { label: 'Profile', icon: 'i-lucide-user' },
  { label: 'Billing', icon: 'i-lucide-credit-card' },
  { label: 'Settings', icon: 'i-lucide-settings' }
], [
  { label: 'Log out', icon: 'i-lucide-log-out' }
]]

const newItems: DropdownMenuItem[][] = [[
  { label: 'New mail', icon: 'i-lucide-send' },
  { label: 'New customer', icon: 'i-lucide-user-plus' }
]]

const periodItems = ['Daily', 'Weekly', 'Monthly']
const period = ref('Daily')

const stats = [
  { title: 'Customers', icon: 'i-lucide-users', value: '892', variation: 14 },
  { title: 'Conversions', icon: 'i-lucide-chart-pie', value: '1,436', variation: 8 },
  { title: 'Revenue', icon: 'i-lucide-circle-dollar-sign', value: '$312,540', variation: 23 },
  { title: 'Orders', icon: 'i-lucide-shopping-cart', value: '254', variation: -5 }
]

const revenue = [6200, 7400, 6800, 9100, 8600, 10400, 9800, 11900, 11200, 13000, 12400, 14100, 13600, 15200]
const revenueMin = Math.min(...revenue)
const revenueMax = Math.max(...revenue)
const chartPoints = revenue
  .map((value, index) => `${(index * (400 / (revenue.length - 1))).toFixed(1)},${(110 - ((value - revenueMin) / (revenueMax - revenueMin)) * 100).toFixed(1)}`)
  .join(' ')
const chartArea = `0,120 ${chartPoints} 400,120`
const chartTicks = ['22 Jun', '26 Jun', '30 Jun', '3 Jul', '6 Jul']
const revenueTotal = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format(revenue.reduce((acc, amount) => acc + amount, 0))

type Sale = {
  id: string
  date: string
  status: 'paid' | 'failed' | 'refunded'
  email: string
  amount: number
}

const sales: Sale[] = [
  { id: '4600', date: 'Jul 6, 14:32', status: 'paid', email: 'james.anderson@example.com', amount: 594 },
  { id: '4599', date: 'Jul 6, 11:05', status: 'failed', email: 'mia.white@example.com', amount: 276 },
  { id: '4598', date: 'Jul 5, 22:47', status: 'refunded', email: 'william.brown@example.com', amount: 315 },
  { id: '4597', date: 'Jul 5, 18:20', status: 'paid', email: 'emma.davis@example.com', amount: 529 },
  { id: '4596', date: 'Jul 5, 09:12', status: 'paid', email: 'ethan.harris@example.com', amount: 639 }
]

const salesColumns: TableColumn<Sale>[] = [{
  accessorKey: 'id',
  header: 'ID',
  cell: ({ row }) => `#${row.getValue('id')}`
}, {
  accessorKey: 'date',
  header: 'Date'
}, {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const color = ({
      paid: 'success' as const,
      failed: 'error' as const,
      refunded: 'neutral' as const
    })[row.getValue('status') as string]

    return h(UBadge, { class: 'capitalize', color }, () => row.getValue('status'))
  }
}, {
  accessorKey: 'email',
  header: 'Email'
}, {
  accessorKey: 'amount',
  header: 'Amount',
  meta: {
    class: {
      th: 'text-right',
      td: 'text-right font-medium'
    }
  },
  cell: ({ row }) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR'
    }).format(Number.parseFloat(row.getValue('amount')))
  }
}]
</script>

<template>
  <!-- UDashboardGroup is `fixed inset-0` by default: contain it in the preview pane instead. -->
  <UDashboardGroup
    unit="rem"
    :persistent="false"
    class="relative inset-auto h-full w-full"
  >
    <UDashboardSidebar
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ root: 'flex min-h-0', footer: 'border-t border-default' }"
    >
      <template #header="{ collapsed }">
        <UDropdownMenu
          :items="teamItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }"
        >
          <UButton
            v-bind="{
              ...selectedTeam,
              label: collapsed ? undefined : selectedTeam.label,
              trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
            }"
            color="neutral"
            variant="ghost"
            block
            :square="collapsed"
            class="data-[state=open]:bg-elevated"
            :class="[!collapsed && 'py-2']"
            :ui="{ trailingIcon: 'text-dimmed' }"
          />
        </UDropdownMenu>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UDropdownMenu
          :items="userItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
        >
          <UButton
            v-bind="{
              ...user,
              label: collapsed ? undefined : user.name,
              trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
            }"
            color="neutral"
            variant="ghost"
            block
            :square="collapsed"
            class="data-[state=open]:bg-elevated"
            :ui="{ trailingIcon: 'text-dimmed' }"
          />
        </UDropdownMenu>
      </template>
    </UDashboardSidebar>

    <UDashboardPanel :ui="{ root: 'min-h-0' }">
      <template #header>
        <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>

          <template #right>
            <UTooltip text="Notifications" :shortcuts="['N']">
              <UButton color="neutral" variant="ghost" square aria-label="Notifications">
                <UChip color="error" inset>
                  <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
                </UChip>
              </UButton>
            </UTooltip>

            <UDropdownMenu :items="newItems">
              <UButton icon="i-lucide-plus" class="rounded-full" aria-label="New" />
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>

        <UDashboardToolbar>
          <template #left>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-calendar"
              label="Jun 22 - Jul 6, 2026"
              class="-ms-1"
            />

            <USelect v-model="period" :items="periodItems" class="w-28" />
          </template>
        </UDashboardToolbar>
      </template>

      <template #body>
        <!-- The preview pane is far narrower than the real template's page —
             two-up until xl, and the joined-border look only when four fit. -->
        <!-- shrink-0 everywhere: the panel body is a scrollable flex column,
             and a shrinking child gets crushed into its own overflow-hidden -->
        <UPageGrid class="shrink-0 grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-[var(--studio-border-width,1px)]">
          <UPageCard
            v-for="stat in stats"
            :key="stat.title"
            :icon="stat.icon"
            :title="stat.title"
            :ui="{
              container: 'gap-y-1.5',
              wrapper: 'items-start',
              leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
              title: 'font-normal text-muted text-xs uppercase'
            }"
            class="xl:rounded-none xl:first:rounded-l-lg xl:last:rounded-r-lg hover:z-1"
          >
            <div class="flex items-center gap-2 flex-wrap min-w-0">
              <span class="text-2xl font-semibold text-highlighted">
                {{ stat.value }}
              </span>

              <UBadge :color="stat.variation > 0 ? 'success' : 'error'" class="text-xs">
                {{ stat.variation > 0 ? '+' : '' }}{{ stat.variation }}%
              </UBadge>
            </div>
          </UPageCard>
        </UPageGrid>

        <UCard class="shrink-0" :ui="{ body: 'px-0! pt-0! pb-3!' }">
          <template #header>
            <div>
              <p class="text-xs text-muted uppercase mb-1.5">
                Revenue
              </p>
              <p class="text-3xl text-highlighted font-semibold">
                {{ revenueTotal }}
              </p>
            </div>
          </template>

          <svg
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
            class="w-full h-40 text-primary"
            aria-hidden="true"
          >
            <polygon :points="chartArea" fill="currentColor" class="opacity-10" />
            <polyline
              :points="chartPoints"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              vector-effect="non-scaling-stroke"
            />
          </svg>

          <div class="flex items-center justify-between px-4 sm:px-6 pt-2 text-xs text-dimmed">
            <span v-for="tick in chartTicks" :key="tick">{{ tick }}</span>
          </div>
        </UCard>

        <UTable
          :data="sales"
          :columns="salesColumns"
          class="shrink-0"
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l-[length:var(--studio-border-width,1px)] last:border-r-[length:var(--studio-border-width,1px)]',
            td: 'border-b border-default'
          }"
        />
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
