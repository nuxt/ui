<script setup lang="ts">
defineProps<{
  orientation?: 'vertical' | 'horizontal'
  virtualize?: boolean
  lanes?: number
  gap?: number
  padding?: number
}>()

interface ImageItem {
  id: string
  title: string
  creator: string
  thumbnail: string
  likes: number
  liked: boolean
}

const items = ref<ImageItem[]>([])
const loading = ref(true)

const toggleLike = (item: ImageItem) => {
  item.liked = !item.liked
  item.likes += item.liked ? 1 : -1
}

onMounted(async () => {
  try {
    const randomPage = Math.floor(Math.random() * 10) + 1
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks/search?q=painting&page=${randomPage}&limit=100&fields=id,title,artist_display,image_id&query[term][is_public_domain]=true`
    )
    const data = await response.json()

    items.value = data.data.map((artwork: any) => ({
      id: artwork.id,
      title: artwork.title || 'Untitled',
      creator: artwork.artist_display?.split('\n')[0] || 'Unknown Artist',
      thumbnail: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
      likes: Math.floor(Math.random() * 100),
      liked: Math.random() > 0.75
    }))
  } catch (error) {
    console.error('Failed to fetch artworks:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <UScrollArea
    v-if="!loading && items.length"
    v-slot="{ item }"
    :items="items"
    :orientation="orientation"
    :virtualize="virtualize && { lanes: lanes && lanes > 1 ? lanes : undefined, gap, paddingStart: padding, paddingEnd: padding, estimateSize: 350 }"
    class="-m-4 w-[calc(100%+2rem)] h-128"
    :ui="{ viewport: 'h-full', item: 'shrink-0' }"
  >
    <UPageCard
      reverse
      variant="naked"
      class="w-full h-full"
      :ui="{
        body: 'w-full absolute bottom-0 flex flex-row justify-between items-center gap-2',
        container: 'lg:flex lg:flex-col gap-y-2 w-full'
      }"
    >
      <NuxtImg :src="item.thumbnail" :alt="item.title" class="rounded-lg w-full h-full max-h-[calc(100%-36px)]" />

      <template #body>
        <UTooltip :text="`${item.title}, ${item.creator}`">
          <p class="ps-1 text-sm truncate" :alt="`${item.title}, ${item.creator}`">
            {{ item.title }} <span class="text-muted">{{ item.creator }}</span>
          </p>
        </UTooltip>
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          square
          :icon="
            item.liked
              ? 'material-symbols:favorite-rounded'
              : 'material-symbols:favorite-outline-rounded'
          "
          :label="String(item.likes)"
          :ui="
            item.liked
              ? { leadingIcon: 'text-red-500' }
              : { leadingIcon: 'text-gray-500' }
          "
          @click="toggleLike(item)"
        />
      </template>
    </UPageCard>
  </UScrollArea>
  <div v-else-if="loading" class="flex justify-center items-center -m-4 w-[calc(100%+2rem)] h-128">
    <UIcon name="lucide:loader-circle" class="size-8 animate-spin" />
  </div>
</template>
