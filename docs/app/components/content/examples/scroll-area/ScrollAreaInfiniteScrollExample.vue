<script setup lang="ts">
type Recipe = {
  id: number
  name: string
  image: string
  difficulty: string
  cuisine: string
  rating: number
  reviewCount: number
  prepTimeMinutes: number
  cookTimeMinutes: number
}

type RecipeResponse = {
  recipes: Recipe[]
  total: number
  skip: number
  limit: number
}

const skip = ref(0)
const limit = 10

const { data, status, execute } = await useFetch('https://dummyjson.com/recipes?limit=10&select=name,image,difficulty,cuisine,rating,reviewCount,prepTimeMinutes,cookTimeMinutes', {
  key: 'scroll-area-recipes-infinite-scroll',
  params: { skip, limit },
  transform: (data?: RecipeResponse) => {
    return data?.recipes
  },
  lazy: true,
  immediate: false
})

const recipes = ref<Recipe[]>([])

watch(data, () => {
  if (data.value) {
    recipes.value = [...recipes.value, ...data.value]
  }
})

execute()

function loadMore() {
  if (status.value !== 'pending') {
    skip.value += limit
  }
}
</script>

<template>
  <UScrollArea
    v-slot="{ item }"
    :items="recipes"
    :virtualize="{
      estimateSize: 88,
      loadMoreThreshold: 5
    }"
    class="h-96 w-full"
    @load-more="loadMore"
  >
    <UPageCard
      orientation="horizontal"
      class="rounded-none"
    >
      <UUser
        :name="item.name"
        :description="`${item.prepTimeMinutes + item.cookTimeMinutes} min • ${item.reviewCount} reviews`"
        :avatar="{ src: item.image, alt: item.name }"
        size="lg"
      />

      <UButton color="neutral" variant="subtle" icon="i-lucide-star" :label="String(item.rating)" class="justify-self-end" />
    </UPageCard>
  </UScrollArea>

  <UProgress
    v-if="status === 'pending'"
    indeterminate
    size="xs"
    class="absolute top-0 inset-x-0 z-1"
    :ui="{ base: 'bg-default' }"
  />
</template>
