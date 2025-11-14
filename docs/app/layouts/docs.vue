<script setup lang="ts">
import { useFilter } from 'reka-ui'
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { navigationByCategory } = useNavigation(navigation!)

const { contains } = useFilter({ sensitivity: 'base' })
const filteredNavigation = computed(() => {
  if (!value.value) {
    return navigationByCategory.value
  }

  return navigationByCategory.value.map(item => ({
    ...item,
    children: item.children?.filter(child => contains(child.title as string, value.value) || contains(child.description as string, value.value))
  })).filter(item => item.children && item.children.length > 0)
})

const input = useTemplateRef('input')
const value = ref('')

defineShortcuts({
  '/': {
    usingInput: true,
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
            <template v-if="route.path.startsWith('/docs/components')" #top>
              <UInput ref="input" v-model="value" variant="soft" placeholder="Filter..." class="group">
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
