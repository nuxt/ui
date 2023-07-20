<template>
  <UContainer class="min-h-screen flex items-center">
    <UCard class="flex-1" :ui="{ background: 'bg-gray-50 dark:bg-gray-800/50', ring: 'ring-1 ring-gray-300 dark:ring-gray-700', divide: 'divide-y divide-gray-300 dark:divide-gray-700', header: { base: 'font-bold' } }">
      <template #header>
        Welcome to the playground!
      </template>

     
      <UTable
        :fn-sort="fnSort"
        :loading="loading"
        :columns="columns"
        :rows="data"
        :ui="{
          td: {
            padding: 'px-1 py-1',
          },
          th: {
            padding: 'px-1 py-1',
          }
        }
        "
      >
        <template #url-data="{ row }">
          <UAvatar :src="row.url" alt="Avatar" />
        </template>
      </UTable>
      <div class="flex w-full justify-end">
        <UPagination v-model="sortData.page" :page-count="sortData.perPage" :total="5000" />
      </div>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts"> 
const data = ref<[]>([])
const loading=ref<boolean>(false)
const sortData = ref<{ column: string | null; direction?: 'asc' | 'desc' | undefined ,page:number,perPage:number}>({
  column: null,
  direction: 'asc',
  page: 1,
  perPage: 10
})

const columns = [{
  key: 'id',
  label: 'ID',
  sortable: true
},
{
  key: 'title',
  label: 'Tile',
  sortable: true
}, {
  key: 'url',
  label: 'IMG'
}]

async function fetchPhotos () {
  try {
    loading.value = true
    const params = new URLSearchParams()
    if (sortData.value.column && sortData.value.direction)
    {
        params.append('_sort', sortData.value.column)
        params.append('_order', sortData.value.direction.toUpperCase())
    }
    if(sortData.value.page){
        params.append('_page', `${sortData.value.page}`)
        params.append('_limit',`${sortData.value.perPage}`)
    }
    const response = await fetch(`https://jsonplaceholder.typicode.com/photos?${params.toString()}`)
    data.value= await response.json()
    loading.value = false
  }
  catch (err) {
    loading.value = false
    console.log(err)
  }
}
watch(sortData.value, () => {
  fetchPhotos()
})
 function fnSort (sort: { column: string | null; direction?: 'asc' | 'desc' | undefined }) {
    sortData.value.column = sort.column
    sortData.value.direction = sort.direction
}
onMounted(() => {
  fetchPhotos()
})
</script>

<style>
body {
  @apply antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900;
}
</style>
