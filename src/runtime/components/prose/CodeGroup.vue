<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/code-group'

type ProseCodeGroup = ComponentConfig<typeof theme, AppConfig, 'codeGroup', 'ui.prose'>

export interface ProseCodeGroupProps {
  /**
   * The default tab to select.
   * @example '1'
   */
  defaultValue?: string
  /**
   * Sync the selected tab with a local storage key.
   */
  sync?: string
  class?: any
  ui?: ProseCodeGroup['slots']
}

export interface ProseCodeGroupSlots {
  default(props?: {}): any
}
</script>

<script setup lang="ts">
import { computed, watch, onMounted, onBeforeUpdate, shallowRef } from 'vue'
import { TabsRoot, TabsList, TabsIndicator, TabsTrigger, TabsContent } from 'reka-ui'
import { useState, useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { tv } from '../../utils/tv'
import UCodeIcon from './CodeIcon.vue'

const props = withDefaults(defineProps<ProseCodeGroupProps>(), {
  defaultValue: '0'
})
const slots = defineSlots<ProseCodeGroupSlots>()

const model = defineModel<string>()

const appConfig = useAppConfig() as ProseCodeGroup['AppConfig']
const uiProp = useComponentUI('prose.codeGroup', props)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.codeGroup || {}) })())

// Collect slot children in a shallowRef, seeded during setup for SSR/initial render,
// then refreshed via onBeforeUpdate. This avoids calling slots.default?.() inside
// computed, which would trigger:
// "[Vue warn]: Slot "default" invoked outside of the render function"
const slotChildren = shallowRef(slots.default?.())

const items = computed<{
  index: number
  label: string
  icon: string
  component: any
}[]>(() => {
  return slotChildren.value?.flatMap(transformSlot).filter(Boolean) || []
})

function transformSlot(slot: any, index: number) {
  if (typeof slot.type === 'symbol') {
    return slot.children?.map(transformSlot)
  }

  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    icon: slot.props?.icon,
    component: slot
  }
}

onMounted(() => {
  if (props.sync) {
    const syncKey = `code-group-${props.sync}`
    const syncValue = useState<string>(syncKey, () => localStorage.getItem(syncKey) as string)

    watch(syncValue, () => {
      if (!syncValue.value) return

      model.value = syncValue.value
    }, { immediate: true })

    watch(model, () => {
      if (!model.value) return

      syncValue.value = model.value
      localStorage.setItem(syncKey, model.value)
    })
  }
})

onBeforeUpdate(() => {
  slotChildren.value = slots.default?.()
})
</script>

<template>
  <TabsRoot v-model="model" :default-value="defaultValue" :unmount-on-hide="false" :class="ui.root({ class: [uiProp?.root, props.class] })">
    <TabsList :class="ui.list({ class: uiProp?.list })">
      <TabsIndicator :class="ui.indicator({ class: uiProp?.indicator })" />

      <TabsTrigger v-for="(item, index) of items" :key="index" :value="String(index)" :class="ui.trigger({ class: uiProp?.trigger })">
        <UCodeIcon :icon="item.icon" :filename="item.label" :class="ui.triggerIcon({ class: uiProp?.triggerIcon })" />

        <span :class="ui.triggerLabel({ class: uiProp?.triggerLabel })">{{ item.label }}</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent v-for="(item, index) of items" :key="index" :value="String(index)" as-child>
      <component :is="item.component" hide-header tabindex="-1" />
    </TabsContent>
  </TabsRoot>
</template>
