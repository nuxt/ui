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

            <UContentNavigation :navigation="navigation" highlight>
              <template #link-title="{ link }">
                <span class="inline-flex items-center gap-0.5">
                  {{ link.title }}

                  <sup v-if="link.new" class="text-[8px] font-medium text-(--ui-primary)">NEW</sup>
                  <UBadge v-if="link.module === 'ui-pro' && link.path.startsWith('/components')" color="neutral" variant="subtle" size="sm" class="ml-1">
                    <span class="text-[8px] font-semibold">PRO</span>
                  </UBadge>
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
