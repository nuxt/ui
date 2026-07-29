<script setup lang="ts">
import type { PopoverProps } from '@nuxt/ui'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  content?: PopoverProps['content']
}>(), {
  content: () => ({ align: 'center' })
})

const open = defineModel<boolean>('open', { default: false })

const { view, views } = useThemeStudioView()
const viewIcons = useStudioViewIcons()
const appConfig = useAppConfig()

const activeView = computed(() => views.find(tab => tab.value === view.value))

// The studio-only views (no /templates screenshot) lead; the template
// pages follow under their own heading.
const studioViews = views.filter(tab => !tab.image)
const templateViews = views.filter(tab => tab.image)
</script>

<template>
  <UPopover v-model:open="open" :content="props.content">
    <UButton
      :icon="viewIcons[view]"
      :label="activeView?.label"
      :trailing-icon="appConfig.ui.icons.chevronDown"
      color="neutral"
      variant="subtle"
      aria-label="Preview page"
      v-bind="$attrs"
    />

    <template #content>
      <div class="w-96 max-h-[70vh] overflow-y-auto p-1.5 overflow-x-hidden">
        <ThemeStudioViewGrid :items="studioViews" aria-label="Studio views" @select="open = false" />
        <USeparator class="mt-2 -mx-1.5 w-[calc(100%+1rem)]" />
        <div class="flex items-center justify-between gap-2 px-2 pt-2.5 pb-1.5">
          <span class="text-xs font-semibold text-highlighted">Template pages</span>

          <ULink to="/templates" class="inline-flex items-center gap-0.5 text-xs text-muted hover:text-default">
            View all templates
            <UIcon name="i-lucide-arrow-right" class="size-3" />
          </ULink>
        </div>

        <ThemeStudioViewGrid :items="templateViews" aria-label="Template pages" @select="open = false" />
      </div>
    </template>
  </UPopover>
</template>
