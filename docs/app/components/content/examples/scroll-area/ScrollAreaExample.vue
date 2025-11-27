<script setup lang="ts">
defineProps<{
  orientation?: 'vertical' | 'horizontal'
  virtualize?: boolean
  lanes?: number
  gap?: number
  padding?: number
}>()

interface ImageItem {
  title: string
  creator: string
  thumbnail: string
  likes: string
  liked: boolean
}

const items = ref<ImageItem[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const randomPage = Math.floor(Math.random() * 10) + 1
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks/search?q=painting&page=${randomPage}&limit=100&fields=title,artist_display,image_id&query[term][is_public_domain]=true`
    )
    const data = await response.json()

    items.value = data.data.map((artwork: any) => ({
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
    :virtualize="virtualize && { lanes: lanes && lanes > 1 ? lanes : undefined, gap, paddingStart: padding, paddingEnd: padding }"
    class="border border-default rounded-lg w-full h-128"
    :ui="{ viewport: 'h-full', item: 'shrink-0' }"
  >
    <UPageCard
      reverse
      variant="naked"
      class="w-full h-full magic-card"
      :ui="{
        body: 'w-full absolute bottom-0',
        container: 'lg:flex lg:flex-col flex-col-reverse gap-y-2 w-full'
      }"
    >
      <div class="w-full h-full max-h-[calc(100%-36px)] overflow-hidden">
        <NuxtImg :src="item.thumbnail" class="rounded-xl w-full h-full grow" />
      </div>
      <template #body>
        <div
          class="flex flex-row justify-between items-center gap-2 max-w-full"
        >
          <p class="ps-1 w-full text-sm truncate">
            {{ item.title }} <span class="text-muted">{{ item.creator }}</span>
          </p>
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
            :label="item.likes"
            :active="item.liked"
            :ui="
              item.liked
                ? { leadingIcon: 'text-red-500' }
                : { leadingIcon: 'text-gray-500' }
            "
          />
        </div>
      </template>
    </UPageCard>
  </UScrollArea>
  <div
    v-else-if="loading"
    class="flex justify-center items-center border border-default rounded-lg w-full h-96"
  >
    <p class="text-muted">
      Loading artworks...
    </p>
  </div>
</template>
