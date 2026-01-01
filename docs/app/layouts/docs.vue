<script setup lang="ts">
import { useFilter } from 'reka-ui'
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { navigationByCategory } = useNavigation(navigation!)

const { contains } = useFilter({ sensitivity: 'base' })
const filteredNavigation = computed(() => {
  if (!searchTerm.value) {
    return navigationByCategory.value
  }

  return navigationByCategory.value.map(item => ({
    ...item,
    children: item.children?.filter(child => contains(child.title as string, searchTerm.value) || contains(child.description as string, searchTerm.value))
  })).filter(item => item.children && item.children.length > 0)
})

const input = useTemplateRef('input')
const isActiveSearch = computed(() => route.path.startsWith('/docs/components'))
const searchTerm = ref('')

watch(() => route.path, () => {
  if (!isActiveSearch.value) {
    searchTerm.value = ''
  }
})

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
            <template v-if="isActiveSearch" #top>
              <UInput ref="input" v-model="searchTerm" variant="soft" placeholder="Filter..." class="group">
                <template #trailing>
                  <UKbd value="/" variant="subtle" class="ring-muted bg-transparent text-muted" />
                </template>
              </UInput>
            </template>

            <UContentNavigation
              :key="route.path"
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
