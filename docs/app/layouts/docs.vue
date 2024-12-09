<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <template #top>
              <div class="flex flex-col gap-2 w-[calc(100%+1.25rem)] -mx-2.5">
                <ModuleSelect />
                <FrameworkSelect />
              </div>
            </template>

            <UContentNavigation :navigation="navigation" highlight>
              <template #link-title="{ link }">
                {{ link.title }}

                <UTooltip v-if="link.module === 'ui-pro' && link.path.startsWith('/components')" text="Only available in nuxt/ui-pro" :content="{ side: 'right' }">
                  <UIcon name="i-lucide-boxes" class="size-3 align-middle mb-[3px] text-(--ui-text-dimmed) hover:text-(--ui-text-muted) transition-colors" />
                </UTooltip>
              </template>
            </UContentNavigation>
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
