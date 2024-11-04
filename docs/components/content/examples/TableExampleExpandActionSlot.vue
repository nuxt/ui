<script setup lang='ts'>
const page = ref(1)

const { data, status } = await useLazyFetch(() => `https://jsonplaceholder.typicode.com/users?_start=${page.value}&_limit=10`, {
  transform: (v: any[]) => {
    return v.map((v: any, index: number) => ({
      ...v,
      // just for example don`t do this at home
      disabledExpand: (index + 1) % 2 === 0
    }))
  }
})

const columns = [
  {
    label: 'Name',
    key: 'name'
  },
  {
    label: 'Email',
    key: 'email'
  },
  {
    label: 'Address',
    key: 'address.street'
  }
]

const expand = ref({
  openedRows: [data.value?.[0]],
  row: {}
})
</script>

<template>
  <div>
    <UTable v-model:expand="expand" :rows="data!" :columns="columns" :loading="status === 'pending'">
      <template #expand="{ row }">
        <div class="p-4">
          <pre>{{ row }}</pre>
        </div>
      </template>
      <template #expand-action="{ row, isExpanded, toggle }">
        <UButton v-if="!row.disabledExpand" @click="toggle">{{ isExpanded ? 'collapse' : 'expand' }}</UButton>
      </template>
    </UTable>
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="10" :total="20" />
    </div>
  </div>
</template>
