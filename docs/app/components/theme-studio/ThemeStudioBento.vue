<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'

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

function showToast() {
  toast.add({
    title: 'Theme applied',
    description: 'This toast is styled by your theme too.',
    icon: 'i-lucide-swatch-book'
  })
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-start">
    <UCard :ui="{ body: 'flex flex-col gap-3' }">
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
          size="sm"
          class="capitalize"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UButton icon="i-lucide-plus" size="sm" label="New item" />
        <UButton
          icon="i-lucide-settings"
          size="sm"
          color="neutral"
          variant="outline"
          square
          aria-label="Settings"
        />
        <UButton size="sm" color="neutral" variant="ghost" label="Cancel" />
        <UButton size="sm" loading label="Saving" />
      </div>
    </UCard>

    <UCard :ui="{ body: 'flex flex-col gap-4' }">
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

    <UCard :ui="{ body: 'flex flex-col gap-3' }">
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

    <UCard :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Navigation
      </p>

      <UBreadcrumb :items="breadcrumbItems" />

      <UTabs :items="tabItems" :content="false" />

      <UPagination v-model:page="page" :total="50" size="sm" />
    </UCard>

    <UCard :ui="{ body: 'flex flex-col gap-3' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide">
        Content
      </p>

      <div class="flex items-center gap-3">
        <UChip inset color="success">
          <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
        </UChip>
        <div class="text-sm">
          <p class="font-medium text-highlighted">
            Benjamin Canac
          </p>
          <p class="text-muted">
            benjamincanac
          </p>
        </div>
        <UButton label="Follow" size="xs" color="neutral" variant="subtle" class="ms-auto" />
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

    <UCard :ui="{ body: 'flex flex-col gap-3 items-center' }">
      <p class="text-xs font-semibold text-muted uppercase tracking-wide self-start">
        Pickers
      </p>

      <UCalendar v-model="calendarDate" size="sm" class="w-full" />

      <UPinInput v-model="pin" :length="4" placeholder="○" />
    </UCard>
  </div>
</template>
