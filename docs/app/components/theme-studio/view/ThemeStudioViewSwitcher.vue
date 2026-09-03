<script setup lang="ts">
import type { PopoverProps, TabsItem } from '@nuxt/ui'
import { keepPanels } from '../../../utils/theme/studio'

/**
 * The view switcher. On the desktop bar: Components as a plain tab, the
 * template pages behind a second tab that opens their picker; once a
 * template is showing, that tab wears its name and glyph. In the mobile
 * menu: a plain select over every view, like the controls around it.
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  content?: PopoverProps['content']
  /** Stacked in the mobile menu: a select, like the rest of the controls there. */
  vertical?: boolean
}>(), {
  content: () => ({ align: 'center' })
})

const open = defineModel<boolean>('open', { default: false })

const { view, views } = useThemeStudio()
const studioIcons = useStudioIcons()
const appConfig = useAppConfig()

type View = typeof view.value

/** Every view as a select row, the mobile menu's flat list. */
const options = computed(() => views.map(tab => ({ label: tab.label, value: tab.value, icon: studioIcons[tab.value] })))

const selected = computed({
  get: () => view.value,
  set: (value: string | number | undefined) => {
    if (value) view.value = value as View
  }
})

// The views with a /templates screenshot share the second tab.
const templates = views.filter(tab => tab.image)
const activeTemplate = computed(() => templates.find(tab => tab.value === view.value))

const tabs = computed<TabsItem[]>(() => [
  { label: 'Components', value: 'grid', icon: studioIcons.grid },
  {
    label: activeTemplate.value?.label ?? 'Templates',
    value: 'templates',
    icon: activeTemplate.value ? studioIcons[activeTemplate.value.value] : studioIcons.templates
  }
])

// The templates tab only becomes active through the picker, the model never
// takes it: the view (and so the tabs) stays where it is until a pick.
const tab = computed({
  get: () => (activeTemplate.value ? 'templates' : view.value),
  set: (value: string | number) => {
    if (value !== 'templates') view.value = value as View
  }
})

/**
 * The panel follows the clicks, not the model: Reka emits a tab's value on
 * mousedown and again on focus, so a toggle off the model cancels itself.
 * The templates tab toggles the panel, the other closes it.
 */
function onTabsClick(event: MouseEvent) {
  const trigger = (event.target as HTMLElement | null)?.closest<HTMLElement>('[role="tab"]')
  if (!trigger) return

  const triggers = [...(trigger.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]') ?? [])]
  open.value = triggers.indexOf(trigger) === tabs.value.length - 1 ? !open.value : false
}

// Reka's single-select listbox toggles the selected item OFF on a second
// click and emits undefined; a re-click on the current template just closes.
function select(value: unknown) {
  if (value) view.value = value as View
  open.value = false
}

/**
 * A 2-column card grid: each template is its /templates screenshot over label
 * and blurb. The listbox frames itself with a ring, and an outline while an
 * option has keyboard focus: neither belongs around a grid of tiles.
 */
const gridUi = {
  root: 'ring-0 rounded-none overflow-visible has-focus-visible:outline-0',
  content: 'max-h-none overflow-visible',
  group: 'p-0 grid grid-cols-4 gap-0',
  item: 'flex-col p-2 rounded-lg ring-inset before:rounded-lg gap-2 data-[state=checked]:before:bg-elevated/50',
  itemDescription: 'whitespace-normal line-clamp-2 text-xs p-0',
  itemTrailing: 'hidden'
}
</script>

<template>
  <ThemeStudioToolbarSelect
    v-if="vertical"
    v-model="selected"
    :items="options"
    :icon="studioIcons[view]"
    aria-label="View"
    vertical
    v-bind="$attrs"
  />

  <!-- The tabs are the anchor, not the trigger: only the templates tab opens
       the panel, and a click on the tabs while it is open must not dismiss it
       (the tab's own handler decides). -->
  <UPopover
    v-else
    v-model:open="open"
    :content="{ onInteractOutside: keepPanels, ...props.content }"
    :ui="{ content: 'w-158 max-w-[calc(100vw-2rem)] p-1.5 max-h-[70vh] overflow-y-auto' }"
  >
    <template #anchor>
      <!-- styled like the color mode tabs: a plain pill on the elevated track -->
      <UTabs
        v-model="tab"
        :items="tabs"
        :content="false"
        color="neutral"
        size="xs"
        :ui="{
          indicator: 'bg-default',
          trigger: 'data-[state=active]:text-highlighted in-[[data-slot=list]:not(:has([data-slot=indicator]))]:data-[state=active]:before:bg-default'
        }"
        data-keep-panels
        aria-label="View"
        v-bind="$attrs"
        @click="onTabsClick"
      >
        <template #trailing="{ item }">
          <UIcon
            v-if="item.value === 'templates'"
            :name="appConfig.ui.icons.chevronDown"
            :class="['size-4 shrink-0 transition-transform duration-200', open && 'rotate-180']"
          />
        </template>
      </UTabs>
    </template>

    <template #content>
      <UListbox
        :model-value="view"
        :items="templates"
        value-key="value"
        highlight-on-hover
        orientation="vertical"
        :ui="gridUi"
        aria-label="Templates"
        @update:model-value="select"
      >
        <template #item-leading="{ item }">
          <UColorModeImage
            :light="`${item.image}-light.png`"
            :dark="`${item.image}-dark.png`"
            :alt="`${item.label} preview`"
            width="654"
            height="368"
            loading="lazy"
            class="w-full aspect-video rounded ring ring-default"
          />
        </template>
      </UListbox>
    </template>
  </UPopover>
</template>
