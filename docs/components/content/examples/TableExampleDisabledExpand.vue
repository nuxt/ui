<script setup>
const page = ref(1)

const { data } = useLazyFetch(() => `https://jsonplaceholder.typicode.com/users?_start=${page.value}&_limit=10`, {
  transform: (v) => {
    return v.map((v, index) => ({
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
</script>

<template>
  <div>
    <UTable v-model="selected" :rows="data" :columns="columns">
      <template #expand="{ row }">
        <div class="p-4">
          <pre>{{ row }}</pre>
        </div>
      </template>
    </UTable>
    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="10" :total="20" />
    </div>
  </div>
</template>