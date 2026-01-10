<script setup lang="ts">
import { useFilter } from 'reka-ui'
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const route = useRoute()
const { contains } = useFilter({ sensitivity: 'base' })
const { navigationByCategory } = useNavigation(navigation!)

const filteredNavigation = computed(() => {
  if (!searchTerm.value) {
    return navigationByCategory.value
  }

  return navigationByCategory.value.map(item => ({
    ...item,
    children: item.children?.filter(child => contains(child.title as string, searchTerm.value) || contains(child.description as string, searchTerm.value))
  })).filter(item => item.children && item.children.length > 0)
})

const searchTerm = ref('')
const isSearchActive = computed(() => route.path.startsWith('/docs/components'))
const navigationKey = computed(() => `${route.path}-${searchTerm.value ? 'filtered' : 'unfiltered'}`)

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
  <UMain as="main">
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
