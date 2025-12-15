<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'

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

const { data, status, execute } = await useFetch('https://dummyjson.com/recipes?limit=10&select=name,image,difficulty,cuisine,rating,reviewCount,prepTimeMinutes,cookTimeMinutes', {
  key: 'scroll-area-recipes-infinite-scroll',
  params: { skip },
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

const scrollArea = useTemplateRef('scrollArea')

onMounted(() => {
  useInfiniteScroll(scrollArea.value?.$el, () => {
    skip.value += 10
  }, {
    distance: 200,
    canLoadMore: () => status.value !== 'pending'
  })
})
</script>

<template>
  <UScrollArea
    ref="scrollArea"
    v-slot="{ item }"
    :items="recipes"
    :virtualize="{ estimateSize: 88 }"
    class="h-96 w-full"
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
