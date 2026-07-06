<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import { CalendarDate } from '@internationalized/date'
import type { TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')

const toast = useToast()

const variants = ['solid', 'outline', 'soft', 'subtle', 'ghost'] as const

const checked = ref(true)
const switched = ref(true)
const slider = ref(40)
const page = ref(3)
const pin = ref([])
const calendarDate = shallowRef(new CalendarDate(2026, 7, 5))

const tabItems = [
  { label: 'Account', icon: 'i-lucide-user' },
  { label: 'Password', icon: 'i-lucide-lock' },
  { label: 'Billing', icon: 'i-lucide-credit-card' }
]

const breadcrumbItems = [
  { label: 'Home', icon: 'i-lucide-house' },
  { label: 'Components', to: '/docs/components' },
  { label: 'Theme Studio' }
]

const accordionItems = [
  { label: 'Is it accessible?', icon: 'i-lucide-accessibility', content: 'Yes. It adheres to the WAI-ARIA design pattern.' },
  { label: 'Is it themeable?', icon: 'i-lucide-swatch-book', content: 'Yes. That is rather the point of this page.' }
]

const selectItems = ['Backlog', 'Todo', 'In Progress', 'Done']
const selectValue = ref('Todo')

type Invoice = {
  id: string
  customer: string
  status: 'paid' | 'pending' | 'failed'
  amount: number
}

const invoices: Invoice[] = [
  { id: '3021', customer: 'Alex Turner', status: 'paid', amount: 594 },
  { id: '3022', customer: 'Mia Chen', status: 'pending', amount: 276 },
  { id: '3023', customer: 'Sam Ortiz', status: 'failed', amount: 315 },
  { id: '3024', customer: 'Emma Davis', status: 'paid', amount: 529 }
]

const invoiceColumns: TableColumn<Invoice>[] = [{
  accessorKey: 'id',
  header: '#',
  cell: ({ row }) => `#${row.getValue('id')}`
}, {
  accessorKey: 'customer',
  header: 'Customer'
}, {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const color = ({
      paid: 'success' as const,
      pending: 'warning' as const,
      failed: 'error' as const
    })[row.getValue('status') as string]

    return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'))
  }
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

const stats = [
  { label: 'Revenue', value: '$45.2k', delta: '+12%', color: 'success' as const },
  { label: 'Users', value: '2,350', delta: '+8%', color: 'success' as const },
  { label: 'Churn', value: '1.9%', delta: '-4%', color: 'error' as const },
  { label: 'Sessions', value: '12.4k', delta: '+23%', color: 'success' as const }
]

const chatMessage = ref('')

const roleItems = ['Owner', 'Member', 'Viewer']
const teamMembers = ref([
  { name: 'Benjamin Canac', username: 'benjamincanac', role: 'Owner' },
  { name: 'Sébastien Chopin', username: 'atinux', role: 'Member' },
  { name: 'Daniel Roe', username: 'danielroe', role: 'Viewer' }
])

const notificationSettings = ref([
  { label: 'Email digest', description: 'A weekly summary of activity.', enabled: true },
  { label: 'Push notifications', description: 'Mentions, replies and reactions.', enabled: true },
  { label: 'Marketing emails', description: 'Product news and tips.', enabled: false }
])

function showToast() {
  toast.add({
    title: 'Theme applied',
    description: 'This toast is styled by your theme too.',
    icon: 'i-lucide-swatch-book'
  })
}
</script>

<template>
  <div class="columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4 p-4">
    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Buttons
      </p>

      <div v-for="color in ['primary', 'neutral', 'error'] as const" :key="color" class="flex flex-wrap items-center gap-2">
        <UButton
          v-for="variant in variants"
          :key="variant"
          :color="color"
          :variant="variant"
          :label="variant"

          class="capitalize"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UButton icon="i-lucide-plus" label="New item" />
        <UButton
          icon="i-lucide-settings"

          color="neutral"
          variant="outline"
          square
          aria-label="Settings"
        />
        <UButton color="neutral" variant="ghost" label="Cancel" />
        <UButton loading label="Saving" />
      </div>
    </UCard>

    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-4' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Form
      </p>

      <UFormField label="Email" required help="We'll never share it.">
        <UInput icon="i-lucide-at-sign" placeholder="you@example.com" class="w-full" />
      </UFormField>

      <UFormField label="Status">
        <USelect v-model="selectValue" :items="selectItems" class="w-full" />
      </UFormField>

      <div class="flex items-center justify-between gap-4">
        <UCheckbox v-model="checked" label="Remember me" />
        <USwitch v-model="switched" label="Notifications" />
      </div>

      <USlider v-model="slider" />

      <UButton label="Submit" block />
    </UCard>

    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Feedback
      </p>

      <UAlert
        title="Heads up!"
        description="Semantic tokens keep this readable in any theme."
        icon="i-lucide-terminal"
        color="primary"
        variant="subtle"
      />

      <div class="flex flex-wrap items-center gap-2">
        <UBadge label="Badge" />
        <UBadge label="Outline" variant="outline" />
        <UBadge label="Soft" variant="soft" color="neutral" />
        <UBadge label="Subtle" variant="subtle" color="error" />
        <UBadge label="Success" variant="subtle" color="success" />
      </div>

      <UProgress :model-value="65" />

      <div class="flex items-center gap-2">
        <UButton
          label="Show toast"
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-lucide-bell"
          @click="showToast"
        />
        <UTooltip text="Tooltips follow the theme too">
          <UButton label="Hover me" color="neutral" variant="ghost" size="sm" />
        </UTooltip>
      </div>
    </UCard>

    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Navigation
      </p>

      <UBreadcrumb :items="breadcrumbItems" />

      <UTabs :items="tabItems" :content="false" />

      <UPagination v-model:page="page" :total="50" size="sm" />
    </UCard>

    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Content
      </p>

      <div class="flex items-center gap-3">
        <UChip inset color="success">
          <UAvatar src="https://avatars.githubusercontent.com/u/22576486" alt="Mike Newbon" />
        </UChip>
        <div class="text-sm">
          <p class="font-medium text-highlighted">
            Mike Newbon
          </p>
          <p class="text-muted">
            mikenewbon
          </p>
        </div>
        <UButton
          label="Follow"
          to="https://github.com/mikenewbon"
          target="_blank"
          size="xs"
          color="neutral"
          variant="subtle"
          class="ms-auto"
        />
      </div>

      <USeparator />

      <UAccordion :items="accordionItems" />

      <div class="flex items-center gap-1.5 text-sm text-muted">
        Press

        <UKbd value="meta" />
        <UKbd value="K" />

        to search
      </div>
    </UCard>

    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-3 items-center' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide self-start">
        Pickers
      </p>

      <UCalendar v-model="calendarDate" size="sm" class="w-full" />

      <UPinInput v-model="pin" :length="4" placeholder="○" />
    </UCard>

    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Table
      </p>

      <UTable :data="invoices" :columns="invoiceColumns" class="border-[length:var(--studio-border-width,1px)] border-default rounded-md" />
    </UCard>

    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Stats
      </p>

      <div class="grid grid-cols-2 gap-3">
        <div v-for="stat in stats" :key="stat.label" class="flex flex-col gap-1 p-3 rounded-lg bg-elevated/50">
          <p class="text-xs text-muted">
            {{ stat.label }}
          </p>
          <div class="flex items-center justify-between gap-2">
            <p class="text-2xl font-bold text-highlighted">
              {{ stat.value }}
            </p>
            <UBadge :label="stat.delta" :color="stat.color" variant="subtle" size="sm" />
          </div>
        </div>
      </div>
    </UCard>

    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Chat
      </p>

      <div class="text-sm bg-elevated rounded-lg px-3 py-2 me-8">
        Hey! How does this bubble look with your primary color?
      </div>
      <div class="text-sm bg-primary text-inverted rounded-lg px-3 py-2 ms-auto max-w-[80%]">
        Looking sharp, ship it.
      </div>

      <div class="flex items-center gap-2">
        <UInput v-model="chatMessage" placeholder="Type a message..." class="flex-1" />
        <UButton icon="i-lucide-send" square aria-label="Send message" />
      </div>
    </UCard>

    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Team
      </p>

      <div v-for="member in teamMembers" :key="member.username" class="flex items-center gap-3">
        <UAvatar :src="`https://github.com/${member.username}.png`" :alt="member.name" />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-highlighted truncate">
            {{ member.name }}
          </p>
          <p class="text-xs text-muted truncate">
            {{ member.role }}
          </p>
        </div>
        <USelect v-model="member.role" :items="roleItems" size="sm" class="w-28" />
      </div>

      <UButton label="Invite member" icon="i-lucide-user-plus" variant="soft" block />
    </UCard>

    <UCard class="break-inside-avoid" :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Notifications
      </p>

      <template v-for="(setting, index) in notificationSettings" :key="setting.label">
        <USeparator v-if="index > 0" />

        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm text-highlighted">
              {{ setting.label }}
            </p>
            <p class="text-xs text-muted">
              {{ setting.description }}
            </p>
          </div>
          <USwitch v-model="setting.enabled" />
        </div>
      </template>
    </UCard>
  </div>
</template>
