<script setup lang="ts">
import { useFilter } from '@nuxt/ui/composables'
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const route = useRoute()
const { scoreItem } = useFilter()
const { navigationByCategory } = useNavigation(navigation!)

const filteredNavigation = computed(() => {
  if (!cleanedSearchTerm.value) {
    return navigationByCategory.value
  }

  return navigationByCategory.value.map(item => ({
    ...item,
    children: item.children?.filter(child => scoreItem(child, cleanedSearchTerm.value, ['title', 'description']) !== null)
  })).filter(item => item.children && item.children.length > 0)
})

const searchTerm = ref('')
const isSearchActive = computed(() => route.path.startsWith('/docs/components'))
const navigationKey = computed(() => `${route.path}-${searchTerm.value ? 'filtered' : 'unfiltered'}`)
const cleanedSearchTerm = computed(() => {
  return searchTerm.value
    .replace(/^U(?=[A-Z])/, '')
    .replace(/^u-/, '')
})

watch(() => route.path, () => {
  if (!isSearchActive.value) {
    searchTerm.value = ''
  }
})

const input = useTemplateRef('input')

defineShortcuts({
  '/': {
    usingInput: false,
    handler: () => {
      input.value?.inputRef?.focus()
    }
  }
})
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <template v-if="isSearchActive" #top>
              <UInput ref="input" v-model="searchTerm" variant="soft" placeholder="Filter..." class="group">
                <template #trailing>
                  <UKbd value="/" variant="subtle" class="ring-muted bg-transparent text-muted" />
                </template>
              </UInput>
            </template>

            <UContentNavigation
              :key="navigationKey"
              :collapsible="false"
              :navigation="filteredNavigation"
              highlight
              :ui="{
                linkTrailingBadge: 'font-semibold uppercase'
              }"
            />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
