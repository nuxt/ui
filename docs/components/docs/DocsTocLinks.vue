<template>
  <ul>
    <li v-for="link in links" :key="link.text" :class="{ 'ml-3': link.depth === 3 }">
      <a
        :href="`#${link.id}`"
        class="block py-1 font-medium text-sm"
        :class="[activeHeadings.includes(link.id) ? 'text-primary-500 dark:text-primary-400' : 'hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300']"
        @click.prevent="scrollToHeading(link.id)"
      >
        {{ link.text }}
      </a>

      <DocsTocLinks v-if="link.children" :links="link.children" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { TocLink } from '@nuxt/content/dist/runtime/types'

defineProps({
  links: {
    type: Array as PropType<TocLink[]>,
    default: () => []
  }
})

const emit = defineEmits(['move'])

const route = useRoute()
const router = useRouter()
const { activeHeadings, updateHeadings } = useScrollspy()

watch(() => route.path, () => {
  setTimeout(() => {
    if (process.client) {
      updateHeadings([
        ...document.querySelectorAll('h2'),
        ...document.querySelectorAll('h3')
      ])
    }
  }, 300)
}, { immediate: true })

const scrollToHeading = (id: string) => {
  router.push(`#${id}`)
  emit('move', id)
}
</script>
