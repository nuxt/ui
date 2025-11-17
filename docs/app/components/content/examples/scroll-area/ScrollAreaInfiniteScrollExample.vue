<script setup lang="ts">
import { UButton } from '#components'

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
    :items="recipes"
    :virtualize="{
      estimateSize: 120,
      loadMoreThreshold: 5
    }"
    class="h-96 w-full"
    @load-more="loadMore"
  >
    <template #default="{ item }">
      <UPageCard :description="`${item.cuisine} • ${item.difficulty}`" orientation="horizontal" :ui="{ container: 'lg:flex flex-row' }">
        <template #header>
          <UUser
            :name="item.name"
            :description="`${item.prepTimeMinutes + item.cookTimeMinutes} min • ${item.reviewCount} reviews`"
            :avatar="{ src: item.image, alt: item.name }"
          />
        </template>
        <UButton color="neutral" variant="subtle" size="xl" class="fit-content justify-self-end">
          <UIcon name="i-lucide-star" class="size-3" />
          {{ item.rating }}
        </UButton>
      </UPageCard>
    </template>
  </UScrollArea>

  <UIcon v-if="status === 'pending'" name="i-lucide-loader-circle" class="animate-spin size-5 absolute bottom-4 left-0 right-0 mx-auto" />
</template>
