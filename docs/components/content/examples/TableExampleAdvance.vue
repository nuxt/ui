<script lang="ts" setup>
// Columns
const columns = [
  {
    key: 'id',
    label: 'ID'
  },
  {
    key: 'name',
    label: 'Name'
  },
  {
    key: 'phone',
    label: 'Phone'
  },
  // {
  //   key: 'username',
  //   label: 'Username',
  //   selected: false
  // },
  {
    key: 'email',
    label: 'Email'
  },
  {
    key: 'actions',
    label: 'Actions'
  }
]
const columnsTable = ref(
  columns.map((column) => {
    return {
      ...column,
      selected: true
    }
  })
)
const selectedColumns = computed(() =>  columnsTable.value.filter((column) => column.selected))
const isColumnControllerOpen = ref(false)

// Filters
const search = ref('')

// Paginations
const page = ref(1)
const pageCount =  ref(3)
// This information should be obtained from the API, which is 10
const pageTotal = ref(10)

const numberOfRows = computed(() => {
  if (page.value == 1 ) {
    return 1
  }

  return (page.value-1) * pageCount.value
})

// Data
const { data: users, pending } = await useAsyncData<{
  id:number
  name:string
  username:string
  email:string
  phone:string
}[]>(
  'users',
  () => $fetch('https://jsonplaceholder.typicode.com/users', {
    params: {
      q: search.value,
      '_page': page.value,
      '_limit': pageCount.value
    }
  }), {
    watch: [page, search, pageCount]
  })
</script>

<template>
  <!-- Columns -->
  <USlideover
    v-model="isColumnControllerOpen"
    :ui="{
      width: 'w-screen max-w-[350px]',
    }"
  >
    <div class="flex flex-col w-full px-8 py-4">
      <div class="border-b py-2">
        <h3 class="font-semibold text-md text-gray-800 leading-tight">
          Columns
        </h3>
      </div>

      <!-- Use draggable to make animation for coulmns -->
      <UCard
        v-for="(column, index) in columnsTable"
        :key="index"
        class="mt-2 pt-1 cursor-move"
        :ui="{
          rounded: 'rounded-md',
          body: {
            padding: 'p-3',
          },
        }"
      >
        <div class="flex justify-between w-full">
          <UCheckbox v-model="column.selected" :label="column.label" />

          <UIcon
            :name="column.selected ? 'i-heroicons-eye' : 'i-heroicons-eye-slash'"
            :class="column.selected ? 'text-green-500' : 'text-red-500'"
            size="md"
          />
        </div>
      </UCard>

      <div class="flex gap-2 mt-4 w-full">
        <UButton
          color="primary"
          variant="soft"
          size="md"
          class="w-1/2"
          icon="i-heroicons-check"
          @click="isColumnControllerOpen = false"
        >
          Save
        </UButton>

        <UButton
          color="red"
          size="md"
          icon="i-heroicons-x-mark"
          variant="soft"
          class="w-1/2"
          @click="isColumnControllerOpen = false"
        >
          Cancel
        </UButton>
      </div>
    </div>
  </USlideover>

  <UCard class="w-full" :ui="{ body: { padding: 'py-3 px-4' } }">
    <!-- Title -->
    <template #header>
      <h2 class="font-semibold text-xl text-gray-800 leading-tight">
        Users
      </h2>
    </template>

    <!-- Filters -->
    <div class="w-full border-b pb-3">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        size="sm"
        :trailing="false"
        placeholder="Search"
      />
    </div>

    <div>
      <!-- Header -->
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
          <UButton
            icon="i-heroicons-view-columns"
            size="sm"
            variant="soft"
            @click="isColumnControllerOpen = !isColumnControllerOpen"
          >
            Columns
          </UButton>

          <UButton icon="i-heroicons-plus-20-solid" size="sm" variant="soft">
            Add
          </UButton>

          <UButton
            icon="i-heroicons-funnel"
            size="sm"
            variant="soft"
            color="red"
          >
            Clear filters
          </UButton>
        </div>
      </div>

      <!-- Table -->
      <UTable :rows="users" :columns="selectedColumns" :loading="pending">
        <template #actions-data>
          <UButton
            icon="i-heroicons-trash-20-solid"
            size="sm"
            class="mr-2"
            variant="soft"
            color="red"
          />

          <UButton
            icon="i-heroicons-pencil-20-solid"
            size="sm"
            class="mr-2"
            variant="soft"
          />
        </template>
      </UTable>
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <!-- Number of rows -->
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

        <!-- Pagination -->
        <UPagination v-model="page" :page-count="pageCount" :total="pageTotal" />
      </div>
    </template>
  </UCard>
</template>
