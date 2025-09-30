<script setup lang="ts">
import type { UIMessage } from 'ai'
import type { ContentNavigationItem } from '@nuxt/content'

interface ContentSearchFile {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
}

defineProps<{
  files?: ContentSearchFile[]
  navigation?: ContentNavigationItem[]
}>()

const searchTerm = ref('')

const chat = ref(false)
const messages = ref<UIMessage[]>([])

const { frameworks } = useFrameworks()
const { links } = useSearch()

const groups = computed(() => [{
  id: 'framework',
  label: 'Framework',
  items: frameworks.value
}, {
  id: 'ia',
  label: 'AI',
  ignoreFilter: true,
  items: [{
    label: 'Ask Nuxt AI',
    icon: 'i-lucide-bot',
    ui: {
      itemLeadingIcon: 'group-data-highlighted:not-group-data-disabled:text-primary'
    },
    onSelect: (e: any) => {
      e.preventDefault()

      chat.value = true

      if (searchTerm.value) {
        messages.value = [{
          id: '1',
          role: 'user',
          parts: [{ type: 'text', text: searchTerm.value }]
        }]
      }
    }
  }]
}])
</script>

<template>
  <UContentSearch
    v-model:search-term="searchTerm"
    :links="links"
    :files="files"
    :groups="groups"
    :navigation="navigation"
    :fuse="{ resultLimit: 115 }"
  >
    <template v-if="chat" #content>
      <SearchChat :messages="messages" @close="chat = false" />
    </template>
  </UContentSearch>
</template>
