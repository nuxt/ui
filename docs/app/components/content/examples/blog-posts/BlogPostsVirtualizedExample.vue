<script setup lang="ts">
const props = defineProps<{
  postCount?: number
  laneWidth?: number
}>()

const posts = computed(() => Array.from({ length: props.postCount || 100 }, (_, i) => ({
  title: `Nuxt Blog Post ${i + 1}`,
  description: `This is an example blog post description for post number ${i + 1}. It demonstrates how virtualization efficiently handles large lists.`,
  image: `https://picsum.photos/seed/${i + 1}/800/400`,
  date: new Date(2024, 0, 1 + i).toISOString().split('T')[0],
  authors: [{
    name: `Author ${(i % 5) + 1}`,
    avatar: { src: `https://i.pravatar.cc/150?img=${(i % 70) + 1}` }
  }]
})))

const virtualizeOptions = computed(() => ({
  estimateSize: 400,
  gap: 16,
  paddingStart: 16,
  paddingEnd: 16,
  laneWidth: props.laneWidth,
  minLanes: 1,
  maxLanes: 3
}))
</script>

<template>
  <UBlogPosts
    :posts="posts"
    :virtualize="virtualizeOptions"
    class="h-96 w-full"
  />
</template>
