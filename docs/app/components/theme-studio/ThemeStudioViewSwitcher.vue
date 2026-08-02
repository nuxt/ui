<script setup lang="ts">
import type { PopoverProps } from '@nuxt/ui'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  content?: PopoverProps['content']
  /** Set where the trigger carries no visible label of its own. */
  tooltip?: string
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
const sections = [
  { label: 'Studio views', items: views.filter(tab => !tab.image) },
  { label: 'Template pages', items: views.filter(tab => tab.image) }
]

/**
 * A 2-column card grid: each view is its /templates screenshot over label and
 * blurb; the studio-only views (grid, a11y) get an icon tile. Scrolling
 * belongs to the wrapper, so both sections move together.
 */
const gridUi = {
  root: 'ring-0 rounded-none overflow-visible',
  content: 'max-h-none overflow-visible',
  group: 'p-0 grid grid-cols-2 gap-1',
  item: 'flex-col p-2 rounded-xl ring-inset before:rounded-xl gap-2 data-[state=checked]:before:bg-elevated/50',
  itemDescription: 'whitespace-normal line-clamp-2 text-xs p-0',
  itemTrailing: 'hidden'
}
</script>

<template>
  <UPopover v-model:open="open" :content="props.content">
    <UTooltip :text="props.tooltip" :disabled="!props.tooltip">
      <UButton
        :icon="viewIcons[view]"
        :label="activeView?.label"
        :trailing-icon="appConfig.ui.icons.chevronDown"
        color="neutral"
        variant="outline"
        aria-label="Preview page"
        v-bind="$attrs"
      />
    </UTooltip>

    <template #content>
      <div class="w-96 max-h-[70vh] overflow-y-auto p-1.5 overflow-x-hidden">
        <template v-for="(section, index) in sections" :key="section.label">
          <!-- the templates heading sits between the two grids -->
          <template v-if="index">
            <USeparator class="mt-2 -mx-1.5 w-[calc(100%+1rem)]" />

            <div class="flex items-center justify-between gap-2 p-2 pb-1">
              <span class="text-sm font-semibold text-highlighted">{{ section.label }}</span>

              <UButton
                to="/templates"
                color="neutral"
                variant="ghost"
                size="sm"
                label="View all templates"
                trailing-icon="i-lucide-arrow-right"
              />
            </div>
          </template>

          <UListbox
            v-model="view"
            :items="section.items"
            value-key="value"
            :ui="gridUi"
            :aria-label="section.label"
            @update:model-value="open = false"
          >
            <template #item-leading="{ item }">
              <UColorModeImage
                v-if="item.image"
                :light="`${item.image}-light.png`"
                :dark="`${item.image}-dark.png`"
                :alt="`${item.label} preview`"
                width="654"
                height="368"
                loading="lazy"
                class="w-full aspect-video rounded-lg ring ring-default"
              />
              <span v-else class="w-full aspect-video rounded-lg ring ring-default bg-elevated/50 flex items-center justify-center">
                <UIcon :name="viewIcons[item.value]" class="size-6" />
              </span>
            </template>
          </UListbox>
        </template>
      </div>
    </template>
  </UPopover>
</template>
