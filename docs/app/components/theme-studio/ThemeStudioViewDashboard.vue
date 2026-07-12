<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { DropdownMenuItem, NavigationMenuItem, TableColumn } from '@nuxt/ui'

const UAvatar = resolveComponent('UAvatar')
const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UDropdownMenu = resolveComponent('UDropdownMenu')

type Page = 'home' | 'inbox' | 'customers' | 'settings'
const page = ref<Page>('home')
const settingsSection = ref<'general' | 'notifications'>('general')

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

const links = computed<NavigationMenuItem[][]>(() => [[{
  label: 'Home',
  icon: 'i-lucide-house',
  active: page.value === 'home',
  onSelect: () => { page.value = 'home' }
}, {
  label: 'Inbox',
  icon: 'i-lucide-inbox',
  badge: String(unreadCount),
  active: page.value === 'inbox',
  onSelect: () => { page.value = 'inbox' }
}, {
  label: 'Customers',
  icon: 'i-lucide-users',
  active: page.value === 'customers',
  onSelect: () => { page.value = 'customers' }
}, {
  label: 'Settings',
  icon: 'i-lucide-settings',
  defaultOpen: true,
  type: 'trigger',
  active: page.value === 'settings',
  children: [{
    label: 'General',
    active: page.value === 'settings' && settingsSection.value === 'general',
    onSelect: () => {
      page.value = 'settings'
      settingsSection.value = 'general'
    }
  }, {
    label: 'Notifications',
    active: page.value === 'settings' && settingsSection.value === 'notifications',
    onSelect: () => {
      page.value = 'settings'
      settingsSection.value = 'notifications'
    }
  }]
}], [{
  label: 'Feedback',
  icon: 'i-lucide-message-circle'
}, {
  label: 'Help & Support',
  icon: 'i-lucide-info'
}]])

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

// Inbox — mirrors app/pages/inbox.vue + InboxList/InboxMail from the template,
// with dates pre-formatted as strings instead of pulling in date-fns.
type Mail = {
  id: number
  unread?: boolean
  from: { name: string, email: string, avatar: { src: string, alt: string } }
  subject: string
  date: string
  datetime: string
  body: string
}

const mails: Mail[] = [{
  id: 1,
  unread: true,
  from: { name: 'Alex Smith', email: 'alex.smith@example.com', avatar: { src: 'https://github.com/nuxt.png', alt: 'Alex Smith' } },
  subject: 'Meeting Schedule: Project Update',
  date: '14:32',
  datetime: '10 Jul 14:32',
  body: 'Hi there,\n\nJust a quick reminder that we have a meeting scheduled for tomorrow at 10 AM to discuss the latest project updates. Please come prepared with your progress reports.\n\nBest regards,\nAlex'
}, {
  id: 2,
  unread: true,
  from: { name: 'Jordan Brown', email: 'jordan.brown@example.com', avatar: { src: 'https://github.com/nuxtlabs.png', alt: 'Jordan Brown' } },
  subject: 'Urgent: Server Maintenance Tonight',
  date: '11:05',
  datetime: '10 Jul 11:05',
  body: 'Attention team,\n\nWe will be conducting server maintenance tonight from 11 PM to 2 AM. During this period, all services will be temporarily unavailable. We apologize for the inconvenience.\n\nIT Department'
}, {
  id: 3,
  from: { name: 'Taylor Green', email: 'taylor.green@example.com', avatar: { src: 'https://github.com/nuxt-hub.png', alt: 'Taylor Green' } },
  subject: 'Feedback Request: New Design Mockups',
  date: '09 Jul',
  datetime: '09 Jul 16:20',
  body: 'Hello,\n\nWe value your opinion! Could you please take a moment to review the attached design mockups for the upcoming dashboard refresh? Your feedback would be greatly appreciated.\n\nThank you,\nTaylor'
}, {
  id: 4,
  unread: true,
  from: { name: 'Morgan White', email: 'morgan.white@example.com', avatar: { src: 'https://github.com/vitejs.png', alt: 'Morgan White' } },
  subject: 'Invitation: Annual Company Retreat',
  date: '08 Jul',
  datetime: '08 Jul 10:12',
  body: 'Dear colleague,\n\nYou are cordially invited to our annual company retreat on August 15th. It will be a great opportunity to unwind and connect with your peers outside the office.\n\nRSVP by July 25th.\n\nHR Team'
}, {
  id: 5,
  from: { name: 'Casey Gray', email: 'casey.gray@example.com', avatar: { src: 'https://github.com/vuejs.png', alt: 'Casey Gray' } },
  subject: 'Reminder: Submit Your Timesheets',
  date: '07 Jul',
  datetime: '07 Jul 08:45',
  body: 'Hi all,\n\nThis is a friendly reminder to submit your timesheets by the end of the day Friday. Timely submission helps us process payroll without delays.\n\nThanks,\nCasey'
}]

const unreadCount = mails.filter(mail => mail.unread).length

const mailTabItems = [{ label: 'All', value: 'all' }, { label: 'Unread', value: 'unread' }]
const selectedMailTab = ref('all')

const filteredMails = computed(() => {
  return selectedMailTab.value === 'unread' ? mails.filter(mail => !!mail.unread) : mails
})

const selectedMail = ref<Mail | null>(mails[0]!)

// Reset selected mail if it's not in the filtered mails
watch(filteredMails, () => {
  if (!filteredMails.value.find(mail => mail.id === selectedMail.value?.id)) {
    selectedMail.value = filteredMails.value[0] ?? null
  }
})

const mailDropdownItems: DropdownMenuItem[][] = [[
  { label: 'Mark as unread', icon: 'i-lucide-check-circle' },
  { label: 'Mark as important', icon: 'i-lucide-triangle-alert' }
], [
  { label: 'Star thread', icon: 'i-lucide-star' }
]]

const reply = ref('')

// Customers — mirrors app/pages/customers.vue from the template.
type Customer = {
  id: number
  name: string
  username: string
  email: string
  location: string
  status: 'subscribed' | 'unsubscribed' | 'bounced'
  avatar: { src: string, alt: string }
}

const customers: Customer[] = [
  { id: 1, name: 'Alex Smith', username: 'alexsmith', email: 'alex.smith@example.com', location: 'New York, USA', status: 'subscribed', avatar: { src: 'https://github.com/nuxt.png', alt: 'Alex Smith' } },
  { id: 2, name: 'Jordan Brown', username: 'jordanbrown', email: 'jordan.brown@example.com', location: 'London, UK', status: 'unsubscribed', avatar: { src: 'https://github.com/nuxtlabs.png', alt: 'Jordan Brown' } },
  { id: 3, name: 'Taylor Green', username: 'taylorgreen', email: 'taylor.green@example.com', location: 'Paris, France', status: 'bounced', avatar: { src: 'https://github.com/nuxt-hub.png', alt: 'Taylor Green' } },
  { id: 4, name: 'Morgan White', username: 'morganwhite', email: 'morgan.white@example.com', location: 'Berlin, Germany', status: 'subscribed', avatar: { src: 'https://github.com/vitejs.png', alt: 'Morgan White' } },
  { id: 5, name: 'Casey Gray', username: 'caseygray', email: 'casey.gray@example.com', location: 'Tokyo, Japan', status: 'subscribed', avatar: { src: 'https://github.com/vuejs.png', alt: 'Casey Gray' } },
  { id: 6, name: 'Riley Davis', username: 'rileydavis', email: 'riley.davis@example.com', location: 'Sydney, Australia', status: 'subscribed', avatar: { src: 'https://github.com/unjs.png', alt: 'Riley Davis' } },
  { id: 7, name: 'Jamie Johnson', username: 'jamiejohnson', email: 'jamie.johnson@example.com', location: 'Toronto, Canada', status: 'unsubscribed', avatar: { src: 'https://github.com/nitrojs.png', alt: 'Jamie Johnson' } },
  { id: 8, name: 'Kelly Wilson', username: 'kellywilson', email: 'kelly.wilson@example.com', location: 'Madrid, Spain', status: 'subscribed', avatar: { src: 'https://github.com/vueuse.png', alt: 'Kelly Wilson' } }
]

const customerRowSelection = ref({ 1: true })
const customerEmailFilter = ref('')
const customerStatusFilter = ref('all')

const displayedCustomers = computed(() => {
  return customers.filter((customer) => {
    if (customerStatusFilter.value !== 'all' && customer.status !== customerStatusFilter.value) {
      return false
    }
    return customer.email.toLowerCase().includes(customerEmailFilter.value.toLowerCase())
  })
})

const customerStatusItems = [
  { label: 'All', value: 'all' },
  { label: 'Subscribed', value: 'subscribed' },
  { label: 'Unsubscribed', value: 'unsubscribed' },
  { label: 'Bounced', value: 'bounced' }
]

const customerRowItems: DropdownMenuItem[] = [
  { type: 'label', label: 'Actions' },
  { label: 'Copy customer ID', icon: 'i-lucide-copy' },
  { type: 'separator' },
  { label: 'View customer details', icon: 'i-lucide-list' },
  { type: 'separator' },
  { label: 'Delete customer', icon: 'i-lucide-trash', color: 'error' }
]

const customerColumns: TableColumn<Customer>[] = [{
  id: 'select',
  header: ({ table }) => h(UCheckbox, {
    'modelValue': table.getIsSomePageRowsSelected() ? 'indeterminate' : table.getIsAllPageRowsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => table.toggleAllPageRowsSelected(!!value),
    'ariaLabel': 'Select all'
  }),
  cell: ({ row }) => h(UCheckbox, {
    'modelValue': row.getIsSelected(),
    'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.toggleSelected(!!value),
    'ariaLabel': 'Select row'
  })
}, {
  accessorKey: 'id',
  header: 'ID'
}, {
  accessorKey: 'name',
  header: 'Name',
  cell: ({ row }) => {
    return h('div', { class: 'flex items-center gap-3' }, [
      h(UAvatar, { ...row.original.avatar, size: 'lg' }),
      h('div', undefined, [
        h('p', { class: 'font-medium text-highlighted' }, row.original.name),
        h('p', undefined, `@${row.original.username}`)
      ])
    ])
  }
}, {
  accessorKey: 'email',
  header: 'Email'
}, {
  accessorKey: 'location',
  header: 'Location'
}, {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => {
    const color = ({
      subscribed: 'success' as const,
      unsubscribed: 'error' as const,
      bounced: 'warning' as const
    })[row.original.status]

    return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.original.status)
  }
}, {
  id: 'actions',
  cell: () => {
    return h('div', { class: 'text-right' }, h(
      UDropdownMenu,
      { content: { align: 'end' }, items: customerRowItems },
      () => h(UButton, { icon: 'i-lucide-ellipsis-vertical', color: 'neutral', variant: 'ghost', class: 'ml-auto' })
    ))
  }
}]

// Settings — mirrors app/pages/settings.vue + settings/index.vue + settings/notifications.vue,
// trimmed to two sections without zod/UForm validation.
const settingsLinks = computed<NavigationMenuItem[][]>(() => [[{
  label: 'General',
  icon: 'i-lucide-user',
  active: settingsSection.value === 'general',
  onSelect: () => { settingsSection.value = 'general' }
}, {
  label: 'Notifications',
  icon: 'i-lucide-bell',
  active: settingsSection.value === 'notifications',
  onSelect: () => { settingsSection.value = 'notifications' }
}]])

const profile = reactive({
  name: 'Benjamin Canac',
  email: 'ben@nuxtlabs.com',
  username: 'benjamincanac',
  bio: ''
})

const profileFields = [
  { name: 'name', label: 'Name', description: 'Will appear on receipts, invoices, and other communication.' },
  { name: 'email', label: 'Email', description: 'Used to sign in, for email receipts and product updates.' },
  { name: 'username', label: 'Username', description: 'Your unique username for logging in and your profile URL.' }
] as const

const notificationsState = reactive<{ [key: string]: boolean }>({
  email: true,
  desktop: false,
  weekly_digest: false,
  product_updates: true
})

const notificationSections = [{
  title: 'Notification channels',
  description: 'Where can we notify you?',
  fields: [
    { name: 'email', label: 'Email', description: 'Receive a daily email digest.' },
    { name: 'desktop', label: 'Desktop', description: 'Receive desktop notifications.' }
  ]
}, {
  title: 'Account updates',
  description: 'Receive updates about Nuxt UI.',
  fields: [
    { name: 'weekly_digest', label: 'Weekly digest', description: 'Receive a weekly digest of news.' },
    { name: 'product_updates', label: 'Product updates', description: 'Receive a monthly email with all new features and updates.' }
  ]
}]

const customerPage = ref(1)

watch([customerEmailFilter, customerStatusFilter], () => {
  customerPage.value = 1
})

const paginatedCustomers = computed(() => {
  return displayedCustomers.value.slice((customerPage.value - 1) * 5, customerPage.value * 5)
})

const selectedCustomersCount = computed(() => {
  return Object.values(customerRowSelection.value).filter(Boolean).length
})

const pageTitles: Record<Page, string> = {
  home: 'Home',
  inbox: 'Inbox',
  customers: 'Customers',
  settings: 'Settings'
}
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

    <!-- Inbox replicates the template's split list / mail panes, so it swaps the whole panel. -->
    <template v-if="page === 'inbox'">
      <UDashboardPanel
        id="theme-studio-inbox-list"
        resizable
        :default-size="35"
        :min-size="25"
        :max-size="45"
        :ui="{ root: 'min-h-0' }"
      >
        <UDashboardNavbar title="Inbox">
          <template #leading>
            <UDashboardSidebarCollapse />
          </template>
          <template #trailing>
            <UBadge :label="String(filteredMails.length)" variant="subtle" />
          </template>

          <template #right>
            <UTabs
              v-model="selectedMailTab"
              :items="mailTabItems"
              :content="false"
              size="xs"
            />
          </template>
        </UDashboardNavbar>

        <div class="overflow-y-auto divide-y divide-default">
          <div v-for="mail in filteredMails" :key="mail.id">
            <div
              class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
              :class="[
                mail.unread ? 'text-highlighted' : 'text-toned',
                selectedMail && selectedMail.id === mail.id
                  ? 'border-primary bg-primary/10'
                  : 'border-bg hover:border-primary hover:bg-primary/5'
              ]"
              @click="selectedMail = mail"
            >
              <div class="flex items-center justify-between" :class="[mail.unread && 'font-semibold']">
                <div class="flex items-center gap-3">
                  {{ mail.from.name }}

                  <UChip v-if="mail.unread" />
                </div>

                <span>{{ mail.date }}</span>
              </div>
              <p class="truncate" :class="[mail.unread && 'font-semibold']">
                {{ mail.subject }}
              </p>
              <p class="text-dimmed line-clamp-1">
                {{ mail.body }}
              </p>
            </div>
          </div>
        </div>
      </UDashboardPanel>

      <UDashboardPanel v-if="selectedMail" id="theme-studio-inbox-mail" :ui="{ root: 'min-h-0' }">
        <UDashboardNavbar :title="selectedMail.subject" :toggle="false">
          <template #leading>
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              class="-ms-1.5"
              @click="selectedMail = null"
            />
          </template>

          <template #right>
            <UTooltip text="Archive">
              <UButton icon="i-lucide-inbox" color="neutral" variant="ghost" />
            </UTooltip>

            <UTooltip text="Reply">
              <UButton icon="i-lucide-reply" color="neutral" variant="ghost" />
            </UTooltip>

            <UDropdownMenu :items="mailDropdownItems">
              <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>

        <div class="flex flex-col sm:flex-row justify-between gap-1 p-4 sm:px-6 border-b border-default">
          <div class="flex items-start gap-4 sm:my-1.5">
            <UAvatar v-bind="selectedMail.from.avatar" size="3xl" />

            <div class="min-w-0">
              <p class="font-semibold text-highlighted">
                {{ selectedMail.from.name }}
              </p>
              <p class="text-muted">
                {{ selectedMail.from.email }}
              </p>
            </div>
          </div>

          <p class="max-sm:pl-16 text-muted text-sm sm:mt-2">
            {{ selectedMail.datetime }}
          </p>
        </div>

        <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
          <p class="whitespace-pre-wrap">
            {{ selectedMail.body }}
          </p>
        </div>

        <div class="pb-4 px-4 sm:px-6 shrink-0">
          <UCard variant="subtle" class="mt-auto" :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }">
            <template #header>
              <UIcon name="i-lucide-reply" class="size-5" />

              <span class="text-sm truncate">
                Reply to {{ selectedMail.from.name }} ({{ selectedMail.from.email }})
              </span>
            </template>

            <form @submit.prevent>
              <UTextarea
                v-model="reply"
                color="neutral"
                variant="none"
                autoresize
                placeholder="Write your reply..."
                :rows="4"
                class="w-full"
                :ui="{ base: 'p-0 resize-none' }"
              />

              <div class="flex items-center justify-between">
                <UButton color="neutral" variant="ghost" icon="i-lucide-paperclip" aria-label="Attach file" />

                <UButton type="submit" color="neutral" label="Send" icon="i-lucide-send" />
              </div>
            </form>
          </UCard>
        </div>
      </UDashboardPanel>
      <div v-else class="flex-1 hidden lg:flex items-center justify-center">
        <UIcon name="i-lucide-inbox" class="size-32 text-dimmed" />
      </div>
    </template>

    <UDashboardPanel v-else :ui="{ root: 'min-h-0' }">
      <template #header>
        <UDashboardNavbar :title="pageTitles[page]" :ui="{ right: 'gap-3' }">
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

            <UButton
              v-if="page === 'customers'"
              label="New customer"
              icon="i-lucide-plus"
            />
            <UDropdownMenu v-else :items="newItems">
              <UButton icon="i-lucide-plus" class="rounded-full" aria-label="New" />
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>

        <UDashboardToolbar v-if="page === 'home'">
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

        <UDashboardToolbar v-else-if="page === 'settings'">
          <UNavigationMenu :items="settingsLinks" highlight class="-mx-1 flex-1" />
        </UDashboardToolbar>
      </template>

      <template #body>
        <!-- The preview pane is far narrower than the real template's page —
             two-up until xl, and the joined-border look only when four fit. -->
        <!-- shrink-0 everywhere: the panel body is a scrollable flex column,
             and a shrinking child gets crushed into its own overflow-hidden -->
        <template v-if="page === 'home'">
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

        <template v-else-if="page === 'customers'">
          <div class="flex flex-wrap items-center justify-between gap-1.5 shrink-0">
            <UInput
              v-model="customerEmailFilter"
              class="max-w-sm"
              icon="i-lucide-search"
              placeholder="Filter emails..."
            />

            <div class="flex flex-wrap items-center gap-1.5">
              <UButton
                v-if="selectedCustomersCount"
                label="Delete"
                color="error"
                variant="subtle"
                icon="i-lucide-trash"
              >
                <template #trailing>
                  <UKbd>{{ selectedCustomersCount }}</UKbd>
                </template>
              </UButton>

              <USelect
                v-model="customerStatusFilter"
                :items="customerStatusItems"
                :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
                placeholder="Filter status"
                class="min-w-28"
              />
            </div>
          </div>

          <UTable
            v-model:row-selection="customerRowSelection"
            :data="paginatedCustomers"
            :columns="customerColumns"
            class="shrink-0"
            :ui="{
              base: 'table-fixed border-separate border-spacing-0',
              thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
              tbody: '[&>tr]:last:[&>td]:border-b-0',
              th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l-[length:var(--studio-border-width,1px)] last:border-r-[length:var(--studio-border-width,1px)]',
              td: 'border-b border-default'
            }"
          />

          <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto shrink-0">
            <div class="text-sm text-muted">
              {{ selectedCustomersCount }} of {{ displayedCustomers.length }} row(s) selected.
            </div>

            <UPagination
              v-model:page="customerPage"
              :items-per-page="5"
              :total="displayedCustomers.length"
            />
          </div>
        </template>

        <div v-else-if="page === 'settings'" class="flex flex-col gap-4 sm:gap-6 w-full lg:max-w-2xl mx-auto shrink-0">
          <template v-if="settingsSection === 'general'">
            <UPageCard
              title="Profile"
              description="These informations will be displayed publicly."
              variant="naked"
              orientation="horizontal"
            >
              <UButton label="Save changes" color="neutral" class="w-fit lg:ms-auto" />
            </UPageCard>

            <UPageCard variant="subtle">
              <template v-for="(field, index) in profileFields" :key="field.name">
                <USeparator v-if="index > 0" />

                <UFormField
                  :name="field.name"
                  :label="field.label"
                  :description="field.description"
                  required
                  class="flex max-sm:flex-col justify-between items-start gap-4"
                >
                  <UInput v-model="profile[field.name]" autocomplete="off" />
                </UFormField>
              </template>
              <USeparator />
              <UFormField
                name="bio"
                label="Bio"
                description="Brief description for your profile."
                class="flex max-sm:flex-col justify-between items-start gap-4"
                :ui="{ container: 'w-full' }"
              >
                <UTextarea v-model="profile.bio" :rows="4" autoresize class="w-full" />
              </UFormField>
            </UPageCard>
          </template>

          <template v-else>
            <div v-for="(section, index) in notificationSections" :key="index">
              <UPageCard
                :title="section.title"
                :description="section.description"
                variant="naked"
                class="mb-4"
              />

              <UPageCard variant="subtle" :ui="{ container: 'divide-y divide-default' }">
                <UFormField
                  v-for="field in section.fields"
                  :key="field.name"
                  :name="field.name"
                  :label="field.label"
                  :description="field.description"
                  class="flex items-center justify-between not-last:pb-4 gap-2"
                >
                  <USwitch v-model="notificationsState[field.name]" />
                </UFormField>
              </UPageCard>
            </div>
          </template>
        </div>
      </template>
    </UDashboardPanel>
  </UDashboardGroup>
</template>
