<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { framework, frameworks } = useSharedData()
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <template #top>
              <UDropdownMenu
                v-slot="{ open }"
                :modal="false"
                :items="frameworks"
                :ui="{ content: 'w-(--radix-dropdown-menu-trigger-width)' }"
              >
                <UButton
                  color="neutral"
                  variant="outline"
                  v-bind="frameworks.find(f => f.value === framework)"
                  block
                  trailing-icon="i-lucide-chevron-down"
                  :class="[open && 'bg-[var(--ui-bg-elevated)]']"
                  :ui="{
                    trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ')
                  }"
                  class="-mx-2 w-[calc(100%+1rem)]"
                />
              </UDropdownMenu>
            </template>

            <UContentNavigation :navigation="navigation" highlight />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
