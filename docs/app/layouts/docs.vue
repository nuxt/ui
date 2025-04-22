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
                <FrameworkSelect />
                <ModuleSelect />
              </div>
            </template>

            <UContentNavigation :navigation="navigation" highlight :ui="{ linkTrailingBadge: 'font-semibold uppercase' }">
              <template #link-title="{ link }">
                <span class="inline-flex items-center gap-0.5">
                  {{ link.title }}

                  <sup v-if="link.module === 'ui-pro'" class="text-[8px] font-medium text-primary">PRO</sup>
                </span>
              </template>
            </UContentNavigation>
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
