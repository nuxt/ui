<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { Filter, FilterFieldsConfig, FilterFieldConfig, FiltersVariant, FiltersSize, FiltersRadius, TableColumn } from '@nuxt/ui'

const UBadge = resolveComponent('UBadge')

// Local function to flatten fields (used in filtering)
function flattenFieldsConfig(config: FilterFieldsConfig): FilterFieldConfig[] {
  const flatFields: FilterFieldConfig[] = []
  const collect = (fields: FilterFieldConfig[]) => {
    for (const field of fields) {
      if (field.type) {
        flatFields.push(field)
      }
      if (field.children) {
        collect(field.children)
      }
    }
  }
  if (Array.isArray(config)) {
    collect(config as FilterFieldConfig[])
  }
  return flatFields
}

const variants = ['solid', 'outline']
const sizes = ['sm', 'md', 'lg']
const radiuses = ['md', 'full']

const attrs = reactive({
  variant: ['outline'],
  size: ['sm'],
  radius: ['md']
})

const prettyJson = ref(false)

// Filter state
const filters = ref<Filter[]>([])

// Available fields configuration
const fields: FilterFieldsConfig = [
  {
    key: 'name',
    label: 'Full name',
    type: 'text',
    placeholder: 'Enter a name...',
    icon: 'lucide:user',
    validation: (value) => {
      // It should not contain numbers
      if (/\d/.test(String(value))) {
        return 'Name must not contain numbers'
      }
      if (String(value).length < 3) {
        return 'Name must contain at least 3 characters'
      }
    },
    operators: [
      { value: 'contains', label: 'contains' },
      { value: 'starts_with', label: 'starts with' },
      { value: 'is', label: 'is' }
    ]
  },
  {
    key: 'name-structure',
    label: 'Name',
    icon: 'lucide:user',
    children: [
      {
        key: 'firstName',
        label: 'First name',
        type: 'text',
        placeholder: 'Enter a first name...',
        icon: 'lucide:user'
      },
      {
        key: 'lastName',
        label: 'Last name',
        type: 'text',
        placeholder: 'Enter a last name...',
        icon: 'lucide:user'
      }
    ]
  },
  {
    key: 'age',
    label: 'Age',
    type: 'number',
    defaultOperator: 'equals',
    min: 0,
    max: 120,
    step: 1,
    placeholder: 'Enter an age...',
    validation: (value) => {
      if (Number(value) < 18) {
        return 'Age must be greater than 18 years'
      }
      if (Number(value) > 20) {
        return 'Age must be less than 20 years'
      }
    },
    icon: 'lucide:calendar'
  },
  {
    key: 'score',
    label: 'Score',
    type: 'number',
    min: 0,
    max: 100,
    step: 1,
    placeholder: 'Enter a score...',
    icon: 'lucide:star',
    validation: (value) => {
      // Custom validation: score must be between 0 and 100
      const num = Number(value)
      return !Number.isNaN(num) && num >= 0 && num <= 100
    }
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'mail@example.com',
    icon: 'lucide:mail'
  },
  {
    key: 'website',
    label: 'Website',
    type: 'url',
    placeholder: 'https://example.com',
    icon: 'lucide:globe'
  },
  {
    key: 'phone',
    label: 'Phone',
    type: 'tel',
    placeholder: '+33 6 12 34 56 78',
    icon: 'lucide:phone'
  },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
      { value: 'archived', label: 'Archived' }
    ],
    icon: 'lucide:check-circle'
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'multiselect',
    options: [
      { value: 'important', label: 'Important' },
      { value: 'urgent', label: 'Urgent' },
      { value: 'normal', label: 'Normal' },
      { value: 'low', label: 'Low' }
    ],
    maxSelections: 4,
    icon: 'lucide:tag'
  },
  {
    key: 'createdAt',
    label: 'Creation date',
    type: 'date',
    icon: 'lucide:calendar-days'
  },
  {
    key: 'dateRange',
    label: 'Date range',
    type: 'date',
    defaultOperator: 'between',
    icon: 'lucide:calendar-range'
  },
  {
    key: 'startTime',
    label: 'Start time',
    type: 'time',
    icon: 'lucide:clock'
  },
  {
    key: 'appointment',
    label: 'Appointment',
    type: 'datetime',
    icon: 'lucide:calendar-clock'
  },
  {
    key: 'isActive',
    label: 'Active',
    type: 'boolean',
    onLabel: 'Yes',
    offLabel: 'No',
    icon: 'lucide:toggle-left'
  }
]

// Test data
const data = ref([
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    age: 30,
    score: 85,
    email: 'john.doe@example.com',
    website: 'https://johndoe.com',
    phone: '+33612345678',
    status: 'active',
    tags: ['important', 'urgent'],
    createdAt: '2024-01-15',
    dateRange: ['2024-01-10', '2024-01-20'],
    startTime: '09:00',
    appointment: '2024-01-15T14:30',
    isActive: true
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    age: 25,
    score: 72,
    email: 'jane.smith@example.com',
    website: 'https://janesmith.net',
    phone: '+33623456789',
    status: 'inactive',
    tags: ['normal'],
    createdAt: '2024-01-20',
    dateRange: ['2024-01-15', '2024-01-25'],
    startTime: '10:30',
    appointment: '2024-01-20T16:00',
    isActive: false
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    name: 'Bob Johnson',
    age: 35,
    score: 95,
    email: 'bob.johnson@example.com',
    website: 'https://bobjohnson.org',
    phone: '+33634567890',
    status: 'pending',
    tags: ['urgent', 'important'],
    createdAt: '2024-02-01',
    dateRange: ['2024-01-28', '2024-02-05'],
    startTime: '08:15',
    appointment: '2024-02-01T09:00',
    isActive: true
  },
  {
    id: 4,
    firstName: 'Alice',
    lastName: 'Williams',
    name: 'Alice Williams',
    age: 28,
    score: 68,
    email: 'alice.williams@example.com',
    website: 'https://alicewilliams.io',
    phone: '+33645678901',
    status: 'active',
    tags: ['normal', 'low'],
    createdAt: '2024-02-10',
    dateRange: ['2024-02-05', '2024-02-15'],
    startTime: '11:45',
    appointment: '2024-02-10T13:30',
    isActive: true
  },
  {
    id: 5,
    firstName: 'Charlie',
    lastName: 'Brown',
    name: 'Charlie Brown',
    age: 42,
    score: 55,
    email: 'charlie.brown@example.com',
    website: 'https://charliebrown.co',
    phone: '+33656789012',
    status: 'archived',
    tags: ['low'],
    createdAt: '2024-01-05',
    dateRange: ['2024-01-01', '2024-01-10'],
    startTime: '14:20',
    appointment: '2024-01-05T15:45',
    isActive: false
  },
  {
    id: 6,
    firstName: 'Diana',
    lastName: 'Prince',
    name: 'Diana Prince',
    age: 29,
    score: 90,
    email: 'diana.prince@example.com',
    website: 'https://dianaprince.com',
    phone: '+33667890123',
    status: 'active',
    tags: ['important'],
    createdAt: '2024-02-15',
    dateRange: ['2024-02-12', '2024-02-20'],
    startTime: '07:30',
    appointment: '2024-02-15T10:15',
    isActive: true
  }
])

// Filtering function
const filteredData = computed(() => {
  if (filters.value.length === 0) {
    return data.value
  }

  return data.value.filter((item: (typeof data.value)[0]) => {
    return filters.value.every((filter: Filter) => {
      const allFields = flattenFieldsConfig(fields)
      const field = allFields.find(
        (f: FilterFieldConfig) => f.key === filter.field
      )
      if (!field) {
        return true
      }

      const value = item[filter.field as keyof typeof item]

      switch (filter.operator) {
        case 'contains':
          return String(value)
            .toLowerCase()
            .includes(String(filter.values[0]).toLowerCase())
        case 'not_contains':
          return !String(value)
            .toLowerCase()
            .includes(String(filter.values[0]).toLowerCase())
        case 'starts_with':
          return String(value)
            .toLowerCase()
            .startsWith(String(filter.values[0]).toLowerCase())
        case 'ends_with':
          return String(value)
            .toLowerCase()
            .endsWith(String(filter.values[0]).toLowerCase())
        case 'is':
          return value === filter.values[0]
        case 'is_not':
          return value !== filter.values[0]
        case 'is_any_of':
          return Array.isArray(filter.values) && filter.values.includes(value)
        case 'is_not_any_of':
          return Array.isArray(filter.values) && !filter.values.includes(value)
        case 'includes_all':
          return (
            Array.isArray(value)
            && Array.isArray(filter.values)
            && filter.values.every((v: unknown) =>
              (value as unknown[]).includes(v)
            )
          )
        case 'excludes_all':
          return (
            Array.isArray(value)
            && Array.isArray(filter.values)
            && filter.values.every(
              (v: unknown) => !(value as unknown[]).includes(v)
            )
          )
        case 'equals':
          return Number(value) === Number(filter.values[0])
        case 'not_equals':
          return Number(value) !== Number(filter.values[0])
        case 'greater_than':
          return Number(value) > Number(filter.values[0])
        case 'less_than':
          return Number(value) < Number(filter.values[0])
        case 'between':
          // Support pour number, date, time et datetime
          if (field.type === 'time') {
            return (
              String(value) >= String(filter.values[0])
              && String(value) <= String(filter.values[1])
            )
          }
          if (field.type === 'datetime') {
            return (
              new Date(String(value)) >= new Date(String(filter.values[0]))
                && new Date(String(value)) <= new Date(String(filter.values[1]))
            )
          }
          if (field.type === 'date') {
            return (
              new Date(String(value)) >= new Date(String(filter.values[0]))
                && new Date(String(value)) <= new Date(String(filter.values[1]))
            )
          }
          // number
          return (
            Number(value) >= Number(filter.values[0])
            && Number(value) <= Number(filter.values[1])
          )
        case 'not_between':
          return (
            Number(value) < Number(filter.values[0])
            || Number(value) > Number(filter.values[1])
          )
        case 'before':
          // Support pour date, datetime et time
          if (field.type === 'time') {
            return String(value) < String(filter.values[0])
          }
          return new Date(String(value)) < new Date(String(filter.values[0]))
        case 'after':
          // Support pour date, datetime et time
          if (field.type === 'time') {
            return String(value) > String(filter.values[0])
          }
          return new Date(String(value)) > new Date(String(filter.values[0]))
        case 'empty':
          return (
            value === null
            || value === undefined
            || value === ''
            || (Array.isArray(value) && value.length === 0)
          )
        case 'not_empty':
          return (
            value !== null
            && value !== undefined
            && value !== ''
            && (!Array.isArray(value) || value.length > 0)
          )
        default:
          return true
      }
    })
  })
})

function onFiltersChange(newFilters: Filter[]) {
  filters.value = newFilters
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'success'
    case 'inactive':
      return 'neutral'
    case 'pending':
      return 'warning'
    case 'archived':
      return 'error'
    default:
      return 'neutral'
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'active':
      return 'Active'
    case 'inactive':
      return 'Inactive'
    case 'pending':
      return 'Pending'
    case 'archived':
      return 'Archived'
    default:
      return status
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatDateTime(dateTime: string) {
  return new Date(dateTime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Type for table data
type DataItem = typeof data.value[0]

// Table columns
const columns: TableColumn<DataItem>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const item = row.original
      return h('div', { class: 'flex items-center gap-2' }, [
        h('span', { class: 'font-semibold' }, item.name),
        item.isActive && h(UBadge, { color: 'success', variant: 'subtle', size: 'sm' }, () => 'Active')
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      const color = getStatusColor(status)
      return h(UBadge, { color, variant: 'subtle' }, () => getStatusLabel(status))
    }
  },
  {
    accessorKey: 'age',
    header: 'Age',
    cell: ({ row }) => `${row.getValue('age')} years`
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => row.getValue('score')
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => h('span', { class: 'lowercase' }, row.getValue('email'))
  },
  {
    accessorKey: 'website',
    header: 'Website',
    cell: ({ row }) => {
      const website = row.getValue('website') as string
      return h('a', {
        href: website,
        target: '_blank',
        rel: 'noopener noreferrer',
        class: 'text-primary hover:underline'
      }, website)
    }
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => row.getValue('phone')
  },
  {
    accessorKey: 'createdAt',
    header: 'Created on',
    cell: ({ row }) => formatDate(row.getValue('createdAt') as string)
  },
  {
    accessorKey: 'startTime',
    header: 'Time',
    cell: ({ row }) => row.getValue('startTime')
  },
  {
    accessorKey: 'appointment',
    header: 'Appointment',
    cell: ({ row }) => formatDateTime(row.getValue('appointment') as string)
  },
  {
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.getValue('tags') as string[]
      return h('div', { class: 'flex gap-1 flex-wrap' }, tags.map(tag =>
        h(UBadge, { key: tag, color: 'neutral', variant: 'subtle', size: 'md' }, () => tag)
      ))
    }
  }
]
</script>

<template>
  <Navbar>
    <USelect
      v-model="attrs.variant"
      :items="variants"
      multiple
      placeholder="Variant"
    />
    <USelect v-model="attrs.size" :items="sizes" multiple placeholder="Size" />
    <USelect
      v-model="attrs.radius"
      :items="radiuses"
      multiple
      placeholder="Radius"
    />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" class="flex flex-col gap-4 w-full" container-class="w-full align-start justify-start">
    <div class="w-full bg-muted rounded-sm p-4">
      <UFilters
        :filters="filters"
        :fields="fields"
        :variant="props?.variant as FiltersVariant"
        :size="props?.size as FiltersSize"
        :radius="props?.radius as FiltersRadius"
        @change="onFiltersChange"
      />
    </div>
  </Matrix>

  <UCard class="w-full">
    <template #header>
      <h3 class="text-lg font-semibold">
        Debug - Active filters (JSON)
      </h3>
    </template>
    <pre class="p-4 bg-gray-100 dark:bg-gray-900 rounded text-xs overflow-auto">{{ JSON.stringify(filters, null, prettyJson ? 2 : 0) }}</pre>
    <USwitch v-model="prettyJson" label="Pretty JSON" class="mt-2" />
  </UCard>

  <UCollapsible class="flex flex-col gap-2 w-full">
    <UButton
      class="group"
      icon="i-lucide-bar-chart"
      trailing-icon="i-lucide-chevron-down"
      color="neutral"
      variant="outline"
      label="Display results on test data"
      block
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
    />

    <template #content>
      <div class="space-y-4 w-full p-4 bg-gray-50 rounded-sm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">
                Active filters
              </h3>
            </template>
            <div class="text-3xl font-bold text-primary">
              {{ filters.length }}
            </div>
          </UCard>
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">
                Filtered results
              </h3>
            </template>
            <div class="text-3xl font-bold text-primary">
              {{ filteredData.length }}
            </div>
          </UCard>
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold">
                Total items
              </h3>
            </template>
            <div class="text-3xl font-bold text-primary">
              {{ data.length }}
            </div>
          </UCard>
        </div>

        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">
                Filtered results
              </h2>
              <UButton
                v-if="filters.length > 0"
                color="neutral"
                variant="ghost"
                size="sm"
                @click="filters = []"
              >
                Reset filters
              </UButton>
            </div>
          </template>

          <div v-if="filteredData.length === 0">
            <div class="text-center py-12 text-gray-500">
              <UIcon
                name="lucide:filter-x"
                class="h-12 w-12 mx-auto mb-4 opacity-50"
              />
              <p class="text-lg">
                No results match the selected filters
              </p>
            </div>
          </div>

          <UTable
            v-else
            :columns="columns"
            :data="filteredData"
            class="border border-accented rounded-sm"
          />
        </UCard>
      </div>
    </template>
  </UCollapsible>
</template>
