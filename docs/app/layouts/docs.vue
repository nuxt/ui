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
              <div class="flex flex-col gap-2 w-[calc(100%+1rem)] -mx-2">
                <FrameworkSelect />

                <ModuleSelect />
              </div>
            </template>

            <UContentNavigation :navigation="navigation" highlight />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
