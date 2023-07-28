<script lang="ts" setup>
// Columns
const columns = [
  {
    key: 'id',
    label: '#',
    sortable: true
  },
  {
    key: 'title',
    label: 'Title',
    sortable: true
  },
  {
    key: 'completed',
    label: 'Status',
    sortable: true
  },
  {
    key: 'actions',
    label: 'Actions',
    sortable: false
  }
]

const selectedColumns = ref(columns)

// Selected Rows
const selectedRows = ref([])
function select (row) {
  const index = selectedRows.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value.splice(index, 1)
  }
}

// Actions
const actions = [
  [{
    key: 'completed',
    label: 'completed',
    icon: 'i-heroicons-check'
  }], [{
    key: 'uncompleted',
    label: 'In Progress',
    icon: 'i-heroicons-arrow-path'
  }]
]

// Filters
const todoStatus = [
  {
    key: 'uncompleted',
    label: 'In Progress',
    value: false
  },
  {
    key: 'completed',
    label: 'completed',
    value: true
  }
]
const search = ref('')
const selectedStatus = ref([])
const searchStatus = computed(() => {
  if (selectedStatus.value?.length === 0) {
    return ''
  }

  if (selectedStatus?.value?.length > 1) {
    return `?completed=${selectedStatus.value[0].value}&completed=${selectedStatus.value[1].value}`
  }

  return `?completed=${selectedStatus.value[0].value}`
})
const resetFilters = () => {
  search.value = ''
  selectedStatus.value = []
}

// Pagination
const page = ref(1)
const pageCount =  ref(10)
const pageTotal = ref(200) // This information should be obtained from the API, which is 10
const numberOfRows = computed(() => (page.value) * pageCount.value)

// Data
const { data: users, pending } = await useAsyncData<{
  id:number
  title:string
  completed:string
}[]>(
  'todos',
  () => $fetch(`https://jsonplaceholder.typicode.com/todos${searchStatus.value}`, {
    query: {
      q: search.value,
      '_page': page.value,
      '_limit': pageCount.value
    }
  }), {
    watch: [page, search, searchStatus, pageCount]
  })
</script>

<template>
  <UCard class="w-full" :ui="{ body: { padding: 'py-3 px-4' } }">
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Todos
      </h2>
    </template>

    <!-- Filters -->
    <div class="flex gap-4 border-b pb-3">
      <div>
        <UInput
          v-model="search"
          icon="i-heroicons-magnifying-glass-20-solid"
          size="sm"
          :trailing="false"
          placeholder="Search"
        />
      </div>

      <USelectMenu v-model="selectedStatus" :options="todoStatus" multiple placeholder="Status" />
    </div>

    <!-- Header and Action buttons -->
    <div class="flex justify-between items-center w-full border-b py-3">
      <div class="flex items-center">
        <span class="text-sm leading-5 text-gray-700 me-2">Rows per page:</span>
        <USelect
          v-model="pageCount"
          :options="[3, 5, 10, 20, 30, 40]"
          class="me-2 w-20"
        />
      </div>

      <div class="flex gap-1 items-center">
        <UDropdown v-if="selectedRows.length>1" :items="actions" :ui="{ width: 'w-36' }">
          <UButton
            icon="i-heroicons-chevron-down"
            trailing
            variant="soft"
            size="xs"
            class="border border-primary-300"
          >
            Mark as
          </UButton>
        </UDropdown>

        <USelectMenu v-model="selectedColumns" :options="columns" multiple>
          <UButton
            icon="i-heroicons-view-columns"
            variant="soft"
            size="xs"
            class="border border-primary-300"
          >
            Columns
          </UButton>
        </USelectMenu>

        <UButton
          icon="i-heroicons-funnel"
          variant="soft"
          color="red"
          size="xs"
          class="border border-red-300"
          @click="resetFilters"
        >
          Reset
        </UButton>
      </div>
    </div>

    <!-- Table -->
    <UTable
      v-model="selectedRows"
      :rows="users"
      :columns="selectedColumns"
      :loading="pending"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      :sort-button="{ size: '2xs', square: false, }"
      @select="select"
    >
      <template #completed-data="{ row }">
        <UBadge size="sm" :label="row.completed ? 'Completed' : 'In Progress'" :color="row.completed ? 'green': 'orange'" />
      </template>

      <template #actions-data="{ row }">
        <UButton
          v-if="!row.completed"
          icon="i-heroicons-check"
          size="2xs"
          color="green"
          variant="soft"
          :ui="{ rounded: 'rounded-full' }"
          class="border border-green-300"
          square
        />

        <UButton
          v-else
          icon="i-heroicons-arrow-path"
          size="2xs"
          color="orange"
          variant="soft"
          :ui="{ rounded: 'rounded-full' }"
          class="border border-orange-300"
          square
        />
      </template>
    </UTable>

    <!-- Number of rows & Pagination -->
    <template #footer>
      <div class="flex justify-between items-center">
        <div>
          <span class="text-sm leading-5 text-gray-700">
            Showing
            <span class="font-medium">{{ numberOfRows }}</span>
            to
            <span class="font-medium">{{ page * pageCount }}</span>
            of
            <span class="font-medium">{{ pageTotal }}</span>
            results
          </span>
        </div>

        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="pageTotal"
          :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: 'rounded-full min-w-[32px] justify-center',
            default: {
              activeButton: {
                variant: 'soft',
                class: 'border border-primary-300'
              },
            }
          }"
        />
      </div>
    </template>
  </UCard>
</template>
