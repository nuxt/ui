<script setup lang="ts">
import type { PopoverProps } from '@nuxt/ui'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  content?: PopoverProps['content']
  /** Stacked in the mobile menu: the panel takes the trigger's width, like a select. */
  vertical?: boolean
}>(), {
  content: () => ({ align: 'center' })
})

const open = defineModel<boolean>('open', { default: false })

const { view, views } = useThemeStudio()
const studioIcons = useStudioIcons()
const appConfig = useAppConfig()

const activeView = computed(() => views.find(tab => tab.value === view.value))

// Reka's single-select listbox toggles the selected item OFF on a second
// click and emits undefined; a re-click on the current view just closes.
function select(value: unknown) {
  if (value) view.value = value as typeof view.value
  open.value = false
}

// The studio-only views (no /templates screenshot) lead; the template
// pages follow under their own heading.
const sections = [
  { label: 'Studio views', items: views.filter(tab => !tab.image) },
  { label: 'Templates', items: views.filter(tab => tab.image) }
]

/**
 * A 2-column card grid: each view is its /templates screenshot over label and
 * blurb; the studio-only views (grid, a11y) get an icon tile. Scrolling
 * belongs to the wrapper, so both sections move together.
 */
const gridUi = {
  // the listbox frames itself with a ring, and an outline while an option
  // has keyboard focus: neither belongs around a grid of tiles
  root: 'ring-0 rounded-none overflow-visible has-focus-visible:outline-0',
  content: 'max-h-none overflow-visible',
  group: 'p-0 grid grid-cols-2 gap-1',
  item: 'flex-col p-2 rounded-lg ring-inset before:rounded-lg gap-2 data-[state=checked]:before:bg-elevated/50',
  itemDescription: 'whitespace-normal line-clamp-2 text-xs p-0',
  itemTrailing: 'hidden'
}
</script>

<template>
  <UPopover v-model:open="open" :content="props.content" :ui="{ content: [vertical ? 'w-(--reka-popper-anchor-width)' : 'w-96 max-w-[calc(100vw-2rem)]', 'p-1.5 max-h-[70vh] overflow-y-auto'] }">
    <UButton
      :icon="studioIcons[view]"
      :label="activeView?.label"
      :trailing-icon="appConfig.ui.icons.chevronDown"
      color="neutral"
      variant="outline"
      :ui="{
        label: 'flex-1 min-w-0 text-left truncate',
        trailingIcon: ['transition-transform duration-200', open && 'rotate-180']
      }"
      :aria-label="`View: ${activeView?.label}`"
      v-bind="$attrs"
    />

    <template #content>
      <template v-for="(section, index) in sections" :key="section.label">
        <!-- the templates heading sits between the two grids -->
        <template v-if="index">
          <USeparator class="mt-2 -mx-1.5 w-[calc(100%+1rem)]" />

          <div class="flex items-center justify-between gap-2 p-2 pb-0">
            <span class="text-sm font-semibold text-highlighted">{{ section.label }}</span>

            <UButton
              to="/templates"
              color="neutral"
              variant="link"
              size="sm"
              label="View all"
              :trailing-icon="appConfig.ui.icons.arrowRight"
            />
          </div>
        </template>

        <UListbox
          :model-value="view"
          :items="section.items"
          value-key="value"
          :ui="gridUi"
          :aria-label="section.label"
          @update:model-value="select"
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
              class="w-full aspect-video rounded ring ring-default"
            />
            <span v-else class="w-full aspect-video rounded ring ring-default bg-elevated/50 flex items-center justify-center">
              <UIcon :name="studioIcons[item.value]" class="size-6" />
            </span>
          </template>
        </UListbox>
      </template>
    </template>
  </UPopover>
</template>
